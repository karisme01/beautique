import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true 
    },
}, {_id: false});
 
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
    shipping_address: addressSchema,
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
    reserveDate: {
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
    payment_method: {
        type: String
    },
    status: String
}, { timestamps: true }, { minimize: false });

export default mongoose.model('OrderItem', orderItemSchema);
