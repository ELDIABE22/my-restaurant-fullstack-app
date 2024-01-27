import { z } from 'zod';

export const registerSchema = z.object({
    nombreCompleto: z.string().min(1, { message: { name: 'Es requerido' } }).regex(/^[a-zA-Z\s]*$/, { message: { name: 'El nombre no es válido' } }),
    correo: z.string().min(1, { message: { email: 'Es requerido' } }).email({ message: { email: 'El correo no es válido' } }),
    contraseña: z.string().min(1, { message: { password: 'Es requerido' } }).min(6, { message: { password: 'La contraseña debe tener al menos 6 caracteres' } }).max(15, { message: { password: 'La contraseña no puede tener más de 15 caracteres' } }),
});

export const loginSchema = z.object({
    correo: z.string().min(1, { message: { email: 'Es requerido' } }).email({ message: { email: 'El correo no es válido' } }),
    contraseña: z.string().min(1, { message: { password: 'Es requerido' } })
})

export const profileSchema = z.object({
    nombreCompleto: z.string().min(1, { message: { name: 'Es requerido' } }).regex(/^[a-zA-Z\s]*$/, { message: { name: 'El nombre no es válido' } }),
    telefono: z.string()
        .refine((value) => value === '' || /^\d{10}$/.test(value), {
            message: { phone: 'Debe tener exactamente 10 dígitos' }
        })
        .refine((value) => value === '' || /^[0-9]+$/.test(value), {
            message: { phone: 'No debe contener letras' }
        }),
    ciudad: z.string().regex(/^[^0-9]*$/, { message: { city: 'No debe contener números' } }),
})

export const categorySchema = z.object({
    name: z.string().min(1, { message: { name: 'Es requerido' } }).regex(/^[a-zA-Z\s]*$/, { message: { name: 'El nombre no es válido' } }),
})