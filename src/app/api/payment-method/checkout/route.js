import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { sql } from "@/database/mysql";
import Stripe from "stripe";
import { id25Bytes } from "@/utils/uuidv4";

const stripe = new Stripe(process.env.STRIPE_SECRET);

export async function POST(req) {
    const data = await req.json();
    const userSession = await getServerSession(authOptions);

    const { deliveryMethod, info, paymentMethod, total, products, discount } = data;

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
                        unit_amount: Math.round(total * 100),
                    },
                    quantity: 1,
                }
            ],
            mode: "payment",
            metadata: {
                id: info.id,
                cupon: discount,
            },
        });

        if (session && userSession) {
            if (deliveryMethod.method === "Domicilio") {

                // Validar datos del pedido
                if (!info.name) {
                    return NextResponse.json({ message: "Se requiere un nombre" });
                } else if (!info.phone) {
                    return NextResponse.json({ message: "Se requiere un número de teléfono" });
                } else if (!info.address) {
                    return NextResponse.json({ message: "Se requiere una dirección de envío" });
                } else if (!info.city) {
                    return NextResponse.json({ message: "Se requiere una ciudad de envío" });
                }

                const orderId = id25Bytes();
                const orderValues = [orderId, userSession.user.id, paymentMethod, deliveryMethod.method, info.address, info.city, info.additionalDetail, total, 0];

                try {
                    // Iniciar transacción
                    await sql.beginTransaction();

                    // Insertar en Orden
                    await sql.query(`
                        INSERT INTO Orden (
                            id, usuarioId, metodo_pago, metodo_entrega, direccion_envio, ciudad_envio, detalles_adicionales, total, pagado
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, orderValues);

                    // Insertar en Orden_Plato y Orden_Plato_Adicional
                    for (const product of products) {
                        const orderPlatoId = id25Bytes();
                        await sql.query(`
                            INSERT INTO Orden_Plato (
                                id, ordenId, nombre, cantidad
                            ) VALUES (?, ?, ?, ?)
                        `, [orderPlatoId, orderId, product.nombre, product.cantidad]);

                        if (product.additions && product.additions.length > 0) {
                            for (const addition of product.additions) {
                                await sql.query(`
                                INSERT INTO Orden_Plato_Adicional (
                                    id, orden_platoId, nombre, cantidad
                                ) VALUES (?, ?, ?, ?)
                            `, [id25Bytes(), orderPlatoId, addition.nombre, addition.cantidad]);
                            }
                        }
                    }

                    // Confirmar transacción
                    await sql.commit();
                } catch (error) {
                    await sql.rollback();
                    console.error('Error durante la transacción:', error);
                    return NextResponse.json({ message: 'Error durante la transacción', error });
                }
            } else {
                // Validar datos del pedido
                if (!info.name) {
                    return NextResponse.json({ message: "Se requiere un nombre" });
                } else if (!deliveryMethod.tableNum) {
                    return NextResponse.json({ message: "Se requiere el número de mesa" });
                }

                try {
                    const [validatedTableNum] = await sql.query(`
                        SELECT * 
                        FROM Orden
                        WHERE estado = 'Pendiente' AND pagado = 1 AND numero_mesa = ?
                    `, [deliveryMethod.tableNum]);

                    if (validatedTableNum.length > 0) {
                        return NextResponse.json({ message: `La mesa ${deliveryMethod.tableNum} está ocupada!` });
                    }

                    const orderId = id25Bytes();
                    const orderValues = [orderId, userSession.user.id, paymentMethod, deliveryMethod.method, deliveryMethod.tableNum, total, 0];

                    // Iniciar transacción
                    await sql.beginTransaction();

                    // Insertar en Orden
                    await sql.query(`
                        INSERT INTO Orden (
                            id, usuarioId, metodo_pago, metodo_entrega, numero_mesa, total, pagado
                        ) VALUES (?, ?, ?, ?, ?, ?, ?)
                    `, orderValues);

                    // Insertar en Orden_Plato y Orden_Plato_Adicional
                    for (const product of products) {
                        const orderPlatoId = id25Bytes();
                        await sql.query(`
                            INSERT INTO Orden_Plato (
                                id, ordenId, nombre, cantidad
                            ) VALUES (?, ?, ?, ?)
                        `, [orderPlatoId, orderId, product.nombre, product.cantidad]);

                        if (product.additions && product.additions.length > 0) {
                            for (const addition of product.additions) {
                                await sql.query(`
                                    INSERT INTO Orden_Plato_Adicional (
                                        id, orden_platoId, nombre, cantidad
                                    ) VALUES (?, ?, ?, ?)
                                `, [id25Bytes(), orderPlatoId, addition.nombre, addition.cantidad]);
                            }
                        }
                    }

                    // Confirmar transacción
                    await sql.commit();
                } catch (error) {
                    await sql.rollback();
                    console.error('Error durante la transacción:', error);
                    return NextResponse.json({ message: 'Error durante la transacción', error });
                }
            }
        } else if (!session && !userSession) {
            const orderId = data.info.id; // Obtener el id de la orden

            try {
                await sql.query(`
                    DELETE FROM Orden WHERE id = ?
                `, [orderId]);

                await sql.query(`
                    DELETE FROM Orden_Plato WHERE ordenId = ?
                `, [orderId]);

                // CONSULTA ANIDADA
                await sql.query(`
                    DELETE FROM Orden_Plato_Adicional WHERE orden_platoId IN (
                        SELECT id FROM Orden_Plato WHERE ordenId = ?
                    )
                `, [orderId]);

                return NextResponse.json({ message: "Pedido cancelado debido a errores" });
            } catch (error) {
                console.error('Error al borrar el pedido:', error);
                return NextResponse.json({ message: 'Error al borrar el pedido', error });
            }
        } else {
            const orderId = data.info.id; // Obtener el id de la orden

            try {
                await sql.query(`
                    DELETE FROM Orden WHERE id = ?
                `, [orderId]);

                await sql.query(`
                    DELETE FROM Orden_Plato WHERE ordenId = ?
                `, [orderId]);

                // CONSULTA ANIDADA
                await sql.query(`
                    DELETE FROM Orden_Plato_Adicional WHERE orden_platoId IN (
                        SELECT id FROM Orden_Plato WHERE ordenId = ?
                    )
                `, [orderId]);

                return NextResponse.json({ message: "Error, intenta más tarde" });
            } catch (error) {
                console.error('Error al borrar el pedido:', error);
                return NextResponse.json({ message: 'Error al borrar el pedido', error });
            }
        }

        return NextResponse.json(session);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error al hacer el pago por tarjeta! ' + error });
    }
}
