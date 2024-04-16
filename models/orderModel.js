import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    userName: {
        type: String
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem', 
    }],
    status: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
