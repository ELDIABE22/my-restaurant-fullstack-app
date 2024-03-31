import { connectDB } from "@/database/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/User";

export async function POST(req) {
    const { token, newPassword } = await req.json();
    try {
        await connectDB();

        const user = await User.findOne({ resetPasswordToken: token });

        if (!user) {
            return NextResponse.json({ message: 'El token de restablecimiento de contraseña es inválido o ha expirado.' });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);

        user.contraseña = hashPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return NextResponse.json({ message: 'Tu contraseña ha sido restablecida con éxito.' });
    } catch (error) {
        return NextResponse.json({ message: "Error al recuperar contraseña" + error.message });
    }
}