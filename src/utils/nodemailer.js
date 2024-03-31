import { createTransport } from 'nodemailer';

export const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADMIN, // Tu dirección de correo electrónico
        pass: process.env.EMAIL_PASSWORD_ADMIN, // Tu contraseña de correo electrónico
    },
});


