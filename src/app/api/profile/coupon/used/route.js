import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/database/mongodb";
import Coupons from "@/models/Coupons";
import UsedCoupons from "@/models/UsedCoupons";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();

        const { couponCode } = await req.json();

        const uppercaseName = couponCode.toUpperCase();

        const existingCoupon = await Coupons.findOne({ code: uppercaseName });

        if (!existingCoupon) {
            return NextResponse.json({ message: 'Cupón inválido' });
        }

        const dataUser = await getServerSession(authOptions);

        const usedCoupon = await UsedCoupons.findOne({ userId: dataUser.user._id, couponId: existingCoupon._id });
        console.log(usedCoupon);

        if (usedCoupon) {
            if (new Date(existingCoupon.expirationDate) < new Date()) {
                if (usedCoupon.used === false) {
                    await UsedCoupons.findOneAndUpdate(usedCoupon._id, { used: true });
                } else {
                    return NextResponse.json({ message: 'Ya usaste este cupón' });
                }

                return NextResponse.json({ message: 'El cupón ya expiró' });
            } else {
                if (usedCoupon.used === true) {
                    return NextResponse.json({ message: 'Ya usaste este cupón' });
                } else {
                    return NextResponse.json({ message: 'Ya tienes aplicado el cupón, ¡úsalo!' });

                }
            }
        }

        if (new Date(existingCoupon.expirationDate) < new Date()) {
            return NextResponse.json({ message: 'El cupón ya expiró' });
        }

        const saveCoupon = new UsedCoupons({ userId: dataUser.user._id, couponId: existingCoupon._id });

        await saveCoupon.save();

        return NextResponse.json({ message: `Cupón del ${Math.round(existingCoupon.discountPercentage * 100)}% aplicado`, data: existingCoupon });
    } catch (error) {
        return NextResponse.json({ message: 'Error al aplicar el cupón! ' + error });
    }
}

export async function GET() {
    try {
        await connectDB();

        const dataUser = await getServerSession(authOptions);

        const verifyingCoupon = await UsedCoupons.findOne({ userId: dataUser.user._id, used: false });

        if (!verifyingCoupon) {
            return NextResponse.json(null);
        }

        const coupon = await Coupons.findOne({ _id: verifyingCoupon.couponId });

        if (coupon) {
            if (new Date(coupon.expirationDate) < new Date()) {
                await UsedCoupons.findOneAndUpdate(verifyingCoupon._id, { used: true });
                return NextResponse.json(null);
            }
        } else {
            await UsedCoupons.findOneAndUpdate(verifyingCoupon._id, { used: true });
            return NextResponse.json(null);
        }

        return NextResponse.json(coupon);
    } catch (error) {
        return NextResponse.json({ message: 'Error al consultar los cupón! ' + error });
    }
}