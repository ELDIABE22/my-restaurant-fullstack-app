import Category from "@/models/Category";
import { connectDB } from "@/database/mongodb";
import { NextResponse } from "next/server";

export async function GET(res, { params }) {
    try {
        await connectDB();

        const category = await Category.findOne({ _id: params.id })

        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ message: "Error al consultar el id de la categoría! " + error });
    }
}