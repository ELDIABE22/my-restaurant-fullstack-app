import { sql } from "@/database/mysql";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { token, newPassword } = await req.json();

        const [user] = await sql.query(`
            SELECT *
            FROM Usuario
            WHERE resetPasswordToken = ?
        `, [token]);

        if (user.length === 0) {
            return NextResponse.json({ message: 'El token de restablecimiento de contraseña es inválido o ha expirado.' });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);

        await sql.query(`
            UPDATE Usuario
            SET contraseña = ?, resetPasswordToken = ?, resetPasswordExpires = ?
            WHERE id = ?
        `, [hashPassword, null, null, user[0].id]);

        return NextResponse.json({ message: 'Tu contraseña ha sido restablecida con éxito.' });
    } catch (error) {
        return NextResponse.json({ message: "Error al recuperar contraseña" + error.message });
    }
}