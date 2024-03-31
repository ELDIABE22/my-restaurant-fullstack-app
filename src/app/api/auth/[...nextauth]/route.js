import { connectDB } from "@/database/mongodb"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth"
import User from "@/models/User"
import bcrypt from "bcrypt"

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                correo: { label: "Username", type: "correo", placeholder: "jsmith@gmail.com" },
                contraseña: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                try {
                    await connectDB();

                    const userEncontrado = await User.findOne({ correo: credentials?.correo }).select("+contraseña");

                    if (!userEncontrado) throw new Error("El correo no existe!");

                    const contraseñaCompare = await bcrypt.compare(credentials?.contraseña, userEncontrado.contraseña);

                    if (!contraseñaCompare) throw new Error('Contraseña incorrecta!');

                    return userEncontrado;
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