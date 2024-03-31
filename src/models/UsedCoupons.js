import mongoose, { Schema, model, models } from "mongoose";

const UsedCouponsSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
    },
    couponId: {
        type: mongoose.Types.ObjectId,
    },
    used: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

export default models.UsedCoupons || model('UsedCoupons', UsedCouponsSchema);