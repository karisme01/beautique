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

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    address: [addressSchema],
    answer: { 
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    preferences: {
        type: Map,
        of: Number 
    }, 
    seenProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }],
}, {timestamps: true})

export default mongoose.model('users', userSchema)