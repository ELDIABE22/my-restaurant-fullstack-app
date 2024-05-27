import { sql } from "@/database/mysql";
import { id25Bytes } from "@/utils/uuidv4";
import { NextResponse } from "next/server";
import { normalizeString } from "@/utils/stringUtils";
import { deleteFile, uploadFile } from "@/firebase/config";

export async function POST(req) {
    try {
        const data = await req.formData();
        const image = data.get("image");
        const dataElemnet = JSON.parse(data.get("data"));
        const normalizedData = {
            ...dataElemnet,
            name: normalizeString(dataElemnet.name),
        };

        // CONSULTA SENCILLA
        const [existingMenuItem] = await sql.query(`
            SELECT *
            FROM Plato
            WHERE nombre = ?
        `, [normalizedData.name]);

        if (existingMenuItem.length > 0) {
            return NextResponse.json({ message: "El nombre del plato ya existe" });
        }

        if (image !== "null") {
            const imageSave = await uploadFile(image, 'platos');
            normalizedData.imagenURL = imageSave.url;
        } else {
            return NextResponse.json({ message: "Se requiere la foto" });
        }

        const values = [id25Bytes(), normalizedData.imagenURL, normalizedData.name, normalizedData.description, normalizedData.price, normalizedData.category];

        try {
            // Iniciar transacción
            await sql.beginTransaction();

            // Insertar en Plato
            await sql.query(`
                INSERT INTO Plato (
                    id, imagen_url, nombre, descripcion, precio, categoriaId
                ) VALUES (?, ?, ?, ?, ?, ?)
            `, values);

            const platoId = values[0];

            // Insertar en Plato_Caja y Plato_Caja_Item
            if (normalizedData.itemBox.length > 0) {
                for (const box of normalizedData.itemBox) {
                    const cajaId = id25Bytes();
                    await sql.query(`
                        INSERT INTO Plato_Caja (
                            id, platoId, nombre, descripcion, cantidad_maxima
                        ) VALUES (?, ?, ?, ?, ?)
                    `, [cajaId, platoId, box.nombre, box.descripcion, box.cantidad_maxima]);

                    // Insertar en Plato_Caja_Item
                    if (box.dataMenuItem && box.dataMenuItem.length > 0) {
                        for (const item of box.dataMenuItem) {
                            await sql.query(`
                                INSERT INTO Plato_Caja_Dato (
                                    id, cajaId, nombre, precio, tipo
                                ) VALUES (?, ?, ?, ?, ?)
                            `, [id25Bytes(), cajaId, item.nombre, item.precio || null, item.tipo]);
                        }
                    }
                }
            }

            // Confirmar transacción
            await sql.commit();
        } catch (error) {
            // Revertir transacción en caso de error
            await sql.rollback();
            console.error('Error during transaction:', error);
        }

        return NextResponse.json({ message: "Plato añadido" });
    } catch (error) {
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}

export async function GET() {
    try {
        // CONSULTA SENCILLA
        const [menuItems] = await sql.query(`
            SELECT * FROM Plato
        `);

        return NextResponse.json(menuItems);
    } catch (error) {
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}

export async function PUT(req) {
    try {
        const data = await req.formData();
        const image = data.get("image");
        const imageRemove = data.get("imageRemove");
        const id = data.get("id");
        const dataElemnet = JSON.parse(data.get("data"));
        console.log(dataElemnet.itemBox);

        const normalizedData = {
            ...dataElemnet,
            name: normalizeString(dataElemnet.name),
        };

        // CONSULTA SENCILLA
        const [existingMenuItem] = await sql.query(`
            SELECT *
            FROM Plato
            WHERE nombre = ?
        `, [normalizedData.name]);

        if (existingMenuItem.length > 0) {
            const validateName = existingMenuItem[0].id === id;
            if (!validateName) return NextResponse.json({ message: "El nombre del plato ya existe" });
        }

        if (image) {
            let imageUrl;

            if (typeof image === 'string') {
                imageUrl = image;
            } else {
                const imageSave = await uploadFile(image, 'platos');
                imageUrl = imageSave.url;
            }

            normalizedData.imageUrl = imageUrl;

        } else {
            return NextResponse.json({ message: "Se requiere la foto" });
        }

        if (imageRemove && typeof image !== 'string') {
            await deleteFile(imageRemove);
        }

        const values = [normalizedData.imageUrl, normalizedData.name, normalizedData.description, normalizedData.price, normalizedData.category, id];

        try {
            // Iniciar transacción
            await sql.beginTransaction();

            // Actualizar Plato
            await sql.query(`
                UPDATE Plato 
                SET
                imagen_url = ?, nombre = ?, descripcion = ?, precio = ?, categoriaId = ?
                WHERE id = ?
            `, values);

            // Obtener Plato_Caja existente
            const [existingPlatoCaja] = await sql.query(`
                SELECT id
                FROM Plato_Caja
                WHERE platoId = ?
            `, [id]);

            const existingPlatoCajaIds = existingPlatoCaja.map(caja => caja.id);

            // Obtener Plato_Caja_Dato existente si hay cajas
            let existingPlatoCajaDato = [];
            if (existingPlatoCajaIds.length > 0) {
                [existingPlatoCajaDato] = await sql.query(`
                    SELECT id, cajaId
                    FROM Plato_Caja_Dato
                    WHERE cajaId IN (?)
                `, [existingPlatoCajaIds]);
            }

            const existingPlatoCajaDatoIds = existingPlatoCajaDato.map(item => item.id);

            // Manejar Plato_Caja
            const receivedPlatoCajaIds = [];
            for (const box of normalizedData.itemBox) {
                if (box.id) {
                    receivedPlatoCajaIds.push(box.id);
                    // Actualizar Plato_Caja existente
                    await sql.query(`
                        UPDATE Plato_Caja
                        SET nombre = ?, descripcion = ?, cantidad_maxima = ?
                        WHERE id = ? AND platoId = ?
                    `, [box.nombre, box.descripcion, box.cantidad_maxima, box.id, id]);
                } else {
                    // Insertar nuevo Plato_Caja
                    const newBoxId = id25Bytes();
                    await sql.query(`
                        INSERT INTO Plato_Caja (id, platoId, nombre, descripcion, cantidad_maxima)
                        VALUES (?, ?, ?, ?, ?)
                    `, [newBoxId, id, box.nombre, box.descripcion, box.cantidad_maxima]);
                    box.id = newBoxId;
                    receivedPlatoCajaIds.push(newBoxId);
                }

                // Manejar Plato_Caja_Dato
                const receivedPlatoCajaDatoIds = [];
                for (const item of box.dataMenuItem) {
                    if (item.id) {
                        receivedPlatoCajaDatoIds.push(item.id);
                        // Actualizar Plato_Caja_Dato existente
                        await sql.query(`
                            UPDATE Plato_Caja_Dato
                            SET nombre = ?, precio = ?, tipo = ?
                            WHERE id = ? AND cajaId = ?
                        `, [item.nombre, item.precio, item.tipo, item.id, box.id]);
                    } else {
                        // Insertar nuevo Plato_Caja_Dato
                        const newItemId = id25Bytes();
                        await sql.query(`
                            INSERT INTO Plato_Caja_Dato (id, cajaId, nombre, precio, tipo)
                            VALUES (?, ?, ?, ?, ?)
                        `, [newItemId, box.id, item.nombre, item.precio || null, item.tipo]);
                        receivedPlatoCajaDatoIds.push(newItemId);
                    }
                }

                // Eliminar Plato_Caja_Dato que no están presentes en los datos recibidos
                const idsToDelete = existingPlatoCajaDatoIds.filter(itemId => !receivedPlatoCajaDatoIds.includes(itemId));
                if (idsToDelete.length > 0) {
                    await sql.query(`
                        DELETE FROM Plato_Caja_Dato
                        WHERE id IN (?)
                    `, [idsToDelete]);
                }
            }

            // Eliminar Plato_Caja_Dato relacionados con cajas que serán eliminadas
            const cajaIdsToDelete = existingPlatoCajaIds.filter(cajaId => !receivedPlatoCajaIds.includes(cajaId));
            if (cajaIdsToDelete.length > 0) {
                await sql.query(`
                    DELETE FROM Plato_Caja_Dato
                    WHERE cajaId IN (?)
                `, [cajaIdsToDelete]);

                // Eliminar Plato_Caja que no están presentes en los datos recibidos
                await sql.query(`
                    DELETE FROM Plato_Caja
                    WHERE id IN (?)
                `, [cajaIdsToDelete]);
            }

            // Confirmar transacción
            await sql.commit();
            return NextResponse.json({ message: "Plato actualizado" });
        } catch (error) {
            // Revertir transacción en caso de error
            await sql.rollback();
            console.error('Error during transaction:', error);
            return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
        }
    } catch (error) {
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}

export async function DELETE(req) {
    try {
        const data = await req.formData();
        const id = data.get("idRemoveMenu");
        const imageId = data.get("idRemoveImage");

        try {
            // Iniciar transacción
            await sql.beginTransaction();

            // Eliminar la imagen si está presente
            if (imageId) {
                await deleteFile(imageId);
            }

            // Obtener Plato_Caja ids relacionados con el Plato
            const [existingPlatoCaja] = await sql.query(`
                SELECT id
                FROM Plato_Caja
                WHERE platoId = ?
            `, [id]);

            const existingPlatoCajaIds = existingPlatoCaja.map(caja => caja.id);

            // Si hay Plato_Caja relacionados, eliminar los Plato_Caja_Dato primero
            if (existingPlatoCajaIds.length > 0) {
                await sql.query(`
                    DELETE FROM Plato_Caja_Dato
                    WHERE cajaId IN (?)
                `, [existingPlatoCajaIds]);

                // Eliminar los Plato_Caja
                await sql.query(`
                    DELETE FROM Plato_Caja
                    WHERE id IN (?)
                `, [existingPlatoCajaIds]);
            }

            // Eliminar el Plato
            await sql.query(`
                DELETE FROM Plato
                WHERE id = ?
            `, [id]);

            // Confirmar transacción
            await sql.commit();
        } catch (error) {
            // Revertir transacción en caso de error
            await sql.rollback();
            return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
        }

        if (imageId) {
            await deleteFile(imageId);
        }

        return NextResponse.json({ message: "Plato eliminado" });
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({ message: "Error, inténtalo más tarde", error: error.message });
    }
}