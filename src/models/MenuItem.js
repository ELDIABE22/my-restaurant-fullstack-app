import mongoose, { models, model, Schema } from "mongoose";

const innerDataSchema = new Schema({
    name: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        trim: true,
    },
    typeSelect: {
        type: String,
        trim: true,
    }
}, { timestamps: true })

const boxSchema = new Schema({
    name: {
        type: String,
        trim: true,
    },
    maxLength: {
        type: Number,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    data: {
        type: [innerDataSchema]
    }
}, { timestamps: true })

const MenuItemSchema = new Schema({
    image: {
        url: String,
        public_id: String,
    },
    name: {
        type: String,
        required: [true, 'Se requiere'],
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'Se requiere'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Se requiere'],
        trim: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Se requiere'],
    },
    itemBox: [boxSchema],
}, { timestamps: true });

export default models.MenuItem || model('MenuItem', MenuItemSchema);
