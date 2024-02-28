import mongoose, { models, model, Schema } from "mongoose";

const innerDataSchema = new Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    typeSelect: {
        type: String,
    }
}, { timestamps: true })

const boxSchema = new Schema({
    name: {
        type: String,
    },
    maxLength: {
        type: Number,
    },
    description: {
        type: String,
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
