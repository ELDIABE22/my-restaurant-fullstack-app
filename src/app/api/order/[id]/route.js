import { sql } from "@/database/mysql";
import { NextResponse } from "next/server";

export async function GET(res, { params }) {
    try {
        const [order] = await sql.query(`
            SELECT 
                o.id AS ordenId, 
                o.usuarioId, 
                o.metodo_pago, 
                o.metodo_entrega, 
                o.direccion_envio, 
                o.ciudad_envio, 
                o.detalles_adicionales, 
                o.numero_mesa, 
                o.total, 
                o.pagado, 
                o.estado, 
                o.fecha_creado, 
                o.fecha_actualizado,
                op.id AS ordenPlatoId,
                op.nombre AS platoNombre,
                op.cantidad AS platoCantidad,
                opa.id AS adicionalId,
                opa.nombre AS adicionalNombre,
                opa.cantidad AS adicionalCantidad
            FROM 
                Orden o
            LEFT JOIN 
                Orden_Plato op ON o.id = op.ordenId
            LEFT JOIN 
                Orden_Plato_Adicional opa ON op.id = opa.orden_platoId
            WHERE 
                o.usuarioId = ? 
                AND o.pagado = 1
                AND o.estado != 'Cancelado'
            ORDER BY 
                o.id, op.id, opa.id
        `, [params.id]);

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ message: 'Error al consultar los pedidos! ' + error });
    }
}