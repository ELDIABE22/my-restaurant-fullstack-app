import { connectDB } from "@/database/mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Order from "@/models/Order";
import UnRegisteredOrderSchema from "@/models/UnregisteredOrder";
import UsedCoupons from "@/models/UsedCoupons";

export async function POST(req) {
    try {
        await connectDB();

        const data = await req.json();

        const userSession = await getServerSession(authOptions);

        let newOrder;

        if (userSession) {
            if (data.deliveryMethod.method === "Domicilio") {
                // Validar datos del pedido
                if (!data.info.name) {
                    return NextResponse.json({ message: "Se requiere un nombre" });
                } else if (!data.info.phone) {
                    return NextResponse.json({ message: "Se requiere un número de teléfono" });
                } else if (!data.info.address) {
                    return NextResponse.json({ message: "Se requiere una dirección de envío" });
                } else if (!data.info.city) {
                    return NextResponse.json({ message: "Se requiere una ciudad de envío" });
                }

                newOrder = await new Order({
                    user: userSession.user._id,
                    products: data.products,
                    paymentMethod: data.paymentMethod,
                    deliveryMethod: {
                        method: data.deliveryMethod.method,
                    },
                    shippingAddress: data.info.address,
                    city: data.info.city,
                    additionalDetails: data.info.additionalDetail,
                    totalAmount: data.total,
                    paid: true,
                })

                if (data.discount) {
                    await UsedCoupons.findOneAndUpdate({ userId: newOrder.user, used: false }, { used: true });
                }
            } else {
                // Validar datos del pedido
                if (!data.info.name) {
                    return NextResponse.json({ message: "Se requiere un nombre" });
                } else if (!data.deliveryMethod.tableNum) {
                    return NextResponse.json({ message: "Se requiere el numero de mesa" });
                }

                const validatedTableNum = await Order.find();

                // Verificar si algún pedido ya está ocupando la mesa
                const mesaOcupada = validatedTableNum.some(order => {
                    return order.status === "Pendiente" && order.paid && order.deliveryMethod.tableNumber == data.deliveryMethod.tableNum;
                });

                if (mesaOcupada) {
                    return NextResponse.json({ message: `La mesa ${data.deliveryMethod.tableNum} está ocupada!` });
                }

                newOrder = await new Order({
                    user: userSession.user._id,
                    products: data.products,
                    paymentMethod: data.paymentMethod,
                    deliveryMethod: {
                        method: data.deliveryMethod.method,
                        tableNumber: data.deliveryMethod.tableNum,
                    },
                    totalAmount: data.total,
                    paid: true,
                })
            }
        } else {
            // Validar datos del pedido
            if (!data.info.name) {
                return NextResponse.json({ message: "Se requiere un nombre" });
            } else if (!data.deliveryMethod.tableNum) {
                return NextResponse.json({ message: "Se requiere el numero de mesa" });
            }

            const validatedTableNum = await Order.find();

            // Verificar si algún pedido ya está ocupando la mesa
            const mesaOcupada = validatedTableNum.some(order => {
                return order.status === "Pendiente" && order.paid && order.deliveryMethod.tableNumber == data.deliveryMethod.tableNum;
            });

            if (mesaOcupada) {
                return NextResponse.json({ message: `La mesa ${data.deliveryMethod.tableNum} está ocupada!` });
            }

            const UnRegisteredOrder = await new UnRegisteredOrderSchema({ name: data.info.name });

            const userSave = await UnRegisteredOrder.save();

            newOrder = await new Order({
                user: userSave._id,
                products: data.products,
                paymentMethod: data.paymentMethod,
                deliveryMethod: {
                    method: data.deliveryMethod.method,
                    tableNumber: data.deliveryMethod.tableNum,
                },
                totalAmount: data.total,
                paid: true,
            })

            await UnRegisteredOrderSchema.findByIdAndUpdate({ _id: UnRegisteredOrder._id }, { order: newOrder._id });
        }

        await newOrder.save();

        return NextResponse.json({ message: "Pedido realizado" });

    } catch (error) {
        return NextResponse.json({ message: 'Error al seleccionar el pago por efectivo! ' + error });
    }
}