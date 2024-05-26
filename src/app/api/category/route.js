import { sql } from "@/database/mysql";
import { id25Bytes } from "@/utils/uuidv4";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { name } = await req.json();

        const uppercaseName = name.toUpperCase();

        // CONSULTA SENCILLA
        const [existingCategory] = await sql.query(`
            SELECT * 
            FROM Categoria
            WHERE nombre = ?
        `, [uppercaseName]);

        if (existingCategory.length > 0) return NextResponse.json({ message: "La categoría ya existe!" });

        await sql.query(`
            INSERT INTO Categoria (id, nombre) VALUES (?,?)
        `, [id25Bytes(), uppercaseName]);


        return NextResponse.json({ message: "Categoría creada" });
    } catch (error) {
        return NextResponse.json({ message: 'Error al crear la categoria! ' + error });
    }
}

export async function GET() {
    try {
        // CONSULTA SENCILLA
        const [category] = await sql.query(`
            SELECT *
            FROM Categoria
        `);

        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ message: 'Error al consultar las categorias! ' + error });
    }
}

export async function DELETE(req) {
    try {
        const url = new URL(req.url);

        const id = url.searchParams.get('id')

        await sql.query(`
            DELETE
            FROM Categoria
            WHERE id = ?
        `, [id])

        return NextResponse.json({ message: 'Categoría eliminada' });
    } catch (error) {
        return NextResponse.json({ message: 'Error al eliminar la categoria! ' + error });
    }
}

export async function PUT(req) {
    try {
        const { id, name } = await req.json();

        const uppercaseName = name.toUpperCase();

        // CONSULTA SENCILLA
        const [existingName] = await sql.query(`
            SELECT * 
            FROM Categoria
            WHERE nombre = ?
        `, [uppercaseName]);

        if (existingName.length > 0) {
            const validateCategory = existingName[0].id === id;

            if (!validateCategory) return NextResponse.json({ message: "La categoría ya existe!" });
        }

        await sql.query(`
            UPDATE Categoria
            SET nombre = ?
            WHERE id = ?
        `, [uppercaseName, id]);

        return NextResponse.json({ message: 'Categoría actualizada' });
    } catch (error) {
        return NextResponse.json({ message: 'Error al actualizar la categoria! ' + error });
    }
}