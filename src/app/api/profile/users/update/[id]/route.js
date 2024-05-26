import { sql } from "@/database/mysql";
import { NextResponse } from "next/server";

export async function GET(res, { params }) {
    try {
        // CONSULTA SENCILLA
        const [userDataToUpdate] = await sql.query(`
            SELECT * 
            FROM Usuario
            WHERE id = ?
        `, [params.id]);

        return NextResponse.json(userDataToUpdate[0]);
    } catch (error) {
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}