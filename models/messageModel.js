import { Timestamp } from "mongodb";
import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        ref: 'users',
        required: true
    },
    text: String,
}, {timestamps: true}
);

export default mongoose.model('Message', messageSchema)

 
