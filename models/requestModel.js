import { Timestamp } from "mongodb";
import mongoose, { mongo } from "mongoose";

const requestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        ref: 'users',
        required: true
    },
    brandId: {
        type: mongoose.ObjectId,
        ref: 'Brand',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    type: String,
    text: String,
}, {timestamps: true}
);

export default mongoose.model('Request', requestSchema)

 
