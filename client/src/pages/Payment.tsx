import { ROUTES } from '@/constants';
import { useAuth } from '@/features/auth';
import { bookingService } from '@/features/booking/services/booking.service';
import type { Booking } from '@/features/booking/types';
import { formatCurrency } from '@/utils';
import {
    CardElement,
    Elements,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ENV_CONFIG } from '@/config/env.config';

const stripePromise = loadStripe(ENV_CONFIG.STRIPE_PUBLISHABLE_KEY);

const CheckoutForm: React.FC<{ booking: Booking; onStatusUpdate: (status: 'idle' | 'success') => void }> = ({ booking, onStatusUpdate }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Detect dark mode for Stripe CardElement dynamic styling
    const isDarkMode = document.documentElement.classList.contains('dark');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            const response = await axios.post(`${ENV_CONFIG.PAYMENT_SERVICE_URL}/create-intent`, {
                amount: booking.service.price,
                bookingId: booking.id,
                currency: 'inr',
                customerEmail: 'customer@example.com',
                serviceTitle: booking.service.title
            });

            const { clientSecret } = response.data;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        name: 'Customer',
                        phone: booking.details.phone,
                    },
                }
            });

            if (result.error) {
                setErrorMessage(result.error.message || 'Payment failed. Please try again.');
                setIsProcessing(false);
                return;
            }

            if (result.paymentIntent.status === 'succeeded') {
                try {
                    await bookingService.updateBooking(booking.id, { status: 'Paid' });
                } catch (updateError) {
                    console.error('Update Error:', updateError);
                }
                onStatusUpdate('success');
                setTimeout(() => navigate(ROUTES.DASHBOARD), 3000);
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'An unexpected error occurred.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm transition-all focus-within:border-[#d4af37] focus-within:ring-1 focus-within:ring-[#d4af37]/20">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#d4af37]" /> Card Information
                </label>
                <div className="py-2">
                    <CardElement
                        options={{
                            hidePostalCode: true,
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: isDarkMode ? '#f8fafc' : '#1e293b',
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                    '::placeholder': { color: isDarkMode ? '#475569' : '#94a3b8' },
                                    iconColor: '#d4af37',
                                },
                                invalid: {
                                    color: '#ef4444',
                                    iconColor: '#ef4444',
                                },
                            },
                        }}
                    />
                </div>
            </div>

            {errorMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-900/30 flex items-start gap-3"
                >
                    <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="font-bold">!</span>
                    </div>
                    {errorMessage}
                </motion.div>
            )}

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full relative overflow-hidden btn btn-primary bg-[#d4af37] text-white py-4 rounded-2xl shadow-lg hover:shadow-xl hover:bg-[#b5952f] transition-all flex items-center justify-center gap-3 font-bold text-lg disabled:opacity-70 disabled:cursor-not-allowed group"
            >
                {isProcessing ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing Payment...</span>
                    </>
                ) : (
                    <>
                        <span>Pay {formatCurrency(booking.service?.price)}</span>
                        <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>

            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span>Encrypted & Secure Payment via Stripe</span>
                </div>
                <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all dark:invert">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                </div>
            </div>
        </form>
    );
};

const PaymentPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const bookingId = query.get('bookingId');

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success'>('idle');

    useEffect(() => {
        if (!isAuthenticated) navigate(ROUTES.LOGIN);
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (!bookingId) {
            navigate(ROUTES.DASHBOARD);
            return;
        }
        const fetchBooking = async () => {
            try {
                setLoading(true);
                const data = await bookingService.getBookingById(bookingId);
                setBooking(data);
            } catch (error) {
                navigate(ROUTES.DASHBOARD);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId, navigate]);

    if (loading || !booking) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0f172a]">
                <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin mb-4" />
                <p className="text-xl text-slate-700 dark:text-slate-300">Loading booking details...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-[#0f172a] px-4 relative overflow-hidden transition-colors duration-300">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-100/30 dark:bg-white/5 -skew-x-12 translate-x-1/4 pointer-events-none" />

            <div className="container mx-auto max-w-2xl relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#d4af37] transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Booking</span>
                </button>

                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <div className="p-10 bg-slate-900 dark:bg-slate-950 text-white relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <CreditCard className="w-24 h-24 rotate-12" />
                        </div>
                        <h1 className="text-3xl font-bold font-serif mb-2">Complete Payment</h1>
                        <p className="text-slate-400 text-sm max-w-xs">Finalize your booking for {booking.service?.title} with our secure checkout.</p>
                    </div>

                    <div className="p-10">
                        <div className="flex justify-between items-end mb-10 pb-8 border-b border-slate-100 dark:border-slate-700">
                            <div>
                                <p className="text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-2">Total Amount</p>
                                <p className="text-4xl font-bold text-slate-900 dark:text-white">{formatCurrency(booking.service?.price)}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-700">
                                <CreditCard className="w-10 h-10 text-[#d4af37]" />
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="p-6 rounded-3xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 relative overflow-hidden">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-500" />
                                    Booking Summary
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 mb-1">Service</p>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">{booking.service?.title}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 mb-1">Schedule</p>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">{booking.date} @ {booking.time}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-slate-500 dark:text-slate-400 mb-1">Location</p>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{booking.details.address}</p>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {paymentStatus === 'idle' ? (
                                    <motion.div
                                        key="payment-form"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                    >
                                        <Elements stripe={stripePromise}>
                                            <CheckoutForm booking={booking} onStatusUpdate={setPaymentStatus} />
                                        </Elements>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <div className="relative w-24 h-24 mx-auto mb-6">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", damping: 12 }}
                                                className="absolute inset-0 bg-green-100 dark:bg-green-900/20 rounded-full"
                                            />
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="absolute inset-0 flex items-center justify-center"
                                            >
                                                <CheckCircle2 className="w-16 h-16 text-green-500" />
                                            </motion.div>
                                        </div>
                                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 font-serif">Payment Successful!</h2>
                                        <p className="text-slate-500 dark:text-slate-400 mb-8">Your booking has been confirmed. We've sent a receipt to your email.</p>
                                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden max-w-xs mx-auto">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 3 }}
                                                className="h-full bg-[#d4af37]"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;