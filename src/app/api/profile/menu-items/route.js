import { connectDB } from "@/database/mongodb";
import { NextResponse } from "next/server";
import { normalizeString } from "@/utils/stringUtils";
import { deleteFile, uploadFile } from "@/firebase/config";

import MenuItem from "@/models/MenuItem";

export async function POST(req) {
    try {
        await connectDB();

        const data = await req.formData();
        const image = data.get("image");
        const dataElemnet = JSON.parse(data.get("data"));
        const normalizedData = {
            ...dataElemnet,
            name: normalizeString(dataElemnet.name),
        };

        const existingMenuItem = await MenuItem.findOne({ name: normalizedData.name });

        if (existingMenuItem) {
            return NextResponse.json({ message: "El nombre del elemento ya existe!" });
        }

        if (image !== "null") {
            const imageSave = await uploadFile(image);
            normalizedData.image = {
                url: imageSave.url,
                public_id: imageSave.id,
            };
        } else {
            return NextResponse.json({ message: "Se requiere la foto" });
        }

        const newMenuItem = new MenuItem(normalizedData);

        await newMenuItem.save();

        return NextResponse.json({ message: "Elemento creado exitosamente" });
    } catch (error) {
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}

export async function GET() {
    try {
        await connectDB();

        const menuItems = await MenuItem.find();

        return NextResponse.json(menuItems);
    } catch (error) {
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}

export async function PUT(req) {
    try {
        await connectDB();

        const data = await req.formData();
        const image = data.get("image");
        const idRemoveImage = data.get("idRemoveImage");
        const id = data.get("id");
        const dataElemnet = JSON.parse(data.get("data"));

        const normalizedData = {
            ...dataElemnet,
            name: normalizeString(dataElemnet.name),
        };

        const existingMenuItem = await MenuItem.findOne({ name: normalizedData.name });

        if (existingMenuItem) {
            const validateName = existingMenuItem._id == id
            if (!validateName) return NextResponse.json({ message: "El nombre del elemento ya existe!" });
        }

        if (image) {
            let imageUrl;

            if (typeof image === 'string') {
                imageUrl = {
                    url: image,
                    public_id: idRemoveImage,
                };
            } else {
                const imageSave = await uploadFile(image);
                imageUrl = {
                    url: imageSave.url,
                    public_id: imageSave.id,
                };
            }

            normalizedData.image = imageUrl;

        } else {
            return NextResponse.json({ message: "Se requiere la foto" });
        }

        if (idRemoveImage && typeof image !== 'string') {
            await deleteFile(idRemoveImage);
        }

        await MenuItem.findByIdAndUpdate({ _id: id }, normalizedData);

        return NextResponse.json({ message: "Elemento actualizado exitosamente" });

    } catch (error) {
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}

export async function DELETE(req) {
    try {
        await connectDB();

        const data = await req.formData();
        const menuId = data.get("idRemoveMenu");
        const imageId = data.get("idRemoveImage");

        await MenuItem.findOneAndDelete({ _id: menuId });

        if (imageId) {
            await deleteFile(imageId);
        }

        return NextResponse.json({ message: "Menú de elemento eliminado" });
    } catch (error) {
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}