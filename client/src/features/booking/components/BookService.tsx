import { ROUTES, TIME_SLOTS } from '@/constants';
import { useAuth } from '@/features/auth';
import { bookingService } from '@/features/booking/services/booking.service';
import { useQuery, useServicesData } from '@/hooks';
import type { AugmentedService, BookingData, FrontendService } from '@/types';
import { formatCurrency } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, Check, CheckCircle, Clock, Home, Loader2, MapPin, Shield, Star, User } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// ====================================================================
// HELPER LOGIC FOR AUGMENTATION
// ====================================================================

const augmentServices = (services: FrontendService[]): AugmentedService[] => {
    if (!services || services.length === 0) return [];

    return services.map((service, index) => {
        const icons = [Home, Shield, Star, Clock];
        const durations = ['2-3 Hours', '4-5 Hours', '6-8 Hours', '3-4 Hours'];

        return {
            ...service,
            icon: icons[index % icons.length],
            duration: durations[index % durations.length],
        } as AugmentedService;
    });
};

// ====================================================================
// COMPONENT
// ====================================================================

const BookService: React.FC = () => {
    const navigate = useNavigate();
    const query = useQuery();
    const initialServiceId = query.get('serviceId');
    const editId = query.get('editId');

    const { services, loading: servicesLoading } = useServicesData();
    const { user } = useAuth();

    const augmentedServices = useMemo(() => augmentServices(services), [services]);

    const [step, setStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [fetchingBooking, setFetchingBooking] = useState(false);
    const [formData, setFormData] = useState<BookingData>({
        serviceId: initialServiceId || null,
        date: null,
        time: null,
        details: { phone: '', address: '', notes: '' }
    });

    useEffect(() => {
        if (augmentedServices.length > 0 && initialServiceId && formData.serviceId === initialServiceId && step === 1 && !editId) {
            const serviceExists = augmentedServices.some(s => s.id === initialServiceId);

            if (serviceExists) {
                setStep(2);
                window.scrollTo(0, 0);
            } else {
                setFormData(prev => ({ ...prev, serviceId: null }));
            }
        }
    }, [augmentedServices, initialServiceId, formData.serviceId, step, editId]);

    useEffect(() => {
        if (editId && augmentedServices.length > 0) {
            const fetchBookingToEdit = async () => {
                try {
                    setFetchingBooking(true);
                    const bookingToEdit = await bookingService.getBookingById(editId);
                    if (bookingToEdit) {
                        setFormData({
                            serviceId: bookingToEdit.serviceId,
                            date: bookingToEdit.date,
                            time: bookingToEdit.time,
                            details: {
                                phone: bookingToEdit.details.phone || '',
                                address: bookingToEdit.details.address || '',
                                notes: bookingToEdit.details.notes || ''
                            }
                        });
                        setStep(2);
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    setFetchingBooking(false);
                }
            };
            fetchBookingToEdit();
        }
    }, [editId, augmentedServices]);

    const handleNext = async () => {
        if (step === 3) {
            if (!user?.uid) {
                navigate(ROUTES.LOGIN);
                return;
            }

            if (!formData.details || !formData.details.phone || !formData.details.address) {
                toast.error('Please enter your phone number and address');
                return;
            }

            if (!selectedService) return;

            try {
                setIsSaving(true);
                if (editId) {
                    await bookingService.updateBooking(editId, {
                        serviceId: selectedService.id,
                        service: {
                            title: selectedService.title,
                            price: selectedService.price,
                            imageUrl: selectedService.image
                        },
                        date: formData.date!,
                        time: formData.time!,
                        details: formData.details
                    });
                    navigate(`${ROUTES.PAYMENT}?bookingId=${editId}`);
                } else {
                    const newBooking = await bookingService.createBooking({
                        userId: user.uid,
                        serviceId: selectedService.id,
                        service: {
                            title: selectedService.title,
                            price: selectedService.price,
                            imageUrl: selectedService.image
                        },
                        date: formData.date!,
                        time: formData.time!,
                        details: formData.details
                    });
                    navigate(`${ROUTES.PAYMENT}?bookingId=${newBooking.id}`);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsSaving(false);
            }
        } else {
            setStep((prev) => Math.min(prev + 1, 3));
        }
    };
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

    const updateDetails = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            details: { ...formData.details, [e.target.name]: e.target.value }
        });
    };

    const selectedService = augmentedServices.find(s => s.id === formData.serviceId);

    const slideVariants = {
        enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 })
    };

    const direction = useMemo(() => (step > 1 ? 1 : -1), [step]);

    if (servicesLoading || fetchingBooking) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-slate-950">
                <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin mb-4" />
                <p className="text-xl text-slate-700 dark:text-slate-300">Loading service details...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 pt-24 pb-12 relative overflow-hidden transition-colors duration-500">
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #334155;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d4af37;
                }
            `}</style>

            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[55%] h-full hidden lg:block overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/20" />
                <div className="absolute inset-0 opacity-[0.3] dark:opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#64748b 2px, transparent 2px)', backgroundSize: '32px 32px' }} />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#f8fafc] dark:to-slate-950" />
            </div>
            <div className="absolute top-20 left-10 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 dark:text-white mb-4">
                            Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#b5952f]">Experience</span>
                        </h1>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col h-[650px] relative overflow-hidden transition-colors">

                                {/* Stepper Header */}
                                <div className="p-8 pb-4 shrink-0 bg-white dark:bg-slate-900 z-10">
                                    <div className="flex items-center justify-between relative max-w-lg mx-auto">
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-10" />
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#d4af37] transition-all duration-500"
                                            style={{ width: `${((step - 1) / 2) * 100}%` }} />

                                        {[1, 2, 3].map((num) => (
                                            <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 bg-white dark:bg-slate-900 ${step >= num ? 'text-[#d4af37] border-2 border-[#d4af37] shadow-sm scale-110' : 'text-slate-400 dark:text-slate-600 border-2 border-slate-200 dark:border-slate-800'
                                                }`}>
                                                {step > num ? <Check className="w-5 h-5 fill-current" /> : num}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-2">
                                    <AnimatePresence mode='wait' custom={direction}>
                                        {step === 1 && (
                                            <motion.div
                                                key="step1"
                                                variants={slideVariants}
                                                custom={direction}
                                                initial="enter" animate="center" exit="exit"
                                                className="space-y-4 pb-4"
                                            >
                                                {selectedService && initialServiceId && formData.serviceId === initialServiceId ? (
                                                    <div className="p-6 rounded-2xl border-2 border-green-200 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10 mb-6">
                                                        <h3 className="text-xl font-bold font-serif text-green-700 dark:text-green-500 flex items-center gap-2 mb-2">
                                                            <CheckCircle className="w-6 h-6" /> Service Selected
                                                        </h3>
                                                        <p className="text-slate-700 dark:text-slate-300">You are booking: <span className="font-semibold">{selectedService.title}</span>.</p>
                                                        <button
                                                            onClick={() => setFormData({ ...formData, serviceId: null })}
                                                            className="mt-3 text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 underline"
                                                        >
                                                            Change Service
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <h2 className="text-2xl font-bold font-serif mb-6 text-slate-800 dark:text-white sticky top-0 bg-white dark:bg-slate-900 py-2 z-10">Select a Service</h2>
                                                )}

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {augmentedServices.map((service) => (
                                                        <div
                                                            key={service.id}
                                                            onClick={() => setFormData({ ...formData, serviceId: service.id })}
                                                            className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-md ${formData.serviceId === service.id
                                                                ? 'border-[#d4af37] bg-[#d4af37]/5 dark:bg-[#d4af37]/10'
                                                                : 'border-slate-100 dark:border-slate-800 hover:border-[#d4af37]/50 dark:hover:border-[#d4af37]/50'
                                                                }`}
                                                        >
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${formData.serviceId === service.id ? 'bg-[#d4af37] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                                    }`}>
                                                                    <service.icon className="w-6 h-6" />
                                                                </div>
                                                                <span className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(service.price)}</span>
                                                            </div>
                                                            <h3 className="text-xl font-bold font-serif mb-2 dark:text-slate-100">{service.title}</h3>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{service.description}</p>
                                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-500">
                                                                <Clock className="w-3 h-3" /> {service.duration}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {step === 2 && (
                                            <motion.div
                                                key="step2"
                                                variants={slideVariants}
                                                custom={direction}
                                                initial="enter" animate="center" exit="exit"
                                                className="space-y-8 pb-4"
                                            >
                                                <h2 className="text-2xl font-bold font-serif mb-2 sticky top-0 bg-white dark:bg-slate-900 py-2 z-10 dark:text-white">Schedule Visit</h2>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Select Date</label>
                                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                                        {[...Array(14)].map((_, i) => {
                                                            const date = new Date();
                                                            date.setDate(date.getDate() + i + 1);
                                                            const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
                                                            const isSelected = formData.date === dateStr;

                                                            return (
                                                                <button
                                                                    key={i}
                                                                    onClick={() => setFormData({ ...formData, date: dateStr })}
                                                                    className={`p-3 rounded-xl border text-center transition-all ${isSelected
                                                                        ? 'bg-[#d4af37] text-white border-[#d4af37] shadow-md'
                                                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-[#d4af37] text-slate-600 dark:text-slate-400'
                                                                        }`}
                                                                >
                                                                    <span className="block text-xs opacity-80 mb-1">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                                                                    <span className="block text-lg font-bold">{date.getDate()}</span>
                                                                    <span className="block text-xs font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Select Time</label>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                        {TIME_SLOTS.map((time) => (
                                                            <button
                                                                key={time}
                                                                onClick={() => setFormData({ ...formData, time })}
                                                                className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all ${formData.time === time
                                                                    ? 'bg-[#d4af37] text-white border-[#d4af37]'
                                                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-[#d4af37] text-slate-600 dark:text-slate-400'
                                                                    }`}
                                                            >
                                                                {time}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {step === 3 && (
                                            <motion.div
                                                key="step3"
                                                variants={slideVariants}
                                                custom={direction}
                                                initial="enter" animate="center" exit="exit"
                                                className="space-y-6 pb-4"
                                            >
                                                <h2 className="text-2xl font-bold font-serif mb-6 sticky top-0 bg-white dark:bg-slate-900 py-2 z-10 dark:text-white">Your Details</h2>

                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                            <input
                                                                type="tel"
                                                                name="phone"
                                                                value={formData.details.phone}
                                                                onChange={updateDetails}
                                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none"
                                                                placeholder="+91 98765 43210"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="md:col-span-2 space-y-2">
                                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                                                        <div className="relative">
                                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                            <input
                                                                type="text"
                                                                name="address"
                                                                value={formData.details.address}
                                                                onChange={updateDetails}
                                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none"
                                                                placeholder="123 Clean Street"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="md:col-span-2 space-y-2">
                                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Special Requests</label>
                                                        <textarea
                                                            name="notes"
                                                            value={formData.details.notes}
                                                            onChange={updateDetails}
                                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none h-32 resize-none"
                                                            placeholder="Instructions..."
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="p-8 pt-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 z-20">
                                    <div className="flex justify-between">
                                        <button
                                            onClick={handleBack}
                                            disabled={step === 1}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            <ArrowLeft className="w-4 h-4" /> Back
                                        </button>

                                        <button
                                            onClick={handleNext}
                                            disabled={
                                                isSaving ||
                                                (step === 1 && !formData.serviceId) ||
                                                (step === 2 && (!formData.date || !formData.time))
                                            }
                                            className="btn btn-primary bg-[#d4af37] text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-[#b5952f] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isSaving ? (
                                                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                            ) : (
                                                <>{step === 3 ? 'Confirm Booking' : 'Continue'} {step !== 3 && <ArrowRight className="w-4 h-4" />}</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Sidebar */}
                        <div className="hidden lg:block lg:col-span-1">
                            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-6 sticky top-24 transition-colors">
                                <h3 className="text-xl font-bold font-serif mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 dark:text-white">Booking Summary</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                            <Star className="w-5 h-5 text-[#d4af37]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Service</p>
                                            <p className="font-semibold text-slate-900 dark:text-slate-100">{selectedService?.title || '-'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                            <Calendar className="w-5 h-5 text-[#d4af37]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">When</p>
                                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                                                {(formData.date && formData.time) ? `${formData.date} @ ${formData.time}` : '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-slate-600 dark:text-slate-400">Total</span>
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(selectedService?.price || 0)}</span>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500 mt-4">
                                        <Shield className="w-4 h-4 text-green-600" />
                                        <span>Secure payment processing</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookService;