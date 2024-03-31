import { connectDB } from "@/database/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(res, { params }) {
    try {
        await connectDB();

        const userDataToUpdate = await User.findOne({ _id: params.id })

        return NextResponse.json(userDataToUpdate);
    } catch (error) {
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}