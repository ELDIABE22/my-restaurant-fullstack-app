import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import Order from "@/models/Order";
import { connectDB } from "@/database/mongodb";
import UsedCoupons from "@/models/UsedCoupons";

const stripe = new Stripe(process.env.STRIPE_SECRET);

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.text();
        const headerList = headers();
        const sig = headerList.get("stripe-signature");

        let event

        try {
            event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
        } catch (error) {
            return NextResponse.json({ error: error.message });

        }

        switch (event.type) {
            case "checkout.session.completed":
                const checkoutSessionCompleted = event.data.object;
                if (checkoutSessionCompleted.mode === "payment") {
                    await Order.findOneAndUpdate({ user: checkoutSessionCompleted.metadata.id, paid: false }, { paid: true });

                    if (checkoutSessionCompleted.metadata.cupon) {
                        await UsedCoupons.findOneAndUpdate({ userId: checkoutSessionCompleted.metadata.id, used: false }, { used: true });
                    }
                }
                break;
            case "checkout.session.async_payment_failed":
                const asyncPaymentFailed = event.data.object;
                await Order.findOneAndDelete({ user: asyncPaymentFailed.metadata.id, paid: false });
                break;
            case "checkout.session.expired":
                const expiredSession = event.data.object;
                await Order.findOneAndDelete({ user: expiredSession.metadata.id, paid: false });
                break;
            default:
                console.log(`Evento no manejado: ${event.type}`);
                await Order.findOneAndDelete({ user: event.data.object.metadata.id, paid: false });
        }

        return NextResponse.json({ message: "Pedido realizado" });
    } catch (error) {
        return NextResponse.json({ message: "Error con el webhook" + error.message });
    }
}