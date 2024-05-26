import { sql } from "@/database/mysql";
import Coupons from "@/models/Coupons";
import { connectDB } from "@/database/mongodb";
import { NextResponse } from "next/server";
import { id25Bytes } from "@/utils/uuidv4";

export async function POST(req) {
    try {
        const { code, discountPercentage, expirationDate } = await req.json();

        const uppercaseCode = code.toUpperCase();

        // CONSULTA SENCILLA
        const [coupon] = await sql.query(`
            SELECT * FROM Cupon
            WHERE codigo = ?
        `, [uppercaseCode]);

        if (coupon.length > 0) return NextResponse.json({ message: "El cúpon ya existe!" });

        const formattedExpirationDate = expirationDate.split('T')[0];

        const values = [id25Bytes(), uppercaseCode, discountPercentage, formattedExpirationDate];

        await sql.query(`
            INSERT INTO Cupon (
                id, codigo, porcentaje_descuento, fecha_caducidad	
            )
            VALUES (?,?,?,?)
        `, values)

        return NextResponse.json({ message: "Cúpon creado" });
    } catch (error) {
        return NextResponse.json({ message: 'Error al crear el cúpon! ' + error });
    }
}

export async function GET() {
    try {
        // CONSULTA SENCILLA
        const [coupons] = await sql.query(`
            SELECT * FROM Cupon
        `);

        return NextResponse.json(coupons);
    } catch (error) {
        return NextResponse.json({ message: 'Error al consultar los cupones! ' + error });
    }
}

export async function DELETE(req) {
    try {
        const url = new URL(req.url);

        const id = url.searchParams.get('id')

        await sql.query(`
            DELETE 
            FROM Cupon
            WHERE id = ?
        `, [id])

        return NextResponse.json({ message: 'Cúpon eliminado' });
    } catch (error) {
        return NextResponse.json({ message: 'Error al eliminar el cúpon! ' + error });
    }
}