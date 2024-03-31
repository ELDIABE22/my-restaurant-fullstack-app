import { Schema, model, models } from "mongoose";

const CouponsSchema = new Schema({
    code: {
        type: String,
        trim: true,
        unique: true,
    },
    discountPercentage: {
        type: Number,
        trim: true,
    },
    expirationDate: {
        type: Date,
        trim: true,
    }
}, { timestamps: true });

export default models.Coupons || model('Coupons', CouponsSchema);
