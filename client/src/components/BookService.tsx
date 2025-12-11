import { AnimatePresence, motion } from 'framer-motion';
// Ensure all necessary icons and types are imported
import { ArrowLeft, ArrowRight, Calendar, Check, CheckCircle, Clock, Home, MapPin, Shield, Star, User, type LucideIcon } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useServicesData } from '../services/useServicesData'; // Import the dynamic data hook

// ====================================================================
// INTERFACES (Assuming these are the fields returned by your hook)
// ====================================================================

// Define the shape of the raw service data returned by useServicesData
interface FetchedService {
    id: string;
    title: string;
    price: number;
    description: string;
    // Assume other fields like category, features, etc., are also present
}

// Define the structure needed for display in the BookService component
interface AugmentedService extends FetchedService {
    duration: string;
    icon: LucideIcon; // Type imported from 'lucide-react'
}

// Types for form data
interface BookingData {
    serviceId: string | null;
    date: string | null;
    time: string | null;
    details: {
        name: string;
        email: string;
        address: string;
        notes: string;
    };
}

// ====================================================================
// HELPER LOGIC FOR AUGMENTATION
// ====================================================================

// Helper function to parse query parameters
const useQuery = () => {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
};

// TODO: In future will make this dynamic
const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const augmentServices = (services: FetchedService[]): AugmentedService[] => {
    if (!services || services.length === 0) return [];

    return services.map(service => {
        let iconComponent: LucideIcon = Home; // Default icon
        let durationString: string = '2-3 Hours'; // Default duration

        // Logic to assign icon and duration based on service title
        const titleLower = service.title.toLowerCase();

        if (titleLower.includes('deep')) {
            iconComponent = Star;
            durationString = '4-5 Hours';
        } else if (titleLower.includes('maintenance') || titleLower.includes('regular')) {
            iconComponent = Clock;
            durationString = '2-3 Hours';
        } else if (titleLower.includes('move-in') || titleLower.includes('move-out')) {
            iconComponent = MapPin;
            durationString = '6+ Hours';
        } else if (titleLower.includes('renovation') || titleLower.includes('post-reno')) {
            iconComponent = Shield;
            durationString = '8+ Hours';
        } else if (titleLower.includes('office')) {
            iconComponent = Check;
            durationString = '3-4 Hours';
        }

        return {
            ...service,
            icon: iconComponent,
            duration: durationString,
        } as AugmentedService;
    });
};

// ====================================================================
// COMPONENT
// ====================================================================

