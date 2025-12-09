import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
    name: string;
}

const CategorySchema = new Schema<ICategory>({
    name: { 
        type: String, 
        required: true,
        trim: true,
        unique: true // Recommended to prevent duplicate category names
    }
}, {
    // Suppress automatic Mongoose timestamps (createdAt and updatedAt)
    timestamps: false 
});

export default model<ICategory>("Category", CategorySchema);