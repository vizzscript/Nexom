import axios from 'axios';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { razorpay } from '../config/razorpay';
import Payment from '../models/payment.model';

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { amount, bookingId, currency = 'INR', customerEmail, serviceTitle } = req.body;

        if (!amount || !bookingId) {
            return res.status(400).json({ error: 'Amount and bookingId are required' });
        }

        const options = {
            amount: Math.round(amount * 100), // Razorpay expects amount in paise
            currency: currency.toUpperCase(),
            receipt: `receipt_${bookingId}`,
            notes: {
                bookingId: bookingId.toString(),
                serviceTitle: serviceTitle || 'Nexom Service',
                customerEmail: customerEmail || '',
            },
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ error: 'Failed to create Razorpay order' });
        }

        await Payment.create({
            bookingId: bookingId.toString(),
            razorpayOrderId: order.id,
            amount: amount,
            currency: currency,
            status: 'pending',
            customerEmail: customerEmail,
        });

        res.status(200).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });

    } catch (error: any) {
        console.error('Create Order Error:', error);
        res.status(500).json({ error: 'Initialization failed', message: error.message });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: 'Missing payment verification details' });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update payment status
            const updatedPayment = await Payment.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    status: 'succeeded',
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature
                },
                { new: true }
            );

            if (updatedPayment) {
                console.log(`Database updated for payment order: ${razorpay_order_id}`);

                // Notify Booking Service
                try {
                    const bookingId = updatedPayment.bookingId;
                    const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || 'http://localhost:8085';

                    await axios.patch(`${BOOKING_SERVICE_URL}/api/v1/bookings/${bookingId}`, {
                        status: 'Paid'
                    });
                    console.log(`Booking Service notified for Booking: ${bookingId}`);
                } catch (notifyError: any) {
                    console.error(`Failed to notify Booking Service: ${notifyError.message}`);
                    // We don't fail the response here, but we should log it
                }
            }

            res.status(200).json({ success: true, message: "Payment verified successfully" });
        } else {
            // Payment failed verification
            await Payment.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: 'failed' }
            );
            res.status(400).json({ success: false, error: "Invalid signature" });
        }

    } catch (error: any) {
        console.error('Verify Payment Error:', error);
        res.status(500).json({ error: 'Verification failed', message: error.message });
    }
};

export const getPaymentStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const payment = await Payment.findOne({ razorpayOrderId: orderId });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.status(200).json(payment);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
