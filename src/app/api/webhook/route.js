import Stripe from "stripe";
import { sql } from "@/database/mysql";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

export async function POST(req) {
    try {
        const body = await req.text();
        const headerList = headers();
        const sig = headerList.get("stripe-signature");
        let event;

        try {
            event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
        } catch (error) {
            return NextResponse.json({ error: error.message });
        }
        switch (event.type) {
            case "checkout.session.completed":
                const checkoutSessionCompleted = event.data.object;
                if (checkoutSessionCompleted.mode === "payment") {
                    // CONSULTA SENCILLA
                    await sql.query(`
                        UPDATE Orden
                        SET pagado = 1
                        WHERE usuarioId = ? AND pagado = 0
                    `, [checkoutSessionCompleted.metadata.id]);

                    if (checkoutSessionCompleted.metadata.cupon) {
                        // CONSULTA SENCILLA
                        await sql.query(`
                            UPDATE Cupon_Usando
                            SET usado = 1
                            WHERE usuarioId = ? AND usado = 0
                        `, [checkoutSessionCompleted.metadata.id]);
                    }
                }
                break;

            case "checkout.session.async_payment_failed":
                const asyncPaymentFailed = event.data.object;
                await deleteOrderAndRelated(asyncPaymentFailed.metadata.id);
                break;

            case "checkout.session.expired":
                const expiredSession = event.data.object;
                await deleteOrderAndRelated(expiredSession.metadata.id);
                break;

            default:
                await deleteOrderAndRelated(event.data.object.metadata.id);
                console.log(`Evento no manejado: ${event.type}`);
        }

        return NextResponse.json({ message: "Pedido realizado" });
    } catch (error) {
        return NextResponse.json({ message: "Error con el webhook: " + error.message });
    }
}

async function deleteOrderAndRelated(userId) {
    try {
        // CONSULTA ANIDADA
        await sql.query(`
            DELETE FROM Orden_Plato_Adicional WHERE orden_platoId IN (
                SELECT id FROM Orden_Plato WHERE ordenId IN (
                    SELECT id FROM Orden WHERE usuarioId = ? AND pagado = 0
                )
            )
        `, [userId]);

        // CONSULTA SENCILLA
        await sql.query(`
            DELETE FROM Orden_Plato WHERE ordenId IN (
                SELECT id FROM Orden WHERE usuarioId = ? AND pagado = 0
            )
        `, [userId]);

        // CONSULTA SENCILLA
        await sql.query(`
            DELETE FROM Orden WHERE usuarioId = ? AND pagado = 0
        `, [userId]);

    } catch (error) {
        console.error('Error al borrar el pedido:', error);
    }
}
