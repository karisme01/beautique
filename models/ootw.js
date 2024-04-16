import { Timestamp } from "mongodb";
import mongoose, { mongo } from "mongoose";

const ootwSchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        ref: 'users',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
}, {timestamps: true}
);

export default mongoose.model('Ootw', ootwSchema)

 
