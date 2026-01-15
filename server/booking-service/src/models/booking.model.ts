import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
    userId: string;
    serviceId: string;
    service: {
        title: string;
        price: number;
        imageUrl?: string;
    };
    date: string;
    time: string;
    status: 'Pending Payment' | 'Paid' | 'Confirmed' | 'Cancelled';
    details: {
        address: string;
        phone: string;
        notes?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        serviceId: { type: String, required: true },
        service: {
            title: { type: String, required: true },
            price: { type: Number, required: true },
            imageUrl: { type: String },
        },
        date: { type: String, required: true },
        time: { type: String, required: true },
        status: {
            type: String,
            enum: ['Pending Payment', 'Paid', 'Confirmed', 'Cancelled'],
            default: 'Pending Payment',
        },
        details: {
            address: { type: String, required: true },
            phone: { type: String, required: true },
            notes: { type: String },
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret: any) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

export default mongoose.model<IBooking>('Booking', BookingSchema);
