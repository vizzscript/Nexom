import { ROUTES } from '@/constants';
import { useAuth } from '@/features/auth';
import { useServicesData } from '@/hooks';
import { formatCurrency } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock, Leaf, Shield, Star } from 'lucide-react';
import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Define the structure needed for display in the Home component
interface HomeServicePreview {
    id: string;
    title: string;
    price: number;
    description: string;
    image: string;
    features: string[];
    isFeatured?: boolean;
}

const Home: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { services, loading } = useServicesData() as unknown as { services: HomeServicePreview[], loading: boolean };

    const previewServices = useMemo(() => {
        if (!services || services.length === 0) return [];

        const featured = services.filter(service => service.isFeatured).slice(0, 3);
        return featured.length > 0 ? featured : services.slice(0, 3);
    }, [services]);

    return (
        <div className="overflow-hidden bg-white dark:bg-[#0f172a] transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-20 bg-[#f8fafc] dark:bg-[#0f172a]">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-[55%] h-full hidden lg:block overflow-hidden">
                    <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/40" />
                    <div
                        className="absolute inset-0 opacity-[0.3] dark:opacity-[0.1]"
                        style={{
                            backgroundImage: 'radial-gradient(#64748b 2px, transparent 2px)',
                            backgroundSize: '32px 32px'
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#f8fafc] dark:to-[#0f172a]" />
                </div>
                <div className="absolute top-20 right-20 w-96 h-96 bg-[#d4af37]/10 dark:bg-[#d4af37]/5 rounded-full blur-3xl" />

                <div className="container mx-auto relative z-10 pt-12">
                    <div className="grid lg:grid-cols-2 gap-20 lg:gap-80 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-6 border border-slate-100 dark:border-slate-700">
                                <Star className="w-4 h-4 text-[#d4af37] fill-current" />
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Premium Home Care Services</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-bold font-serif text-slate-900 dark:text-white mb-6 leading-tight">
                                Experience the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#b5952f]">
                                    Art of Clean
                                </span>
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-lg leading-relaxed">
                                Transform your living space with our elite cleaning services.
                                We combine meticulous attention to detail with eco-friendly products
                                for a home that truly shines.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to={ROUTES.BOOK}
                                    onClick={(e) => {
                                        if (!isAuthenticated) {
                                            e.preventDefault();
                                            navigate(ROUTES.LOGIN);
                                        }
                                    }}
                                    className="btn btn-accent text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all"
                                >
                                    Book a Service
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link to={ROUTES.SERVICES} className="btn btn-outline dark:border-slate-700 dark:text-white text-lg px-8 py-4 rounded-full">
                                    View Services
                                </Link>
                            </div>

                            <div className="mt-12 flex items-center gap-8">
                                <div>
                                    <h4 className="text-3xl font-bold text-slate-900 dark:text-white">4.9/5</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Customer Rating</p>
                                </div>
                                <div className="w-px h-12 bg-slate-200 dark:bg-slate-700" />
                                <div>
                                    <h4 className="text-3xl font-bold text-slate-900 dark:text-white">15k+</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Homes Cleaned</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative h-[300px] sm:h-[400px] lg:h-[500px] flex items-center justify-center lg:pl-12 mt-12 lg:mt-0"
                        >
                            <div className="absolute inset-0 z-0">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] bg-[#d4af37]/10 dark:bg-[#d4af37]/5 rounded-full blur-3xl"
                                />
                            </div>

                            <div className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl border-4 sm:border-8 border-white/50 dark:border-slate-800/50 backdrop-blur-sm">
                                <img
                                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                    alt="Modern clean living room"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Orbiting Cards */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                className="absolute z-20 w-full h-full pointer-events-none"
                            >
                                {[
                                    { icon: Shield, text: "100% Verified", sub: "Trusted Pros", color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30", angle: 0 },
                                    { icon: Star, text: "4.9/5 Rated", sub: "Top Quality", color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30", angle: 72 },
                                    { icon: Leaf, text: "Eco-Friendly", sub: "Safe Products", color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30", angle: 144 },
                                    { icon: Clock, text: "Punctual", sub: "On-Time Service", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30", angle: 216 },
                                    { icon: CheckCircle, text: "Fully Insured", sub: "Peace of Mind", color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30", angle: 288 },
                                ].map((card, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute top-1/2 left-1/2 w-32 sm:w-48 -ml-16 sm:-ml-24 -mt-8 sm:-mt-10"
                                        style={{ transform: `rotate(${card.angle}deg) translate(var(--orbit-radius, 260px)) rotate(-${card.angle}deg)` }}
                                    >
                                        <style>{`
                                            @media (max-width: 640px) { :root { --orbit-radius: 140px; } }
                                            @media (min-width: 641px) { :root { --orbit-radius: 260px; } }
                                        `}</style>
                                        <motion.div
                                            animate={{ rotate: -360 }}
                                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                            className="bg-white/90 dark:bg-slate-800/90 p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg flex items-center gap-2 sm:gap-3 border border-slate-100 dark:border-slate-700 backdrop-blur-md"
                                        >
                                            <div className={`w-8 h-8 sm:w-10 sm:h-10 ${card.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                                                <card.icon className={`w-4 h-4 sm:w-5 h-5 ${card.color}`} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-bold text-slate-900 dark:text-white text-[10px] sm:text-sm leading-tight truncate">{card.text}</h4>
                                                <p className="text-[8px] sm:text-xs text-slate-500 dark:text-slate-400 leading-tight truncate">{card.sub}</p>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section-padding bg-white dark:bg-[#0f172a]">
                <div className="container mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold font-serif mb-4 text-slate-900 dark:text-white">Why Choose Nexom?</h2>
                        <p className="text-slate-600 dark:text-slate-400">
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
                                className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all"
                            >
                                <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-xl shadow-sm flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 font-serif text-slate-900 dark:text-white">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Services Preview */}
            <section className="section-padding bg-[#f8fafc] dark:bg-slate-900/30">
                <div className="container mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-bold font-serif mb-4 text-slate-900 dark:text-white">Our Featured Services</h2>
                            <p className="text-slate-600 dark:text-slate-400 max-w-xl">
                                From deep cleaning to regular maintenance, we offer a comprehensive range of services.
                            </p>
                        </div>
                        <Link to={ROUTES.SERVICES} className="hidden md:flex items-center gap-2 text-[#d4af37] font-medium hover:gap-4 transition-all">
                            View All Services <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-slate-500 dark:text-slate-400">Loading top services...</div>
                    ) : previewServices.length === 0 ? (
                        <div className="text-center py-10 text-slate-500">No services available.</div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {previewServices.map((service) => (
                                <motion.div
                                    key={service.id}
                                    className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-transparent dark:border-slate-700"
                                >
                                    <div className="relative h-64 overflow-hidden flex-shrink-0">
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold text-slate-900 dark:text-[#d4af37]">
                                            {`From ${formatCurrency(service.price)}`}
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold font-serif mb-4 h-14 line-clamp-2 text-slate-900 dark:text-white">{service.title}</h3>
                                        <div className="flex-grow">
                                            <ul className="space-y-4 mb-8">
                                                {service.features.slice(0, 3).map((feature, idx) => (
                                                    <li key={idx} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                                                        <CheckCircle className="w-5 h-5 text-[#d4af37] flex-shrink-0" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <Link
                                            to={`${ROUTES.BOOK}?serviceId=${service.id}`}
                                            onClick={(e) => {
                                                if (!isAuthenticated) {
                                                    e.preventDefault();
                                                    navigate(ROUTES.LOGIN);
                                                }
                                            }}
                                            className="w-full btn btn-outline dark:border-slate-600 dark:text-white group-hover:bg-[#d4af37] group-hover:text-white group-hover:border-[#d4af37] flex items-center justify-center mt-auto"
                                        >
                                            Book Now
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;