import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
    bookingId: string;
    stripePaymentIntentId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'succeeded' | 'failed' | 'refunded';
    customerEmail?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
    {
        bookingId: { type: String, required: true },
        stripePaymentIntentId: { type: String, required: true, unique: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'inr' },
        status: {
            type: String,
            enum: ['pending', 'succeeded', 'failed', 'refunded'],
            default: 'pending',
        },
        customerEmail: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<IPayment>('Payment', PaymentSchema);
