import { sql } from "@/database/mysql";
import { NextResponse } from "next/server";

export async function GET(res, { params }) {
    try {
        // CONSULTA SENCILLA
        const [category] = await sql.query(`
            SELECT *
            FROM Categoria
            WHERE id = ?
        `, [params.id])

        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ message: "Error al consultar el id de la categoría! " + error });
    }
}