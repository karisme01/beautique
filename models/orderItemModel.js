import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products', 
        required: true
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand', 
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand', 
        required: true 
    },
    purchaseType: {
        type: String,
        required: true,
        enum: ['0', '1', '2'],
    },
    size: {
        type: String,
        required: true,
    },
    insured: {
        type: Boolean,
        default: false,
    },
    reserved: {
        type: Boolean,
        default: false,
    },
    reservedDate: {
        type: Date,
    },
    collectedDate: {
        type: Date,
        default: null
    },
    leaseReturnDate: {
        type: Date,
        default: null
    },
    extension: {
        type: Number,
        default: 0
    },  
    leaseReturned: {
        type: Boolean
    },
    returned: {
        type: Boolean
    },
    returnReason: {
        type: String,
        default: null
    },
    status: String
}, { timestamps: true }, { minimize: false });

export default mongoose.model('OrderItem', orderItemSchema);
