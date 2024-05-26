import { sql } from "@/database/mysql";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // CONSULTA CRUCE DE TABLA
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
                orden_plato_adicional opa ON op.id = opa.orden_platoId
            WHERE 
                o.pagado = 1 AND o.estado = 'Pendiente'
            ORDER BY 
                o.id, op.id, opa.id
        `);

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ message: 'Error al consultar los pedidos! ' + error });
    }
}

export async function PUT(req) {
    try {
        const { id, status, deliveryMethod } = await req.json();

        const [order] = await sql.query(`
            SELECT *
            FROM Orden
            WHERE id = ?
        `, [id]);

        if (order.length === 0) {
            throw new Error({ message: "Pedido no encontrado" });
        }

        // Validar el estado del pedido
        if (order[0].estado === "Entregado") {
            throw new Error({ message: "El pedido ya está entregado" });
        }

        // Actualizar el estado del pedido
        if (deliveryMethod === "Domicilio") {
            if (status === "Pendiente") {
                await sql.query(`
                    UPDATE Orden
                    SET estado = 'En camino'
                    WHERE id = ?
                `, [id]);
            } else if (status === "En camino") {
                await sql.query(`
                    UPDATE Orden
                    SET estado = 'Entregado'
                    WHERE id = ?
                `, [id]);
            }
        } else if (deliveryMethod === "Restaurante") {
            if (status === "Pendiente") {
                await sql.query(`
                    UPDATE Orden
                    SET estado = 'Entregado'
                    WHERE id = ?
                `, [id]);
            }
        }

        return NextResponse.json({ message: "Estado del pedido actualizado" });
    } catch (error) {
        return NextResponse.json({ message: 'Error al actualizar el estado del pedido: ' + error });
    }
}