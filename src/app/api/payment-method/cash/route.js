import { sql } from "@/database/mysql";
import { id25Bytes } from "@/utils/uuidv4";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";


export async function POST(req) {
    try {
        const data = await req.json();
        const userSession = await getServerSession(authOptions);

        if (!userSession) {
            return NextResponse.json({ message: "Sesión no encontrada" });
        }

        const { deliveryMethod, info, paymentMethod, total, products, discount } = data;

        if (deliveryMethod.method === "Domicilio") {
            // Validar datos del pedido
            if (!info.name) return NextResponse.json({ message: "Se requiere un nombre" });
            if (!info.phone) return NextResponse.json({ message: "Se requiere un número de teléfono" });
            if (!info.address) return NextResponse.json({ message: "Se requiere una dirección de envío" });
            if (!info.city) return NextResponse.json({ message: "Se requiere una ciudad de envío" });

            const orderId = id25Bytes();
            const orderValues = [orderId, userSession.user.id, paymentMethod, deliveryMethod.method, info.address, info.city, info.additionalDetail, total, 1];

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

                if (discount) {
                    await sql.query(`
                        UPDATE Cupon_Usado
                        SET usado = 1
                        WHERE usuarioId = ? AND usado = 0
                    `, [userSession.user.id]);
                }

                // Confirmar transacción
                await sql.commit();
                return NextResponse.json({ message: "Pedido realizado" });
            } catch (error) {
                await sql.rollback();
                console.error('Error durante la transacción:', error);
                return NextResponse.json({ message: 'Error durante la transacción', error });
            }
        } else {
            // Validar datos del pedido para método de entrega en mesa
            if (!info.name) return NextResponse.json({ message: "Se requiere un nombre" });
            if (!deliveryMethod.tableNum) return NextResponse.json({ message: "Se requiere el número de mesa" });

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
                const orderValues = [orderId, userSession.user.id, paymentMethod, deliveryMethod.method, deliveryMethod.tableNum, total, 1];

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
                return NextResponse.json({ message: "Pedido realizado" });
            } catch (error) {
                await sql.rollback();
                console.error('Error durante la transacción:', error);
                return NextResponse.json({ message: 'Error durante la transacción', error });
            }
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        return NextResponse.json({ message: 'Error en la solicitud', error });
    }
}