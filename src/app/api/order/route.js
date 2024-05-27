import { sql } from "@/database/mysql";
import { NextResponse } from "next/server";

export async function PUT(req) {
    try {
        const { id } = await req.json();

        const [orderDelete] = await sql.query(`
            UPDATE Orden
            SET estado = 'Cancelado'
            WHERE id = ? AND estado = 'Pendiente'
        `, [id]);

        if (orderDelete.affectedRows === 0) {
            return NextResponse.json({ message: "No puedes cancelar el pedido, ya va en camino" });
        }

        return NextResponse.json({ message: "Pedido cancelado" });
    } catch (error) {
        return NextResponse.json({ message: "Error al cancelar el pedido" + error.message });
    }
}