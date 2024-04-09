import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const additionSchema = new Schema({
    name: {
        type: String,
        trim: true,
    },
    amount: {
        type: Number,
        trim: true,
    },
})

const productSchema = new Schema({
    name: {
        type: String,
        trim: true,
    },
    amount: {
        type: Number,
        trim: true,
    },
    additions: [additionSchema],
})

const orderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    products: [productSchema],
    paymentMethod: { // Método de pago utilizado
        type: String,
        trim: true,
        enum: ['Efectivo', 'Tarjeta'],
    },
    deliveryMethod: { // Método de entrega del pedido
        method: {
            type: String,
            trim: true,
            enum: ['Domicilio', 'Restaurante'],
        },
        tableNumber: {
            type: Number,
            trim: true,
        }
    },
    shippingAddress: { // Dirección de envío
        type: String,
        trim: true,
    },
    city: { // Ciudad de envío
        type: String,
        trim: true,
    },
    additionalDetails: { // Detalles adicionales
        type: String,
        trim: true,
    },
    totalAmount: { // Total del pedido
        type: Number,
        trim: true,
    },
    paid: { // Estado del pago
        type: Boolean,
        default: false,
    },
    status: { // Estado del pedido (pendiente, en camino, entregado, etc.)
        type: String,
        enum: ['Pendiente', 'En camino', 'Entregado', 'Cancelado'],
        default: 'Pendiente',
        trim: true,
    },
}, { timestamps: true })

export default models.Order || model('Order', orderSchema);
