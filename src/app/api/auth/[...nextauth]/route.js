import { sql } from "@/database/mysql"
import bcrypt from "bcrypt"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                correo: { label: "Username", type: "correo", placeholder: "jsmith@gmail.com" },
                contraseña: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                try {
                    // CONSULTA SENCILLA
                    const [userFound] = await sql.query(`
                        SELECT * 
                        FROM Usuario 
                        WHERE correo = ?
                    `, [credentials?.correo]);

                    if (userFound.length === 0) throw new Error("El correo no existe!");

                    const comparePassword = await bcrypt.compare(credentials?.contraseña, userFound[0].contraseña);

                    if (!comparePassword) throw new Error('Contraseña incorrecta!');

                    return userFound[0];
                } catch (error) {
                    console.error('Error en la autorización:', error.message);
                    throw new Error(error.message);
                }
            }
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            try {
                if (user) token.user = user;
                return token;
            } catch (error) {
                console.error('Error en el callback jwt:', error.message);
                throw new Error('Error en el callback jwt');
            }
        },
        session({ session, token }) {
            try {
                session.user = token.user;
                return session;
            } catch (error) {
                console.error('Error en el callback de sesión:', error.message);
                throw new Error('Error en el callback de sesión');
            }
        }
    },
    pages: {
        signIn: '/auth/login',
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'none',
                path: '/',
                secure: true,
            },
        },
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }