import { connectDB } from "@/database/mongodb";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import User from "@/models/User";

export async function PUT(req) {
    try {
        await connectDB();

        const dataToUpdate = await req.json();

        const { user } = await getServerSession(authOptions);

        const validateUser = await User.findOne({ telefono: dataToUpdate.telefono });

        if (validateUser) return NextResponse.json({ message: "El teléfono ya existe!" });

        await User.updateOne({ correo: user.correo }, dataToUpdate, { new: true });

        return NextResponse.json({ message: "Usuario actualizado exitosamente" });

    } catch (error) {
        return NextResponse.json({ message: 'Error al actualizar el usuario! ' + error });
    }
}

export async function GET() {
    await connectDB();

    const { user } = await getServerSession(authOptions);

    const dataUser = await User.findOne({ correo: user.correo });

    return NextResponse.json(dataUser);
}