import { Request, Response } from 'express';
import Stripe from 'stripe';
import { stripe } from '../config/stripe';
import Payment from '../models/payment.model';

export const createPaymentIntent = async (req: Request, res: Response) => {
    try {
        const { amount, bookingId, currency = 'inr', customerEmail, serviceTitle } = req.body;

        if (!amount || !bookingId) {
            return res.status(400).json({ error: 'Amount and bookingId are required' });
        }

        // Create Stripe Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents/paise
            currency: currency,
            metadata: {
                bookingId: bookingId.toString(),
                serviceTitle: serviceTitle || 'Nexom Service',
            },
            automatic_payment_methods: {
                enabled: true,
            },
            receipt_email: customerEmail,
        });

        // Save initial payment record to database
        await Payment.create({
            bookingId: bookingId.toString(),
            stripePaymentIntentId: paymentIntent.id,
            amount: amount,
            currency: currency,
            status: 'pending',
            customerEmail: customerEmail,
        });

        console.log(`Payment Intent created: ${paymentIntent.id} for Booking: ${bookingId}`);

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error: any) {
        console.error('Create Payment Intent Error:', error);
        res.status(500).json({
            error: 'Failed to initialize payment',
            message: error.message
        });
    }
};

export const handleWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig && process.env.NODE_ENV === 'production') {
        return res.status(400).send('Webhook Error: Missing stripe-signature header');
    }

    let event: Stripe.Event;

    try {
        if (webhookSecret && sig) {
            event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } else {
            // Fallback for development if secret is not set
            console.warn('Webhook signature verification skipped. Use STRIPE_WEBHOOK_SECRET in production.');
            event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        }
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`Payment succeeded: ${paymentIntent.id} for ${paymentIntent.amount / 100} ${paymentIntent.currency.toUpperCase()}`);

                // Update payment status in database
                const updatedPayment = await Payment.findOneAndUpdate(
                    { stripePaymentIntentId: paymentIntent.id },
                    { status: 'succeeded' },
                    { new: true }
                );

                if (updatedPayment) {
                    console.log(`Database updated for payment: ${paymentIntent.id}`);
                    try {
                        const bookingId = updatedPayment.bookingId;
                        const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || 'http://localhost:8085';
                        const axios = require('axios');
                        await axios.patch(`${BOOKING_SERVICE_URL}/api/v1/bookings/${bookingId}`, {
                            status: 'Paid'
                        });
                        console.log(`Booking Service notified for Booking: ${bookingId}`);
                    } catch (notifyError: any) {
                        console.error(`Failed to notify Booking Service: ${notifyError.message}`);
                    }
                }
                break;
            }
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const errorMessage = paymentIntent.last_payment_error?.message || 'Unknown error';
                console.log(`Payment failed: ${paymentIntent.id}. Error: ${errorMessage}`);

                await Payment.findOneAndUpdate(
                    { stripePaymentIntentId: paymentIntent.id },
                    { status: 'failed' }
                );
                break;
            }
            case 'payment_intent.processing': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`Payment processing: ${paymentIntent.id}`);
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (dbError: any) {
        console.error(`Database Update Error during webhook: ${dbError.message}`);
        // We still return 200 to Stripe to avoid retries if the event was received but DB update failed
        // In a real app, we might want to return 500 if we want Stripe to retry
    }

    res.json({ received: true });
};

export const getPaymentStatus = async (req: Request, res: Response) => {
    try {
        const { paymentIntentId } = req.params;
        const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.status(200).json(payment);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
