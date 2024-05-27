import { z } from 'zod';

export const registerSchema = z.object({
    nombreCompleto: z.string().min(1, { message: { name: 'Es requerido' } }).max(50, { message: { name: "El nombre no puede tener más de 50 caracteres" } }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, { message: { name: 'El nombre no es válido' } }),
    correo: z.string().min(1, { message: { email: 'Es requerido' } }).email({ message: { email: 'El correo no es válido' } }),
    telefono: z.string().min(1, { message: { phone: 'Es requerido' } })
        .refine((value) => value === '' || /^\d{10}$/.test(value), {
            message: { phone: 'Debe tener exactamente 10 dígitos' }
        })
        .refine((value) => value === '' || /^[0-9]+$/.test(value), {
            message: { phone: 'No debe contener letras' }
        }),
    ciudad: z.string().min(1, { message: { city: 'Es requerido' } }).regex(/^[^0-9]*$/, { message: { city: 'No debe contener números' } }),
    direccion: z.string().min(1, { message: { address: 'Es requerido' } }),
    contraseña: z.string().min(1, { message: { password: 'Es requerido' } }).min(6, { message: { password: 'La contraseña debe tener al menos 6 caracteres' } }).max(15, { message: { password: 'La contraseña no puede tener más de 15 caracteres' } }),
});

export const loginSchema = z.object({
    correo: z.string().min(1, { message: { email: 'Es requerido' } }).email({ message: { email: 'El correo no es válido' } }),
    contraseña: z.string().min(1, { message: { password: 'Es requerido' } }).min(6, { message: { password: 'La contraseña debe tener al menos 6 caracteres' } }).max(15, { message: { password: 'La contraseña no puede tener más de 15 caracteres' } }),
})

export const profileSchema = z.object({
    nombreCompleto: z.string().min(1, { message: { name: 'Es requerido' } }).max(50, { message: { name: "El nombre no puede tener más de 50 caracteres" } }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, { message: { name: 'El nombre no es válido' } }),
    telefono: z.string().min(1, { message: { phone: 'Es requerido' } })
        .refine((value) => value === '' || /^\d{10}$/.test(value), {
            message: { phone: 'Debe tener exactamente 10 dígitos' }
        })
        .refine((value) => value === '' || /^[0-9]+$/.test(value), {
            message: { phone: 'No debe contener letras' }
        }),
    ciudad: z.string().min(1, { message: { city: 'Es requerido' } }).regex(/^[^0-9]*$/, { message: { city: 'No debe contener números' } }),
    direccion: z.string().min(1, { message: { address: 'Es requerido' } }),
})

export const orderDataSchema = z.object({
    nombreCompleto: z.string().min(1, { message: { name: 'Es requerido' } }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, { message: { name: 'El nombre no es válido' } }),
    telefono: z.string().min(1, { message: { phone: 'Es requerido' } })
        .refine((value) => value === '' || /^\d{10}$/.test(value), {
            message: { phone: 'Debe tener exactamente 10 dígitos' }
        })
        .refine((value) => value === '' || /^[0-9]+$/.test(value), {
            message: { phone: 'No debe contener letras' }
        }),
    direccion: z.string().min(1, { message: { address: 'Es requerido' } }),
    ciudad: z.string().min(1, { message: { city: 'Es requerido' } }).regex(/^[^0-9]*$/, { message: { city: 'No debe contener números' } }),
})

export const categorySchema = z.object({
    name: z.string().min(1, { message: { name: 'Es requerido' } }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, { message: { name: 'El nombre no es válido' } }),
})

const innerDataSchemaZod = z.object({
    nombre: z.string().min(1, { message: { boxDataName: 'Es requerido' } }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, { message: { boxDataName: 'El nombre no es válido' } }),
    precio: z.string().refine((value) => value === '' || /^[0-9]+$/.test(value), {
        message: { boxDataPrice: 'El precio no es válido' }
    }).optional(),
    tipo: z.string().min(1, { message: { typeSelect: 'Es requerido' } }),
}).refine(data => {
    if (data.tipo === 'Sin valor' || data.tipo === '') {
        return true;
    }
    return data.precio && data.precio.length > 0;
}, {
    message: { boxDataPrice: 'Es requerido' }
});

export const boxSchemaZod = z.object({
    nombre: z.string().min(1, { message: { boxName: 'Es requerido' } }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, { message: { boxName: 'El nombre no es válido' } }),
    cantidad_maxima: z.string().min(1, { message: { maxLength: 'Es requerido' } }),
    descripcion: z.string().optional(),
    dataMenuItem: z.array(innerDataSchemaZod).nonempty({ message: { data: 'Se requiere al menos un elemento en la caja' } }).optional(),
});

export const menuItemSchema = z.object({
    name: z.string().min(1, { message: { name: 'Es requerido' } }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, { message: { name: 'El nombre no es válido' } }),
    description: z.string().min(1, { message: { description: 'Es requerido' } }),
    price: z.string().min(1, { message: { price: 'Es requerido' } }).refine((value) => value === '' || /^[0-9]+$/.test(value), {
        message: { price: 'No debe contener letras' }
    }),
    category: z.string().min(1, { message: { category: 'Es requerido' } }),
    itemBox: z.array(boxSchemaZod).optional(),
})

export const couponsSchema = z.object({
    code: z.string().min(1, { message: { code: 'Es requerido' } }),
    discountPercentage: z.string()
        .min(1, { message: { discountPercentage: 'Es requerido' } })
        .refine((value) => {
            const num = Number(value);
            return !isNaN(num) && num >= 1 && num <= 100;
        }, { message: { discountPercentage: "Número entre 1 y 100" } }),
    expirationDate: z.string()
        .min(1, {
            message: { expirationDate: 'Es requerido' },
        }).refine((value) => {
            const expirationDate = new Date(value);
            return expirationDate > new Date();
        }, {
            message: { expirationDate: "Debe ser posterior a la fecha actual" },
        })
});

export const usedCouponSchema = z.object({
    couponCode: z.string().min(1, { message: { couponCode: 'Es requerido' } }),
})

export const deliveryMethodSchema = z.object({
    tableNumber: z.string()
        .min(1, { message: { tableNum: 'Es requerido' } })
        .refine((value) => {
            const num = Number(value);
            return !isNaN(num) && num >= 1 && num <= 10;
        }, { message: { tableNum: "Mesa entre 1 y 10" } }),
})

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(1, { message: { newPassword: 'Es requerido' } }).min(6, { message: { newPassword: 'La contraseña debe tener al menos 6 caracteres' } }).max(15, { message: { newPassword: 'La contraseña no puede tener más de 15 caracteres' } }),
    confirmNewPassword: z.string().min(1, { message: { confirmNewPassword: 'Es requerido' } }).min(6, { message: { confirmNewPassword: 'La contraseña debe tener al menos 6 caracteres' } }).max(15, { message: { confirmNewPassword: 'La contraseña no puede tener más de 15 caracteres' } }),
})

export const correoForgotPasswordSchema = z.object({
    correo: z.string().min(1, { message: { email: 'Es requerido' } }).email({ message: { email: 'El correo no es válido' } }),
})

export const editTipSchema = z.object({
    tip: z.string().min(1, { message: { tip: 'Es requerido' } }).refine((value) => value === '' || /^[0-9]+$/.test(value), {
        message: { tip: 'No debe contener letras' }
    }),
})