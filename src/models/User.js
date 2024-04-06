import { models, model, Schema } from "mongoose";

const UserSchema = new Schema({
    nombreCompleto: {
        type: String,
        required: [true, 'Se requiere'],
        trim: true,
    },
    correo: {
        type: String,
        required: [true, 'Se requiere'],
        unique: true,
        validate: {
            validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Correo electrónico no válido',
        },
        trim: true,
    },
    contraseña: {
        type: String,
        required: [true, 'Se requiere'],
        minlength: 6,
        trim: true,
        select: false,
    },
    telefono: {
        type: String,
        trim: true,
    },
    ciudad: {
        type: String,
        trim: true,
    },
    direccion: {
        type: String,
        trim: true,
    },
    admin: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: {
        type: String,
        trim: true,
    },
    resetPasswordExpires: {
        type: Date,
        trim: true,
    },
}, {
    timestamps: true,
})

export default models.User || model('User', UserSchema);