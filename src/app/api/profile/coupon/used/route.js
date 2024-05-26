import { sql } from "@/database/mysql";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { id25Bytes } from "@/utils/uuidv4";

export async function POST(req) {
    try {
        const { couponCode } = await req.json();
        const uppercaseName = couponCode.toUpperCase();
        const { user } = await getServerSession(authOptions);

        // CONSULTA CRUCE DE TABLA
        const [couponData] = await sql.query(`
            SELECT Cupon.*, Cupon_Usado.id AS cuponUsadoId, Cupon_Usado.usado
            FROM Cupon
            LEFT JOIN Cupon_Usado ON Cupon.id = Cupon_Usado.cuponId AND Cupon_Usado.usuarioId = ?
            WHERE Cupon.codigo = ?
        `, [user.id, uppercaseName]);

        if (couponData.length === 0) {
            return NextResponse.json({ message: 'Cupón inválido' });
        }

        const coupon = couponData[0];

        // Verificar si el cupón ha expirado
        if (new Date(coupon.fecha_caducidad) < new Date()) {
            if (coupon.cuponUsadoId && coupon.usado === 0) {
                await sql.query(`
                    UPDATE Cupon_Usado
                    SET usado = 1
                    WHERE id = ?
                `, [coupon.cuponUsadoId]);
            }
            return NextResponse.json({ message: 'El cupón ya expiró' });
        }

        // Verificar si el cupón ya ha sido usado
        if (coupon.cuponUsadoId) {
            if (coupon.usado === 1) {
                return NextResponse.json({ message: 'Ya usaste este cupón' });
            } else {
                return NextResponse.json({ message: 'Ya tienes aplicado el cupón, ¡úsalo!' });
            }
        }

        // Insertar el uso del cupón
        await sql.query(`
            INSERT INTO Cupon_Usado (id, usuarioId, cuponId)
            VALUES (?, ?, ?)
        `, [id25Bytes(), user.id, coupon.id]);

        return NextResponse.json({ message: `Cupón del ${coupon.porcentaje_descuento}% aplicado` });
    } catch (error) {
        console.error('Error al aplicar el cupón:', error);
        return NextResponse.json({ message: 'Error al aplicar el cupón! ' + error.message });
    }
}

export async function GET() {
    try {
        const { user } = await getServerSession(authOptions);

        // CONSULTA CRUCE DE TABLA
        const [results] = await sql.query(`
            SELECT Cupon.*, Cupon_Usado.id AS cuponUsadoId
            FROM Cupon_Usado
            LEFT JOIN Cupon ON Cupon.id = Cupon_Usado.cuponId
            WHERE Cupon_Usado.usuarioId = ? AND Cupon_Usado.usado = 0
        `, [user.id]);

        if (results.length === 0) {
            return NextResponse.json(null);
        }

        const coupon = results[0];

        if (!coupon || new Date(coupon.fecha_caducidad) < new Date()) {
            await sql.query(`
                UPDATE Cupon_Usado
                SET usado = 1
                WHERE id = ?
            `, [coupon.cuponUsadoId]);

            return NextResponse.json(null);
        }

        return NextResponse.json(coupon);
    } catch (error) {
        console.error('Error al consultar los cupones:', error);
        return NextResponse.json({ message: `Error al consultar los cupones: ${error.message}` });
    }
}