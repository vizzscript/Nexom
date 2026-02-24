import axios from 'axios';
import { Request, Response } from 'express';
import Booking from '../models/booking.model';

export class BookingController {
    constructor() {
        this.create = this.create.bind(this);
        this.getUserBookings = this.getUserBookings.bind(this);
        this.getBookingById = this.getBookingById.bind(this);
        this.updateBooking = this.updateBooking.bind(this);
        this.cancelBooking = this.cancelBooking.bind(this);
        this.updateBookingStatusInternal = this.updateBookingStatusInternal.bind(this);
    }

    private getRequester(req: Request) {
        return req.user;
    }

    private isAdmin(req: Request) {
        return req.user?.role === 'admin';
    }

    async create(req: Request, res: Response) {
        try {
            const requester = this.getRequester(req);
            const { serviceId, service, date, time, details } = req.body;

            if (!requester?.subject) {
                return res.status(401).json({ success: false, message: 'Authentication required' });
            }

            const booking = await Booking.create({
                userId: requester.subject,
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
            const requester = this.getRequester(req);
            const { userId } = req.params;

            if (!requester?.subject) {
                return res.status(401).json({ success: false, message: 'Authentication required' });
            }
            if (!this.isAdmin(req) && userId !== requester.subject) {
                return res.status(403).json({ success: false, message: 'Forbidden' });
            }

            const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
            return res.status(200).json({ success: true, data: bookings });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async getBookingById(req: Request, res: Response) {
        try {
            const requester = this.getRequester(req);
            const { id } = req.params;
            const booking = await Booking.findById(id);
            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }
            if (!requester?.subject) {
                return res.status(401).json({ success: false, message: 'Authentication required' });
            }
            if (!this.isAdmin(req) && booking.userId !== requester.subject) {
                return res.status(403).json({ success: false, message: 'Forbidden' });
            }
            return res.status(200).json({ success: true, data: booking });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateBooking(req: Request, res: Response) {
        try {
            const requester = this.getRequester(req);
            const { id } = req.params;
            const existingBooking = await Booking.findById(id);
            if (!existingBooking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            if (!requester?.subject) {
                return res.status(401).json({ success: false, message: 'Authentication required' });
            }
            if (!this.isAdmin(req) && existingBooking.userId !== requester.subject) {
                return res.status(403).json({ success: false, message: 'Forbidden' });
            }

            const { serviceId, service, date, time, details } = req.body;
            const updatePayload: Record<string, unknown> = {};
            if (serviceId !== undefined) updatePayload.serviceId = serviceId;
            if (service !== undefined) updatePayload.service = service;
            if (date !== undefined) updatePayload.date = date;
            if (time !== undefined) updatePayload.time = time;
            if (details !== undefined) updatePayload.details = details;

            const booking = await Booking.findByIdAndUpdate(id, updatePayload, { new: true });

            return res.status(200).json({ success: true, data: booking });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async cancelBooking(req: Request, res: Response) {
        try {
            const requester = this.getRequester(req);
            const { id } = req.params;
            const booking = await Booking.findById(id);

            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }
            if (!requester?.subject) {
                return res.status(401).json({ success: false, message: 'Authentication required' });
            }
            if (!this.isAdmin(req) && booking.userId !== requester.subject) {
                return res.status(403).json({ success: false, message: 'Forbidden' });
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

    async updateBookingStatusInternal(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const allowedStatuses = ['Pending Payment', 'Paid', 'Confirmed', 'Cancelled'];

            if (!status || !allowedStatuses.includes(status)) {
                return res.status(400).json({ success: false, message: 'Invalid status value' });
            }

            const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }

            return res.status(200).json({ success: true, data: booking });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default new BookingController();
