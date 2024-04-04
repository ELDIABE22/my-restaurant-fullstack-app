import mongoose, { Schema, models, model } from "mongoose";

// Se crea un usuario temporal si hacen un pedido en el restaurante sin estar registrado
const UnRegisteredOrderSchema = new Schema({
    name: {
        type: String,
        trim: true,
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
    }
})

export default models.UnRegisteredOrder || model('UnRegisteredOrder', UnRegisteredOrderSchema);