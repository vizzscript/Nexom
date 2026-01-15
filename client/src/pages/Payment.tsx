import { ROUTES } from '@/constants';
import { useAuth } from '@/features/auth';
import { formatCurrency } from '@/utils';
import {
    CardElement,
    Elements,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ENV_CONFIG } from '@/config/env.config';

// Initialize Stripe with publishable key from config
const stripePromise = loadStripe(ENV_CONFIG.STRIPE_PUBLISHABLE_KEY);

interface BookingSummary {
    id: number;
    service: {
        title: string;
        price: number;
    };
    date: string;
    time: string;
    details: {
        name: string;
        email: string;
        address: string;
    };
    status: string;
}

const CheckoutForm: React.FC<{ booking: BookingSummary; onStatusUpdate: (status: 'idle' | 'success') => void }> = ({ booking, onStatusUpdate }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            // 1. Fetch the clientSecret from your backend
            const response = await fetch(`${ENV_CONFIG.PAYMENT_SERVICE_URL}/create-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: booking.service.price,
                    bookingId: booking.id,
                    currency: 'inr',
                    customerEmail: booking.details.email || 'customer@example.com',
                    serviceTitle: booking.service.title
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || errorData.error || 'Failed to initialize payment');
            }

            const { clientSecret } = await response.json();

            // 2. Confirm the payment with Stripe
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        name: booking.details.name || 'Customer Name',
                        email: booking.details.email,
                    },
                }
            });

            if (result.error) {
                // Show error to your customer (e.g., insufficient funds)
                setErrorMessage(result.error.message || 'Payment failed. Please try again.');
                setIsProcessing(false);
                return;
            }

            if (result.paymentIntent.status === 'succeeded') {
                // 3. Update local storage on success
                const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
                const updated = storedBookings.map((b: any) =>
                    b.id === booking.id ? { ...b, status: 'Paid' } : b
                );
                localStorage.setItem('bookings', JSON.stringify(updated));

                onStatusUpdate('success');

                // Redirect after a short delay to show success state
                setTimeout(() => {
                    navigate(ROUTES.DASHBOARD);
                }, 3000);
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
            console.error('Payment Error:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm transition-all focus-within:border-[#d4af37] focus-within:ring-1 focus-within:ring-[#d4af37]/20">
                <label className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#d4af37]" /> Card Information
                </label>
                <div className="py-2">
                    <CardElement
                        options={{
                            hidePostalCode: true,
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#1e293b',
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                    '::placeholder': { color: '#94a3b8' },
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
                    className="p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 flex items-start gap-3"
                >
                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
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
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span>Encrypted & Secure Payment via Stripe</span>
                </div>

                <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
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

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN);
        }
    }, [isAuthenticated, navigate]);

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const bookingId = query.get('bookingId');

    const [booking, setBooking] = useState<BookingSummary | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success'>('idle');

    useEffect(() => {
        if (!bookingId) {
            navigate(ROUTES.DASHBOARD);
            return;
        }

        const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const found = storedBookings.find((b: any) => b.id === parseInt(bookingId));

        if (!found) {
            navigate(ROUTES.DASHBOARD);
        } else {
            setBooking(found);
        }
    }, [bookingId, navigate]);

    if (!booking) return null;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#f8fafc] px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -skew-x-12 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto max-w-2xl relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-[#d4af37] transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Booking</span>
                </button>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="p-10 bg-slate-900 text-white relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <CreditCard className="w-24 h-24 rotate-12" />
                        </div>
                        <h1 className="text-3xl font-bold font-serif mb-2">Complete Payment</h1>
                        <p className="text-slate-400 text-sm max-w-xs">Finalize your booking for {booking.service?.title} with our secure checkout.</p>
                    </div>

                    <div className="p-10">
                        <div className="flex justify-between items-end mb-10 pb-8 border-b border-slate-100">
                            <div>
                                <p className="text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-2">Total Amount</p>
                                <p className="text-4xl font-bold text-slate-900">{formatCurrency(booking.service?.price)}</p>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                                <CreditCard className="w-10 h-10 text-[#d4af37]" />
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/50 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-green-600" />
                                    Booking Summary
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-slate-500 mb-1">Service</p>
                                        <p className="font-semibold text-slate-800">{booking.service?.title}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 mb-1">Schedule</p>
                                        <p className="font-semibold text-slate-800">{booking.date} @ {booking.time}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-slate-500 mb-1">Location</p>
                                        <p className="font-semibold text-slate-800 line-clamp-1">{booking.details.address}</p>
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
                                        transition={{ duration: 0.4 }}
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
                                                className="absolute inset-0 bg-green-100 rounded-full"
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
                                        <h2 className="text-3xl font-bold text-slate-900 mb-3 font-serif">Payment Successful!</h2>
                                        <p className="text-slate-500 mb-8">Your booking has been confirmed. We've sent a receipt to your email.</p>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden max-w-xs mx-auto">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 3 }}
                                                className="h-full bg-[#d4af37]"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400 mt-4">Redirecting to dashboard...</p>
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
