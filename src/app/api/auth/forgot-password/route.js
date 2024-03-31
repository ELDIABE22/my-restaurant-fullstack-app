import { connectDB } from "@/database/mongodb";
import { randomBytes } from 'crypto';
import { NextResponse } from "next/server";
import User from "@/models/User";
import { transporter } from "@/utils/nodemailer";

export async function POST(req) {
    const { correo } = await req.json();
    try {
        await connectDB();

        const user = await User.findOne({ correo });

        if (!user) {
            return NextResponse.json({ message: 'El correo no existe.' });
        }

        const token = randomBytes(20).toString('hex');
        const expires = Date.now() + 3600000;

        user.resetPasswordToken = token;
        user.resetPasswordExpires = expires;

        const resetPasswordLink = `${process.env.NEXTAUTH_URL}/auth/forgot-password/${token}`;

        const mailOptions = {
            from: process.env.EMAIL_ADMIN, // Dirección de correo electrónico del remitente
            to: correo, // Dirección de correo electrónico del destinatario
            subject: 'Restablecimiento de contraseña',
            text: `
            Hola,

            Solicitud de restablecimiento de contraseña.

            Haz clic en el siguiente enlace para restablecer tu contraseña:

            ${resetPasswordLink}

            Si no solicitaste este restablecimiento, por favor ignora este correo.

            Saludos,
            Diabe Delcias`,
        };

        await transporter.sendMail(mailOptions);

        await user.save();

        return NextResponse.json({ message: "Se ha enviado un correo para restablecer tu contraseña." });

    } catch (error) {
        return NextResponse.json({ message: "Error al recuperar contraseña" + error.message });
    }
}