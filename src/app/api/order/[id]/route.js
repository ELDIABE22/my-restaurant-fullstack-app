import { connectDB } from "@/database/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function DELETE(res, { params }) {
    try {
        await connectDB();

        const orderDelete = await Order.findById(params.id);

        if (orderDelete) {
            if (orderDelete.status === "Pendiente") {
                await Order.findByIdAndDelete(params.id);
            } else if (orderDelete.status === "En camino") {
                return NextResponse.json({ message: "No puedes cancelar el pedido, ya va en camino" });
            }
        } else {
            return NextResponse.json({ message: "Error, intenta más tarde" });
        }

        return NextResponse.json({ message: "Pedido cancelado" });
    } catch (error) {
        return NextResponse.json({ message: "Error al cancelar el pedido" + error.message });

    }
}