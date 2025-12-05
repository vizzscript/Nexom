import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock, Shield, Star } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-20 bg-[#f8fafc]">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f1f5f9] hidden lg:block" />
                <div className="absolute top-20 right-20 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl" />

                <div className="container mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6 border border-slate-100">
                                <Star className="w-4 h-4 text-[#d4af37] fill-current" />
                                <span className="text-sm font-medium text-slate-600">Premium Home Care Services</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-bold font-serif text-slate-900 mb-6 leading-tight">
                                Experience the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#b5952f]">
                                    Art of Clean
                                </span>
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                                Transform your living space with our elite cleaning services.
                                We combine meticulous attention to detail with eco-friendly products
                                for a home that truly shines.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/book" className="btn btn-primary text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all">
                                    Book a Service
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link to="/services" className="btn btn-outline text-lg px-8 py-4 rounded-full">
                                    View Services
                                </Link>
                            </div>

                            <div className="mt-12 flex items-center gap-8">
                                <div>
                                    <h4 className="text-3xl font-bold text-slate-900">4.9/5</h4>
                                    <p className="text-sm text-slate-500">Customer Rating</p>
                                </div>
                                <div className="w-px h-12 bg-slate-200" />
                                <div>
                                    <h4 className="text-3xl font-bold text-slate-900">15k+</h4>
                                    <p className="text-sm text-slate-500">Homes Cleaned</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1581578731117-104f2a412729?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                    alt="Modern clean living room"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                            {/* Floating Card */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl z-20 max-w-xs"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">100% Verified</h4>
                                        <p className="text-xs text-slate-500">Trusted Professionals</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Every cleaner undergoes a rigorous background check and training process.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section-padding bg-white">
                <div className="container mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold font-serif mb-4">Why Choose Nexom?</h2>
                        <p className="text-slate-600">
                            We don't just clean; we care for your home. Experience the difference of a premium service designed around you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Star className="w-8 h-8 text-[#d4af37]" />,
                                title: "Premium Quality",
                                description: "Top-tier cleaning standards with rigorous quality checks."
                            },
                            {
                                icon: <Clock className="w-8 h-8 text-[#d4af37]" />,
                                title: "On-Time Service",
                                description: "Punctual professionals who respect your time and schedule."
                            },
                            {
                                icon: <Shield className="w-8 h-8 text-[#d4af37]" />,
                                title: "Safe & Secure",
                                description: "Fully insured services and background-checked staff."
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -10 }}
                                className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all"
                            >
                                <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 font-serif">{feature.title}</h3>
                                <p className="text-slate-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Preview */}
            <section className="section-padding bg-[#f8fafc]">
                <div className="container mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-bold font-serif mb-4">Our Services</h2>
                            <p className="text-slate-600 max-w-xl">
                                From deep cleaning to regular maintenance, we offer a comprehensive range of services.
                            </p>
                        </div>
                        <Link to="/services" className="hidden md:flex items-center gap-2 text-[#d4af37] font-medium hover:gap-4 transition-all">
                            View All Services <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Deep Cleaning",
                                price: "From $199",
                                image: "https://images.unsplash.com/photo-1527512860163-49091831a320?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                                features: ["Deep dusting & sanitization", "Carpet & upholstery care", "Window cleaning"]
                            },
                            {
                                title: "Regular Maintenance",
                                price: "From $89",
                                image: "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                                features: ["Weekly/Bi-weekly visits", "Surface cleaning", "Bathroom & kitchen sanitization"]
                            },
                            {
                                title: "Move-in/Move-out",
                                price: "From $299",
                                image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                                features: ["Complete empty home clean", "Inside cabinets & appliances", "Wall washing"]
                            }
                        ].map((service, index) => (
                            <div key={index} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold text-slate-900">
                                        {service.price}
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold font-serif mb-4">{service.title}</h3>
                                    <ul className="space-y-3 mb-8">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-slate-600">
                                                <CheckCircle className="w-5 h-5 text-[#d4af37]" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="w-full btn btn-outline group-hover:bg-[#d4af37] group-hover:text-white group-hover:border-[#d4af37]">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
