import Coupons from "@/models/Coupons";
import { connectDB } from "@/database/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();

        const { code, discountPercentage, expirationDate } = await req.json();

        const uppercaseName = code.toUpperCase();

        const coupon = await Coupons.findOne({ code: uppercaseName });

        if (coupon) return NextResponse.json({ message: "El cúpon ya existe!" });

        const formattedExpirationDate = expirationDate.split('T')[0];

        const discountPercentageDecimal = discountPercentage / 100;

        const newCoupon = new Coupons({ code: uppercaseName, discountPercentage: discountPercentageDecimal, expirationDate: formattedExpirationDate });

        await newCoupon.save();

        return NextResponse.json({ message: "Cúpon creado" });
    } catch (error) {
        return NextResponse.json({ message: 'Error al crear el cúpon! ' + error });
    }
}

export async function GET() {
    try {
        await connectDB();

        const coupons = await Coupons.find();

        return NextResponse.json(coupons);
    } catch (error) {
        return NextResponse.json({ message: 'Error al consultar los cupones! ' + error });
    }
}

export async function DELETE(req) {
    try {
        await connectDB();

        const url = new URL(req.url);

        const _id = url.searchParams.get('_id')

        await Coupons.findByIdAndDelete({ _id });

        return NextResponse.json({ message: 'Cúpon eliminado' });
    } catch (error) {
        return NextResponse.json({ message: 'Error al eliminar el cúpon! ' + error });
    }
}