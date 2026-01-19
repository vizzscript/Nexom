import { ROUTES } from '@/constants';
import { useAuth } from '@/features/auth';
import { contactService } from '@/features/contact';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    BellRing,
    ChevronDown,
    Mail,
    MapPin,
    Phone,
    Send,
    ShieldCheck,
    X
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Contact: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const subjects = [
        'General Inquiry',
        'Service Booking',
        'Feedback',
        'Partnership'
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsSelectOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN);
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                userId: user?.uid || null
            };

            const response = await contactService.submitContactForm(payload);

            if (response.status === 200 && response.notification) {
                const { title, body, referenceId } = response.notification;

                toast.custom((t) => (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-[#0f172a] dark:bg-slate-900 shadow-2xl rounded-[1.5rem] pointer-events-auto flex flex-col overflow-hidden border border-white/10 ring-1 ring-[#d4af37]/20`}
                    >
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-[#d4af37]">
                                    <BellRing className="w-6 h-6 animate-pulse" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-base font-bold text-white">{title}</p>
                                        <button
                                            onClick={() => toast.dismiss(t.id)}
                                            className="text-slate-400 hover:text-white transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-400 leading-relaxed">{body}</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-[#d4af37]" />
                                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Case ID: {referenceId.slice(-8).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 p-4 border-t border-white/5 flex items-center justify-between">
                            <Link
                                to={ROUTES.NOTIFICATIONS}
                                onClick={() => toast.dismiss(t.id)}
                                className="text-xs font-bold text-[#d4af37] hover:text-[#b3922d] flex items-center gap-1.5 transition-colors group"
                            >
                                View in Activity Center
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <span className="text-[10px] text-slate-500 italic">24/7 Support Active</span>
                        </div>
                    </motion.div>
                ), { duration: 8000 });

                setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
            }
        } catch (error: any) {
            // Error handled by global interceptor
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChat = () => {
        const whatsappLink = import.meta.env.VITE_WHATSAPP_LINK;
        if (whatsappLink) {
            window.open(whatsappLink, '_blank');
        }
    };

    return (
        <div className="pt-20 min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
            {/* Header */}
            <section className="bg-slate-900 dark:bg-slate-950 text-white py-20 mb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#d4af37]/5 skew-x-12 translate-x-20" />
                <div className="container mx-auto text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold font-serif mb-6"
                    >
                        Get in Touch
                    </motion.h1>
                    <p className="text-slate-400 dark:text-slate-500 max-w-2xl mx-auto text-lg">
                        We're here to help. Reach out to us for any inquiries, bookings, or feedback.
                    </p>
                </div>
            </section>

            <section className="py-10 container mx-auto px-4 mb-20">
                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <h3 className="text-xl font-bold font-serif mb-6 text-slate-900 dark:text-white">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 text-[#d4af37]">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Call Us</p>
                                        <p className="font-medium text-slate-900 dark:text-slate-200">+91 9503904221</p>
                                        <p className="text-sm text-slate-400 dark:text-slate-500">Mon-Fri, 9am - 6pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 text-[#d4af37]">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Email Us</p>
                                        <p className="font-medium text-slate-900 dark:text-slate-200">script.vizz@gmail.com</p>
                                        <p className="text-sm text-slate-400 dark:text-slate-500">24/7 Support</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 text-[#d4af37]">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Visit Us</p>
                                        <p className="font-medium text-slate-900 dark:text-slate-200">Nagpur, Maharastra 440001</p>
                                        <p className="text-sm text-slate-400 dark:text-slate-500">India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#d4af37] p-8 rounded-2xl shadow-lg text-white group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                            <h3 className="text-xl font-bold font-serif mb-4 relative z-10">Need Immediate Help?</h3>
                            <p className="mb-6 opacity-90 relative z-10">
                                Our support team is available 24/7 to assist you with any urgent cleaning needs.
                            </p>
                            <button
                                onClick={handleChat}
                                className="w-full bg-white text-[#d4af37] font-bold py-3 rounded-lg hover:bg-slate-50 transition-all relative z-10 active:scale-95"
                            >
                                Chat with Support
                            </button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
                        >
                            <h3 className="text-2xl font-bold font-serif mb-6 text-slate-900 dark:text-white">Send us a Message</h3>

                            <form onSubmit={handleSendMessage} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="+91-958323932"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                                    <div className="relative" ref={selectRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsSelectOpen(!isSelectOpen)}
                                            className={`w-full px-4 py-3.5 rounded-xl border flex items-center justify-between text-left font-medium transition-all duration-200 ${isSelectOpen
                                                ? 'border-[#d4af37] ring-4 ring-[#d4af37]/10 bg-white dark:bg-slate-900 shadow-lg'
                                                : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-[#d4af37]/50 shadow-sm'
                                                }`}
                                        >
                                            <span className={formData.subject ? 'text-slate-900 dark:text-white' : 'text-slate-400'}>
                                                {formData.subject || 'Select a subject'}
                                            </span>
                                            <ChevronDown
                                                size={20}
                                                className={`text-slate-400 transition-transform duration-300 ${isSelectOpen ? 'rotate-180 text-[#d4af37]' : ''}`}
                                            />
                                        </button>

                                        <AnimatePresence>
                                            {isSelectOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                                    className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 p-2 overflow-hidden ring-1 ring-[#d4af37]/20"
                                                >
                                                    {subjects.map((subject) => (
                                                        <button
                                                            key={subject}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData({ ...formData, subject });
                                                                setIsSelectOpen(false);
                                                            }}
                                                            className={`w-full px-4 py-3 rounded-xl text-left text-sm transition-all flex items-center justify-between group ${formData.subject === subject
                                                                ? 'bg-[#d4af37]/10 text-[#d4af37] font-bold'
                                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 dark:hover:text-white'
                                                                }`}
                                                        >
                                                            {subject}
                                                            {formData.subject === subject && (
                                                                <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[0_0_10px_#d4af37]" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/10 outline-none transition-all resize-none placeholder:text-slate-400"
                                        placeholder="How can we help you?"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn btn-primary w-full md:w-auto px-8 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70 dark:bg-[#d4af37] dark:hover:bg-[#b3922d] dark:text-white"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                    {!isSubmitting && <Send className="w-4 h-4" />}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;