import { Timestamp } from "mongodb";
import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.ObjectId,
        ref: 'Category',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    rent: {
        type: Boolean,
    },
    color: {
        type: String,
        required: true
    },
    occasion: {
        type: String
    },
    sleeve: {
        type: String
    },
    material: {
        type: String
    },
    brand: {
        type: mongoose.ObjectId,
        ref: 'Brand',
        required: true
    }, 
    properties: {
        type: Map,
        of: Number 
    }, 
    reviews: [String]

}, {timestamps: true}
);

export default mongoose.model('Products', productSchema)

 
