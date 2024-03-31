import { connectDB } from "@/database/mongodb";
import Order from "@/models/Order";
import UnregisteredOrder from "@/models/UnregisteredOrder";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        const order = await Order.find();

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ message: 'Error al consultar los pedidos! ' + error });
    }
}

export async function DELETE(req) {
    try {
        await connectDB();

        const url = new URL(req.url);

        const _id = url.searchParams.get('_id');

        await Order.findByIdAndDelete({ _id });

        await UnregisteredOrder.findOneAndDelete({ order: _id });

        return NextResponse.json({ message: 'Pedido eliminado' });
    } catch (error) {
        return NextResponse.json({ message: 'Error al eliminar el pedido! ' + error });
    }
}

export async function PUT(req) {
    try {
        await connectDB();

        const { _id, status, deliveryMethod } = await req.json();

        // Validar los datos de entrada
        if (!_id || !status || !deliveryMethod) {
            throw new Error({ message: "Datos de entrada incompletos" });
        }

        const order = await Order.findById(_id);

        if (!order) {
            throw new Error({ message: "Pedido no encontrado" });
        }

        // Validar el estado del pedido
        if (order.status === "Entregado") {
            throw new Error({ message: "El pedido ya está entregado" });
        }

        // Actualizar el estado del pedido
        let newStatus;
        if (deliveryMethod === "Domicilio") {
            if (status === "Pendiente") {
                newStatus = "En camino";
            } else if (status === "En camino") {
                newStatus = "Entregado";
            }
        } else if (deliveryMethod === "Restaurante") {
            if (status === "Pendiente") {
                newStatus = "Entregado";
            }
        }

        if (newStatus) {
            await Order.findByIdAndUpdate(_id, { status: newStatus });
        } else {
            throw new Error({ message: "Estado de pedido no válido" });
        }

        return NextResponse.json({ message: "Estado del pedido actualizado" });
    } catch (error) {
        return NextResponse.json({ message: 'Error al actualizar el estado del pedido: ' + error });
    }
}
