import { sql } from "@/database/mysql";
import { NextResponse } from "next/server";

export async function GET(res, { params }) {
    try {
        // CONSULTA ENTRE TABALAS
        const [menuItems] = await sql.query(`
            SELECT 
                p.id AS plato_id,
                p.imagen_url,
                p.nombre AS plato_nombre,
                p.descripcion AS plato_descripcion,
                p.precio AS plato_precio,
                c.id AS categoria_id,
                c.nombre AS categoria_nombre,
                pc.id AS plato_caja_id,
                pc.nombre AS plato_caja_nombre,
                pc.descripcion AS plato_caja_descripcion,
                pc.cantidad_maxima AS plato_caja_cantidad_maxima,
                pcd.id AS plato_caja_item_id,
                pcd.nombre AS plato_caja_item_nombre,
                pcd.precio AS plato_caja_item_precio,
                pcd.tipo AS plato_caja_item_tipo
            FROM 
                Plato p
            JOIN 
                Categoria c ON p.categoriaId = c.id
            LEFT JOIN 
                Plato_Caja pc ON p.id = pc.platoId
            LEFT JOIN 
                Plato_Caja_Dato pcd ON pc.id = pcd.cajaId
            WHERE 
                p.id = ?;
        `, [params.id]);

        return NextResponse.json(menuItems);
    } catch (error) {
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}