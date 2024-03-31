import { NextResponse } from "next/server";
import { connectDB } from "@/database/mongodb.js";
import bcrypt from "bcrypt";
import User from "@/models/User.js";

export async function POST(req) {
    try {
        await connectDB();

        const { nombreCompleto, correo, contraseña } = await req.json();

        const userExistente = await User.findOne({ correo });

        if (userExistente) return NextResponse.json({ message: "El usuario ya existe!" });

        let validPassword = contraseña;

        if (contraseña !== "") {
            validPassword = await bcrypt.hash(contraseña, 10);
        }

        const nuevoUsuario = new User({
            nombreCompleto,
            correo,
            contraseña: validPassword,
            telefono: '',
            ciudad: '',
            direccion: '',
        });

        const userGuardado = await nuevoUsuario.save();

        return NextResponse.json({
            message: "Usuario registrado exitosamente",
            user: userGuardado,
        });

    } catch (error) {
        return NextResponse.json({ message: 'Error al crear el usuario! ' + error });
    }
}