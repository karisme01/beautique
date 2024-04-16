import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // This should match the name you gave your user model
        required: true // Only if every brand must be associated with a user
    }
    // incharge: {
    //     type: String,
    //     required: true
    // },
    // products: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Products'
    // }],
    // address: {
    //     type: String,
    //     required: true
    // },
    // city: {
    //     type: String,
    //     required: true
    // }
}, { timestamps: true });

export default mongoose.model('Brand', brandSchema);
