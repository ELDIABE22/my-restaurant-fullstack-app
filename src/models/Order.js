import mongoose, { Schema, model, models } from "mongoose";

const additionSchema = new Schema({
    name: {
        type: String,
    },
    amount: {
        type: Number,
    },
})

const productSchema = new Schema({
    name: {
        type: String,
    },
    amount: {
        type: Number,
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
        enum: ['Efectivo', 'Tarjeta'],
    },
    deliveryMethod: { // Método de entrega del pedido
        method: {
            type: String,
            enum: ['Domicilio', 'Restaurante'],
        },
        tableNumber: {
            type: Number,
        }
    },
    shippingAddress: { // Dirección de envío
        type: String
    },
    city: { // Ciudad de envío
        type: String
    },
    additionalDetails: { // Detalles adicionales
        type: String
    },
    totalAmount: { // Total del pedido
        type: Number,
    },
    paid: { // Estado del pago
        type: Boolean,
        default: false,
    },
    status: { // Estado del pedido (pendiente, en camino, entregado, etc.)
        type: String,
        enum: ['Pendiente', 'En camino', 'Entregado', 'Cancelado'],
        default: 'Pendiente'
    },
}, { timestamps: true })

export default models.Order || model('Order', orderSchema);
