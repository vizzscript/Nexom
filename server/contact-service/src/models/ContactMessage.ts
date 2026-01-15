// models/ContactMessage.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IContactMessage extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    notificationTitle: string;
    notificationBody: string;
    status: 'pending' | 'in-progress' | 'resolved';
    userId?: string;
    isRead: boolean;
    createdAt: Date;
}

const ContactMessageSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    notificationTitle: { type: String },
    notificationBody: { type: String },
    status: { type: String, enum: ['pending', 'in-progress', 'resolved'], default: 'pending' },
    userId: { type: String },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);