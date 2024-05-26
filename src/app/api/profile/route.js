import { sql } from "@/database/mysql";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function PUT(req) {
    try {
        const { nombreCompleto, telefono, ciudad, direccion } = await req.json();

        const { user } = await getServerSession(authOptions);

        // CONSULTA SENCILLA
        const [validateUser] = await sql.query(`
            SELECT *
            FROM Usuario
            WHERE telefono = ?
        `, [telefono]);

        if (validateUser.length > 0) {
            const validatePhone = validateUser[0].id === user.id;

            if (!validatePhone) return NextResponse.json({ message: "El teléfono ya existe!" });
        }

        const values = [nombreCompleto, telefono, ciudad, direccion, user.admin, user.correo];

        await sql.query(`
            UPDATE Usuario
            SET nombreCompleto = ?, telefono = ?, ciudad = ?, direccion = ?, admin = ?
            WHERE correo = ?
        `, values);

        // CONSULTA SENCILLA
        const [updatedUser] = await sql.query(`
            SELECT *
            FROM Usuario
            WHERE correo = ?
        `, [user.correo]);

        return NextResponse.json({ message: "Usuario actualizado exitosamente", updatedUser: updatedUser[0] });

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}

export async function GET() {
    try {
        const { user } = await getServerSession(authOptions);

        // CONSULTA SENCILLA
        const [dataUser] = await sql.query(`
            SELECT *
            FROM Usuario
            WHERE correo = ?
        `, [user.correo]);

        return NextResponse.json(dataUser[0]);
    } catch (error) {
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}