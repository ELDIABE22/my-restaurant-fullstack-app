import { connectDB } from "@/database/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        const dataUsers = await User.find();

        return NextResponse.json(dataUsers);
    } catch (error) {
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}

export async function PUT(req) {
    try {
        await connectDB();

        const dataToUpdate = await req.json();

        const validateUser = await User.findOne({ telefono: dataToUpdate.telefono });

        if (validateUser) {
            const validatePhone = validateUser._id == dataToUpdate.id;

            if (!validatePhone) return NextResponse.json({ message: "El teléfono ya existe!" });
        }

        await User.findByIdAndUpdate({ _id: dataToUpdate.id }, dataToUpdate);

        return NextResponse.json({ message: "Usuario actualizado" });
    } catch (error) {
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}