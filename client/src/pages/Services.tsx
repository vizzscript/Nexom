import { ROUTES } from '@/constants';
import { useServicesData } from '@/hooks';
import type { FrontendCategory, FrontendService } from '@/types';
import { formatCurrency } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Search, Star, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


// ====================================================================
// Interfaces (Using imported types and augmenting for the modal)
// ====================================================================

interface ModalServiceData extends FrontendService {
    duration?: string;
}


// ====================================================================
// Modal Component
// ====================================================================

interface ServiceDetailModalProps {
    service: ModalServiceData | null;
    onClose: () => void;
}

const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ service, onClose }) => {
    const navigate = useNavigate();

    if (!service) return null;

    const handleBookNow = () => {
        navigate(`${ROUTES.BOOK}?serviceId=${service.id}`);
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -50, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative border border-transparent dark:border-slate-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Close modal"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Modal Content - Image Section */}
                <div className="relative h-64 sm:h-80 overflow-hidden">
                    <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <h2 className="absolute bottom-4 left-6 text-3xl font-bold font-serif text-white">
                        {service.title}
                    </h2>
                </div>

                {/* Modal Content - Details Section */}
                <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
                    <div className="flex justify-between items-end pb-4 border-b border-slate-100 dark:border-slate-700 mb-6">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{service.category.name}</span>
                        <span className="text-3xl font-extrabold text-[#d4af37]">{formatCurrency(service.price)}</span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                        {service.description}
                    </p>

                    <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Key Features:</h3>
                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                        {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                            Estimated Duration:
                        </div>
                        <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {service.duration || 'Approx. 2-4 Hours'}
                        </div>
                    </div>
                </div>

                {/* Modal Footer - Action Button */}
                <div className="p-6 pt-4 border-t border-slate-100 dark:border-slate-700 shrink-0">
                    <button
                        onClick={handleBookNow}
                        className="w-full btn btn-primary text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                        Book Now - {formatCurrency(service.price)}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};


// ====================================================================
// Main Services Component
// ====================================================================

const Services: React.FC = () => {
    const location = useLocation();
    const [selectedCategory, setSelectedCategory] = useState(
        location.state?.selectedCategory || 'All Services'
    );

    const { categories, services, loading } = useServicesData();
    const [searchQuery, setSearchQuery] = useState('');
    const [modalServiceId, setModalServiceId] = useState<string | null>(null);

    useEffect(() => {
        if (location.state?.selectedCategory) {
            setSelectedCategory(location.state.selectedCategory);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location.state]);

    useEffect(() => {
        if (modalServiceId) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [modalServiceId]);


    const filteredServices = useMemo(() => {
        let result = services;

        if (selectedCategory !== 'All Services') {
            const selectedCategoryObject = categories.find((cat: FrontendCategory) => cat.name === selectedCategory);
            if (selectedCategoryObject) {
                const selectedCategoryId = selectedCategoryObject.objectId;
                result = result.filter((service: FrontendService) => service.category._id === selectedCategoryId);
            } else {
                result = [];
            }
        }

        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            result = result.filter((service: FrontendService) =>
                service.title.toLowerCase().includes(lowerCaseQuery) ||
                service.description.toLowerCase().includes(lowerCaseQuery) ||
                service.category.name.toLowerCase().includes(lowerCaseQuery) ||
                service.features.some(f => f.toLowerCase().includes(lowerCaseQuery))
            );
        }

        return result;
    }, [services, selectedCategory, searchQuery, categories]);

    const serviceInModal = useMemo(() => {
        return services.find((s: FrontendService) => s.id === modalServiceId) || null;
    }, [services, modalServiceId]);


    if (loading) {
        return <div className="pt-20 min-h-screen flex items-center justify-center dark:bg-slate-900 dark:text-slate-100">Loading Services...</div>;
    }


    return (
        <div className="pt-20 min-h-screen bg-slate-50 dark:bg-slate-900 pb-4">
            {/* Header */}
            <section className="bg-slate-900 dark:bg-slate-950 text-white py-20">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-white">Our Services</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Choose from our wide range of premium cleaning solutions designed to meet your specific needs.
                    </p>
                </div>
            </section>

            {/* Filters & Search */}
            <section className="py-8 border-b dark:border-slate-800 bg-white dark:bg-slate-800 sticky top-20 z-40 shadow-sm mb-4">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                        {categories.map((category: FrontendCategory) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.name)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category.name
                                    ? 'bg-slate-900 text-white dark:bg-[#d4af37] dark:text-slate-900'
                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-transparent dark:text-slate-100 focus:outline-none focus:border-[#d4af37] w-full md:w-64 transition-colors"
                        />
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredServices.map((service) => (
                        <motion.div
                            key={service.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100 dark:border-slate-700 flex flex-col h-full"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                                    <Star className="w-3 h-3 text-[#d4af37] fill-current" />
                                    {service.rating}
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">{service.title}</h3>
                                    <span className="text-lg font-bold text-[#d4af37]">{formatCurrency(service.price)}</span>
                                </div>

                                <div className="flex-grow">
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">
                                        {service.description}
                                    </p>

                                    <ul className="space-y-2 mb-6">
                                        {service.features.slice(0, 2).map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                <Check className="w-4 h-4 text-green-500" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    onClick={() => setModalServiceId(service.id)}
                                    className="w-full btn btn-outline dark:border-slate-600 dark:text-slate-300 group-hover:bg-slate-900 dark:group-hover:bg-[#d4af37] group-hover:text-white dark:group-hover:text-slate-900 group-hover:border-slate-900 dark:group-hover:border-[#d4af37] flex justify-between items-center mt-auto"
                                >
                                    View Details
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    {filteredServices.length === 0 && (
                        <p className="md:col-span-3 text-center text-slate-500 dark:text-slate-400 py-10">
                            No services found matching your criteria.
                        </p>
                    )}
                </div>
            </section>

            <AnimatePresence>
                {modalServiceId && (
                    <ServiceDetailModal
                        service={serviceInModal as ModalServiceData}
                        onClose={() => setModalServiceId(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Services;