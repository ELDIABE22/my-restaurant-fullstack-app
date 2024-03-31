import { connectDB } from "@/database/mongodb";
import { NextResponse } from "next/server";
import Category from "@/models/Category";

export async function POST(req) {
    try {
        await connectDB();

        const { name } = await req.json();

        const uppercaseName = name.toUpperCase();

        const category = await Category.findOne({ name: uppercaseName });

        if (category) return NextResponse.json({ message: "La categoría ya existe!" });

        const newCategory = new Category({ name: uppercaseName });

        await newCategory.save();

        return NextResponse.json({ message: "Categoría creada" });

    } catch (error) {
        return NextResponse.json({ message: 'Error al crear la categoria! ' + error });
    }
}

export async function GET() {
    try {
        await connectDB();

        const category = await Category.find();

        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ message: 'Error al consultar las categorias! ' + error });
    }
}

export async function DELETE(req) {
    try {
        await connectDB();

        const url = new URL(req.url);

        const _id = url.searchParams.get('_id')

        await Category.findByIdAndDelete({ _id });

        return NextResponse.json({ message: 'Categoría eliminada' });
    } catch (error) {
        return NextResponse.json({ message: 'Error al eliminar la categoria! ' + error });
    }
}

export async function PUT(req) {
    try {
        await connectDB();

        const { id, name } = await req.json();

        const uppercaseName = name.toUpperCase();

        const existingName = await Category.findOne({ name: uppercaseName });

        if (existingName) {
            const validateCategory = existingName._id == id;

            if (!validateCategory) return NextResponse.json({ message: "La categoría ya existe!" });
        }

        await Category.findByIdAndUpdate(id, { name: uppercaseName });

        return NextResponse.json({ message: 'Categoría actualizada' });
    } catch (error) {
        return NextResponse.json({ message: 'Error al actualizar la categoria! ' + error });
    }
}