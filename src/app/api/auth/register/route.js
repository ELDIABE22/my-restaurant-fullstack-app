import bcrypt from "bcrypt";
import { sql } from "@/database/mysql";
import { id25Bytes } from "@/utils/uuidv4";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { nombreCompleto, correo, telefono, ciudad, direccion, contraseña } = await req.json();

        // CONSULTA SENCILLA
        const [existingUser] = await sql.query('SELECT * FROM Usuario WHERE correo = ? OR telefono = ?', [correo, telefono]);

        if (existingUser.length > 0) {
            if (existingUser[0].correo === correo) return NextResponse.json({ message: "El usuario ya existe!" });
            else if (existingUser[0].telefono === telefono) return NextResponse.json({ message: "El teléfono ya esta registrado" });
        };

        const hashPassword = await bcrypt.hash(contraseña, 10);

        const values = [id25Bytes(), nombreCompleto, correo, hashPassword, telefono, ciudad, direccion];

        const [saveUser] = await sql.query(`
            INSERT INTO Usuario (
                id, nombreCompleto, correo, contraseña, telefono, ciudad, direccion
            ) VALUES (
                ?,?,?,?,?,?,?
            )
        `, values);

        return NextResponse.json({
            message: "Usuario registrado exitosamente",
            user: saveUser[0],
        });

    } catch (error) {
        return NextResponse.json({ message: 'Error al crear el usuario! ' + error });
    }
}