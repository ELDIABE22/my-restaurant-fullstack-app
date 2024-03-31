import Order from "@/models/Order";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import UnRegisteredOrderSchema from "@/models/UnregisteredOrder";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const stripe = new Stripe(process.env.STRIPE_SECRET);

export async function POST(req) {
    const data = await req.json();

    const userSession = await getServerSession(authOptions);

    let UnRegisteredOrder;

    let userSave;

    let metadata = {};

    if (!userSession) {
        // Validar datos del pedido
        if (!data.info.name) {
            return NextResponse.json({ message: "Se requiere un nombre" });
        } else if (!data.deliveryMethod.tableNum) {
            return NextResponse.json({ message: "Se requiere el numero de mesa" });
        }

        const validatedTableNum = await Order.find();

        // Verificar si algún pedido ya está ocupando la mesa
        const mesaOcupada = validatedTableNum.some(order => {
            return order.status === "Pendiente" && order.deliveryMethod.tableNumber == data.deliveryMethod.tableNum;
        });

        if (mesaOcupada) {
            return NextResponse.json({ message: `La mesa ${data.deliveryMethod.tableNum} está ocupada!` });
        }

        UnRegisteredOrder = await new UnRegisteredOrderSchema({ name: data.info.name });

        userSave = await UnRegisteredOrder.save();

        metadata = {
            id: userSave._id.toString(),
            cupon: data.discount,
        }
    } else {
        metadata = {
            id: data.info.id,
            cupon: data.discount,
        }
    }

    try {
        const session = await stripe.checkout.sessions.create({
            success_url: `${process.env.NEXTAUTH_URL}/orders`,
            cancel_url: process.env.NEXTAUTH_URL,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Total",
                        },
                        unit_amount: Math.round(data.total * 100),
                    },
                    quantity: 1,
                }
            ],
            mode: "payment",
            metadata: metadata,
        });

        let newOrder;

        if (session && userSession) {
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
                })
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
                    return order.status === "Pendiente" && order.deliveryMethod.tableNumber == data.deliveryMethod.tableNum;
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
                })
            }
        } else if (session) {
            newOrder = await new Order({
                user: userSave._id,
                products: data.products,
                paymentMethod: data.paymentMethod,
                deliveryMethod: {
                    method: data.deliveryMethod.method,
                    tableNumber: data.deliveryMethod.tableNum,
                },
                totalAmount: data.total,
            })

            await UnRegisteredOrderSchema.findByIdAndUpdate({ _id: userSave._id }, { order: newOrder._id });
        } else if (!session && !userSession) {
            await UnRegisteredOrderSchema.findByIdAndDelete({ _id: userSave._id });
        } else {
            await UnRegisteredOrderSchema.findByIdAndDelete({ _id: userSave._id });
            return NextResponse.json({ message: "Error, intenta más tarde" });
        }

        await newOrder.save();

        return NextResponse.json(session);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error al hacer el pago por tarjeta! ' + error });
    }
}
