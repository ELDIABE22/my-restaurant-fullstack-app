import { sql } from "@/database/mysql";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [users] = await sql.query(`
            SELECT * FROM Usuario
        `);

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}

export async function PUT(req) {
    try {
        const { id, nombreCompleto, telefono, ciudad, direccion, admin } = await req.json();

        const [validateUser] = await sql.query(`
            SELECT *
            FROM Usuario
            WHERE telefono = ? 
        `, [telefono]);

        if (validateUser.length > 0) {
            const validatePhone = validateUser[0].id === id;

            if (!validatePhone) return NextResponse.json({ message: "El teléfono ya existe!" });
        }

        const values = [nombreCompleto, telefono, ciudad, direccion, admin, id];

        await sql.query(`
            UPDATE Usuario
            SET nombreCompleto = ?, telefono = ?, ciudad = ?, direccion = ?, admin = ?
            WHERE id = ?
        `, values);

        return NextResponse.json({ message: "Usuario actualizado" });
    } catch (error) {
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}