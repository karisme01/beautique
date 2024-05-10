import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    image: {
        data: Buffer,
        contentType: String,
    },
    link: {
        type: String,
        required: true,
        trim: true
    },
    caption: {
        type: String,
        required: true,
        trim: true
    },

}, { timestamps: true });

export default mongoose.model('Post', postSchema);
