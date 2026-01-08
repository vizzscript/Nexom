import { Document, Schema, Types, model } from "mongoose";

export interface IService extends Document {
    title: string;
    description: string;
    category: Types.ObjectId; // References the Category Model _id
    price: number;
    duration: string;
    rating: number;
    reviews: number;
    imageUrl: string;
    features: string[];
    isFeatured: boolean;
    createdAt: Date;
}

const ServiceSchema = new Schema<IService>({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    // Relationship: Links this service to a specific Category _id
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    duration: {
        type: String, // e.g., "2-3 Hours"
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0
    },
    imageUrl: {
        type: String,
        required: true
    },
    features: {
        type: [String],
        default: []
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default model<IService>("Service", ServiceSchema);