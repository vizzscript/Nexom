import axios from 'axios';
import { Request, Response } from 'express';
import Booking from '../models/booking.model';

export class BookingController {
    async create(req: Request, res: Response) {
        try {
            const { userId, serviceId, service, date, time, details } = req.body;

            if (!userId) {
                return res.status(400).json({ success: false, message: 'User ID is required' });
            }

            const booking = await Booking.create({
                userId,
                serviceId,
                service,
                date,
                time,
                details,
                status: 'Pending Payment'
            });

            return res.status(201).json({ success: true, data: booking });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getUserBookings(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
            return res.status(200).json({ success: true, data: bookings });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getBookingById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const booking = await Booking.findById(id);
            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }
            return res.status(200).json({ success: true, data: booking });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateBooking(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }
            return res.status(200).json({ success: true, data: booking });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async cancelBooking(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const booking = await Booking.findById(id);

            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            if (booking.status === 'Paid' || booking.status === 'Confirmed') {
                try {
                    const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL;
                    await axios.post(`${PAYMENT_SERVICE_URL}/api/v1/payments/refund`, {
                        bookingId: id
                    });
                    console.log(`Refund initiated for booking ${id}`);
                } catch (refundError: any) {
                    console.error('Refund failed:', refundError.message);
                    // Depending on policy, we might want to stop cancellation or proceed.
                    // For now, let's return error so user knows/can retry or contact support.
                    return res.status(500).json({
                        success: false,
                        message: 'Cancellation failed: Unable to process refund. Please contact support.'
                    });
                }
            }

            const updatedBooking = await Booking.findByIdAndUpdate(id, { status: 'Cancelled' }, { new: true });

            return res.status(200).json({ success: true, data: updatedBooking });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default new BookingController();
