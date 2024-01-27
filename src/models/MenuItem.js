import { models, model, Schema } from "mongoose";

const extraItemBoxData = new Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        trim: true,
    },
})

const MenuItemSchema = new Schema({
    name: {
        type: String,
        trim: true,
        unique: true,

    },
    description: {
        type: String,
        trim: true,

    },
    price: {
        type: Number,
        trim: true,

    },
    category: {
        type: String,
        trim: true,

    },
    extraItemBox: [extraItemBoxData],
});

export default models.MenuItem || model('MenuItem', MenuItemSchema);
