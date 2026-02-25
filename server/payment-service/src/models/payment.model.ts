import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
    bookingId: string;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    amount: number;
    currency: string;
    status: 'pending' | 'succeeded' | 'failed' | 'refunded';
    bookingSyncStatus: 'pending' | 'synced' | 'failed';
    bookingSyncRetryCount: number;
    bookingSyncNextRetryAt?: Date | null;
    bookingSyncLastError?: string | null;
    bookingSyncedAt?: Date | null;
    customerEmail?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
    {
        bookingId: { type: String, required: true },
        razorpayOrderId: { type: String, required: true, unique: true },
        razorpayPaymentId: { type: String },
        razorpaySignature: { type: String },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'inr' },
        status: {
            type: String,
            enum: ['pending', 'succeeded', 'failed', 'refunded'],
            default: 'pending',
        },
        bookingSyncStatus: {
            type: String,
            enum: ['pending', 'synced', 'failed'],
            default: 'pending',
            index: true,
        },
        bookingSyncRetryCount: { type: Number, default: 0 },
        bookingSyncNextRetryAt: { type: Date, default: null, index: true },
        bookingSyncLastError: { type: String, default: null },
        bookingSyncedAt: { type: Date, default: null },
        customerEmail: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<IPayment>('Payment', PaymentSchema);
