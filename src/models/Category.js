import { models, model, Schema } from "mongoose";

const CategorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Se requiere'],
        unique: true,
        trim: true,
    }
}, { timestamps: true })

export default models.Category || model('Category', CategorySchema);