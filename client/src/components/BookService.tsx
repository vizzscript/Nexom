import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, Check, Clock, Home, MapPin, Shield, Star, User } from 'lucide-react';
import React, { useState } from 'react';

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

// Added more services to demonstrate scrolling capabilities
const services = [
    { id: 'deep-clean', title: 'Deep Cleaning', price: 199, duration: '4-5 Hours', description: 'Intensive cleaning for every corner.', icon: Star },
    { id: 'maintenance', title: 'Regular Maintenance', price: 89, duration: '2-3 Hours', description: 'Standard weekly or bi-weekly clean.', icon: Home },
    { id: 'move-in', title: 'Move-in/Move-out', price: 299, duration: '6+ Hours', description: 'Empty home restoration cleaning.', icon: Shield },
    { id: 'post-reno', title: 'Post-Renovation', price: 349, duration: '8+ Hours', description: 'Dust removal after construction.', icon: Home },
    { id: 'office', title: 'Office Cleaning', price: 159, duration: '3-4 Hours', description: 'Professional workspace cleaning.', icon: Check },
];

const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const BookService: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<BookingData>({
        serviceId: null,
        date: null,
        time: null,
        details: { name: '', email: '', address: '', notes: '' }
    });

    const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

    const updateDetails = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            details: { ...formData.details, [e.target.name]: e.target.value }
        });
    };

    const selectedService = services.find(s => s.id === formData.serviceId);

    const slideVariants = {
        enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 })
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12 relative overflow-hidden">
            {/* Custom Scrollbar Styles */}
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
                            {/* Fixed Height Container: 
                                We use h-[650px] to ensure the card stays a consistent size.
                                Flex-col allows us to separate header, body (scrollable), and footer.
                            */}
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
                                    <AnimatePresence mode='wait' custom={step}>

                                        {/* Step 1: Services */}
                                        {step === 1 && (
                                            <motion.div
                                                key="step1"
                                                variants={slideVariants}
                                                initial="enter" animate="center" exit="exit"
                                                className="space-y-4 pb-4"
                                            >
                                                <h2 className="text-2xl font-bold font-serif mb-6 text-slate-800 sticky top-0 bg-white py-2 z-10">Select a Service</h2>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {services.map((service) => (
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
                                            <p className="font-semibold text-slate-900">
                                                {formData.date ? `${formData.date} @ ${formData.time}` : '-'}
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