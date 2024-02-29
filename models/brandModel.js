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
