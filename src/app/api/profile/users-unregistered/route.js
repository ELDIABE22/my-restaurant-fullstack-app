import { connectDB } from "@/database/mongodb"
import UnregisteredOrder from "@/models/UnregisteredOrder";
import { NextResponse } from "next/server"

export async function GET() {
    try {
        await connectDB();

        const orderUnRegistered = await UnregisteredOrder.find();

        return NextResponse.json(orderUnRegistered);
    } catch (error) {
        return NextResponse.json({ message: "Error al consultar los usuarios no registrados" + error.message })
    }
}