import { Schema, model, Document } from "mongoose";

export interface IService extends Document{
    title: string,
    description: string,
    price: number,
    duration: number,
    category: string,
    imageUrl?: string,
    createdAt: Date
}

const ServiceSchema = new Schema<IService>({
    title: {type: String, required: true},
    description: {type: String},
    price: { type: Number, required: true},
    duration: { type: Number, required: true},
    category: {type: String, required: true},
    imageUrl: {type: String},
    createdAt: {type: Date, default: Date.now}
})


export default model<IService>("Service", ServiceSchema);