import { Timestamp } from "mongodb";
import mongoose, {mongo} from "mongoose";

const videoSchema = new mongoose.Schema({ 
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    video: {
        data: {
            type: Buffer,
            required: true
        },
        contentType: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });



export default mongoose.model('Video', videoSchema)


 