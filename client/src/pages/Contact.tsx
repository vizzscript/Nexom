import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import React from 'react';

const Contact: React.FC = () => {
    return (
        <div className="pt-20 min-h-screen bg-slate-50">
            {/* Header */}
            <section className="bg-slate-900 text-white py-20">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-white">Get in Touch</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        We're here to help. Reach out to us for any inquiries, bookings, or feedback.
                    </p>
                </div>
            </section>

            <section className="py-20 container mx-auto px-4">
                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-bold font-serif mb-6 text-slate-900">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center flex-shrink-0 text-[#d4af37]">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Call Us</p>
                                        <p className="font-medium text-slate-900">+1 (555) 123-4567</p>
                                        <p className="text-sm text-slate-400">Mon-Fri, 9am - 6pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center flex-shrink-0 text-[#d4af37]">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Email Us</p>
                                        <p className="font-medium text-slate-900">concierge@nexom.com</p>
                                        <p className="text-sm text-slate-400">24/7 Support</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center flex-shrink-0 text-[#d4af37]">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Visit Us</p>
                                        <p className="font-medium text-slate-900">123 Premium Boulevard</p>
                                        <p className="text-sm text-slate-400">Beverly Hills, CA 90210</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#d4af37] p-8 rounded-2xl shadow-lg text-white">
                            <h3 className="text-xl font-bold font-serif mb-4">Need Immediate Help?</h3>
                            <p className="mb-6 opacity-90">
                                Our support team is available 24/7 to assist you with any urgent cleaning needs.
                            </p>
                            <button className="w-full bg-white text-[#d4af37] font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors">
                                Chat with Support
                            </button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100"
                        >
                            <h3 className="text-2xl font-bold font-serif mb-6 text-slate-900">Send us a Message</h3>
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                                    <select className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all bg-white">
                                        <option>General Inquiry</option>
                                        <option>Service Booking</option>
                                        <option>Feedback</option>
                                        <option>Partnership</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all resize-none"
                                        placeholder="How can we help you?"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-full md:w-auto px-8 py-3 rounded-lg flex items-center justify-center gap-2"
                                >
                                    Send Message
                                    <Send className="w-4 h-4" />
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
