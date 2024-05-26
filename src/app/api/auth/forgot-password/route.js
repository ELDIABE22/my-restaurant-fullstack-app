import { sql } from '@/database/mysql';
import { randomBytes } from 'crypto';
import { transporter } from "@/utils/nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { correo } = await req.json();

        const [user] = await sql.query(`
            SELECT *
            FROM Usuario
            WHERE correo = ?
        `, [correo])

        if (user.length === 0) {
            return NextResponse.json({ message: 'El correo no existe.' });
        }

        const token = randomBytes(20).toString('hex');

        const now = Date.now();

        const timezoneDifference = 5 * 60 * 60 * 1000;

        const adjustedTimestamp = now + timezoneDifference;

        const expirationTimestamp = adjustedTimestamp + 60 * 60 * 1000;

        const expirationDate = new Date(expirationTimestamp);

        await sql.query(`
            UPDATE Usuario
            SET resetPasswordToken = ?, resetPasswordExpires = ?
            WHERE id = ?
        `, [token, expirationDate, user[0].id]);

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

        return NextResponse.json({ message: "Se ha enviado un correo para restablecer tu contraseña." });

    } catch (error) {
        return NextResponse.json({ message: "Error al recuperar contraseña" + error.message });
    }
}