const BookService: React.FC = () => {
    // 0. Get URL query parameters
    const query = useQuery();
    const initialServiceId = query.get('serviceId');

    // 1. Fetch data dynamically
    const { services, loading } = useServicesData();

    // 2. Augment data using useMemo for performance
    const augmentedServices = useMemo(() => augmentServices(services as FetchedService[]), [services]);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<BookingData>({
        // Initialize with serviceId from URL if present
        serviceId: initialServiceId || null,
        date: null,
        time: null,
        details: { name: '', email: '', address: '', notes: '' }
    });

    // Effect to handle initial service selection and step advance
    useEffect(() => {
        // Only run if data is loaded and we have an initial ID to process
        if (augmentedServices.length > 0 && initialServiceId && formData.serviceId === initialServiceId && step === 1) {
            const serviceExists = augmentedServices.some(s => s.id === initialServiceId);

            if (serviceExists) {
                // Skip Step 1 and move to Step 2 for scheduling
                setStep(2);

                // >>> FIX 1: Ensure page scrolls to top when skipping step 1 <<<
                window.scrollTo(0, 0);

            } else {
                // If ID is invalid, clear it and let the user choose
                setFormData(prev => ({ ...prev, serviceId: null }));
                console.error("URL serviceId not found in data.");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [augmentedServices, initialServiceId]); // Run when data loads or initial ID changes

    const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

    const updateDetails = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            details: { ...formData.details, [e.target.name]: e.target.value }
        });
    };

    // 3. Use augmented data for lookups
    const selectedService = augmentedServices.find(s => s.id === formData.serviceId);

    const slideVariants = {
        enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 })
    };

    // Helper for navigation direction (needed for framer-motion exit animation)
    const direction = useMemo(() => (step > 1 ? 1 : -1), [step]);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-[#f8fafc]">
                <p className="text-xl text-slate-700">Loading services for booking...</p>
            </div>
        );
    }

    if (augmentedServices.length === 0) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-[#f8fafc]">
                <p className="text-xl text-slate-700">No services available to book at this time.</p>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12 relative overflow-hidden">
            {/* Custom Scrollbar Styles (kept for context) */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d4af37;
                }
            `}</style>

            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[55%] h-full hidden lg:block overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-slate-50/50" />
                <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: 'radial-gradient(#64748b 2px, transparent 2px)', backgroundSize: '32px 32px' }} />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#f8fafc]" />
            </div>
            <div className="absolute top-20 left-10 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 mb-4">
                            Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#b5952f]">Experience</span>
                        </h1>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 items-start">

                        {/* MAIN WIZARD CARD */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col h-[650px] relative overflow-hidden">

                                {/* 1. FIXED HEADER: Progress Steps */}
                                <div className="p-8 pb-4 shrink-0 bg-white z-10">
                                    <div className="flex items-center justify-between relative max-w-lg mx-auto">
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10" />
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#d4af37] transition-all duration-500"
                                            style={{ width: `${((step - 1) / 2) * 100}%` }} />

                                        {[1, 2, 3].map((num) => (
                                            <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 bg-white ${step >= num ? 'text-[#d4af37] border-2 border-[#d4af37] shadow-sm scale-110' : 'text-slate-400 border-2 border-slate-200'
                                                }`}>
                                                {step > num ? <Check className="w-5 h-5 fill-current" /> : num}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. SCROLLABLE BODY: The Content */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-2">
                                    <AnimatePresence mode='wait' custom={direction}>

                                        {/* Step 1: Services */}
                                        {step === 1 && (
                                            <motion.div
                                                key="step1"
                                                variants={slideVariants}
                                                custom={direction}
                                                initial="enter" animate="center" exit="exit"
                                                className="space-y-4 pb-4"
                                            >
                                                {/* Display pre-selection message if the service ID came from the URL */}
                                                {selectedService && initialServiceId && formData.serviceId === initialServiceId ? (
                                                    <div className="p-6 rounded-2xl border-2 border-green-200 bg-green-50/50 mb-6">
                                                        <h3 className="text-xl font-bold font-serif text-green-700 flex items-center gap-2 mb-2">
                                                            <CheckCircle className="w-6 h-6" /> Service Selected
                                                        </h3>
                                                        <p className="text-slate-700">You are booking: <span className="font-semibold">{selectedService.title}</span>. Click 'Continue' below to schedule.</p>
                                                        <button
                                                            onClick={() => setFormData({ ...formData, serviceId: null })}
                                                            className="mt-3 text-sm text-slate-500 hover:text-red-500 underline"
                                                        >
                                                            Change Service
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <h2 className="text-2xl font-bold font-serif mb-6 text-slate-800 sticky top-0 bg-white py-2 z-10">Select a Service</h2>
                                                )}

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {augmentedServices.map((service) => ( // 4. Use augmentedServices
                                                        <div
                                                            key={service.id}
                                                            onClick={() => setFormData({ ...formData, serviceId: service.id })}
                                                            className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-md ${formData.serviceId === service.id
                                                                ? 'border-[#d4af37] bg-[#d4af37]/5'
                                                                : 'border-slate-100 hover:border-[#d4af37]/50'
                                                                }`}
                                                        >
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${formData.serviceId === service.id ? 'bg-[#d4af37] text-white' : 'bg-slate-100 text-slate-600'
                                                                    }`}>
                                                                    <service.icon className="w-6 h-6" />
                                                                </div>
                                                                <span className="text-lg font-bold text-slate-900">${service.price}</span>
                                                            </div>
                                                            <h3 className="text-xl font-bold font-serif mb-2">{service.title}</h3>
                                                            <p className="text-sm text-slate-600 mb-2">{service.description}</p>
                                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                                <Clock className="w-3 h-3" /> {service.duration}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Step 2: Date & Time */}
                                        {step === 2 && (
                                            <motion.div
                                                key="step2"
                                                variants={slideVariants}
                                                custom={direction}
                                                initial="enter" animate="center" exit="exit"
                                                className="space-y-8 pb-4"
                                            >
                                                <h2 className="text-2xl font-bold font-serif mb-2 sticky top-0 bg-white py-2 z-10">Schedule Visit</h2>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-3">Select Date</label>
                                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                                        {[...Array(14)].map((_, i) => { // Increased range to show scrolling
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
                                                                        : 'bg-white border-slate-200 hover:border-[#d4af37] text-slate-600'
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
                                                    <label className="block text-sm font-medium text-slate-700 mb-3">Select Time</label>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                        {timeSlots.map((time) => (
                                                            <button
                                                                key={time}
                                                                onClick={() => setFormData({ ...formData, time })}
                                                                className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all ${formData.time === time
                                                                    ? 'bg-[#d4af37] text-white border-[#d4af37]'
                                                                    : 'bg-white border-slate-200 hover:border-[#d4af37] text-slate-600'
                                                                    }`}
                                                            >
                                                                {time}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Step 3: Details */}
                                        {step === 3 && (
                                            <motion.div
                                                key="step3"
                                                variants={slideVariants}
                                                custom={direction}
                                                initial="enter" animate="center" exit="exit"
                                                className="space-y-6 pb-4"
                                            >
                                                <h2 className="text-2xl font-bold font-serif mb-6 sticky top-0 bg-white py-2 z-10">Your Details</h2>

                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                value={formData.details.name}
                                                                onChange={updateDetails}
                                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none"
                                                                placeholder="John Doe"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-slate-700">Email</label>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                value={formData.details.email}
                                                                onChange={updateDetails}
                                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none"
                                                                placeholder="john@example.com"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="md:col-span-2 space-y-2">
                                                        <label className="text-sm font-medium text-slate-700">Address</label>
                                                        <div className="relative">
                                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                            <input
                                                                type="text"
                                                                name="address"
                                                                value={formData.details.address}
                                                                onChange={updateDetails}
                                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none"
                                                                placeholder="123 Clean Street"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="md:col-span-2 space-y-2">
                                                        <label className="text-sm font-medium text-slate-700">Special Requests</label>
                                                        <textarea
                                                            name="notes"
                                                            value={formData.details.notes}
                                                            onChange={updateDetails}
                                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none h-32 resize-none"
                                                            placeholder="Instructions..."
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* 3. FIXED FOOTER: Navigation Buttons */}
                                <div className="p-8 pt-4 border-t border-slate-100 bg-white shrink-0 z-20">
                                    <div className="flex justify-between">
                                        <button
                                            onClick={handleBack}
                                            disabled={step === 1}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            <ArrowLeft className="w-4 h-4" /> Back
                                        </button>

                                        <button
                                            onClick={handleNext}
                                            disabled={
                                                (step === 1 && !formData.serviceId) ||
                                                (step === 2 && (!formData.date || !formData.time))
                                            }
                                            className="btn btn-primary bg-[#d4af37] text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-[#b5952f] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {step === 3 ? 'Confirm Booking' : 'Continue'}
                                            {step !== 3 && <ArrowRight className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Sidebar - Sticky */}
                        <div className="hidden lg:block lg:col-span-1">
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sticky top-24">
                                <h3 className="text-xl font-bold font-serif mb-6 pb-4 border-b border-slate-100">Booking Summary</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                            <Star className="w-5 h-5 text-[#d4af37]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Service</p>
                                            <p className="font-semibold text-slate-900">{selectedService?.title || '-'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                            <Calendar className="w-5 h-5 text-[#d4af37]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">When</p>
                                            {/* >>> FIX 2: Conditionally render date and time to avoid "date @ null" <<< */}
                                            <p className="font-semibold text-slate-900">
                                                {(formData.date && formData.time) ? `${formData.date} @ ${formData.time}` : '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-slate-600">Total</span>
                                        <span className="text-2xl font-bold text-slate-900">${selectedService?.price || 0}</span>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-2 text-xs text-slate-500 mt-4">
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