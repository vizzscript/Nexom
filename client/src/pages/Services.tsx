import { motion } from 'framer-motion';
import { ArrowRight, Check, Search, Star } from 'lucide-react';
import React, { useState } from 'react';

const Services: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', name: 'All Services' },
        { id: 'cleaning', name: 'Cleaning' },
        { id: 'maintenance', name: 'Maintenance' },
        { id: 'specialized', name: 'Specialized' },
    ];

    const services = [
        {
            id: 1,
            title: "Deep House Cleaning",
            category: "cleaning",
            rating: 4.9,
            reviews: 128,
            price: 199,
            image: "https://images.unsplash.com/photo-1581578731117-104f2a412729?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "A comprehensive top-to-bottom cleaning service perfect for spring cleaning or moving in/out.",
            features: ["All rooms & surfaces", "Inside cabinets & appliances", "Window cleaning (interior)"]
        },
        {
            id: 2,
            title: "Regular Maintenance",
            category: "maintenance",
            rating: 4.8,
            reviews: 85,
            price: 89,
            image: "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Keep your home sparkling with our weekly or bi-weekly maintenance cleaning service.",
            features: ["Dusting & vacuuming", "Kitchen & bathroom sanitization", "Bed making & tidying"]
        },
        {
            id: 3,
            title: "Carpet & Upholstery",
            category: "specialized",
            rating: 4.9,
            reviews: 64,
            price: 149,
            image: "https://images.unsplash.com/photo-1558317374-a354d5f6d40b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Revitalize your carpets and furniture with our deep steam cleaning technology.",
            features: ["Stain removal", "Odor elimination", "Fabric protection"]
        },
        {
            id: 4,
            title: "Window Cleaning",
            category: "cleaning",
            rating: 4.7,
            reviews: 42,
            price: 129,
            image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Crystal clear views with our professional interior and exterior window cleaning.",
            features: ["Streak-free finish", "Screen cleaning", "Track & sill cleaning"]
        },
        {
            id: 5,
            title: "Post-Construction",
            category: "specialized",
            rating: 5.0,
            reviews: 29,
            price: 299,
            image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Remove dust and debris after renovation with our specialized post-construction clean.",
            features: ["Fine dust removal", "Paint spot removal", "Deep sanitization"]
        },
        {
            id: 6,
            title: "Green Cleaning",
            category: "cleaning",
            rating: 4.8,
            reviews: 56,
            price: 119,
            image: "https://images.unsplash.com/photo-1527512860163-49091831a320?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Eco-friendly cleaning using only non-toxic, biodegradable products safe for pets and kids.",
            features: ["100% non-toxic products", "Allergen reduction", "Safe for sensitive groups"]
        }
    ];

    const filteredServices = selectedCategory === 'all'
        ? services
        : services.filter(service => service.category === selectedCategory);

    return (
        <div className="pt-20 min-h-screen bg-slate-50">
            {/* Header */}
            <section className="bg-slate-900 text-white py-20">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">Our Services</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Choose from our wide range of premium cleaning solutions designed to meet your specific needs.
                    </p>
                </div>
            </section>

            {/* Filters & Search */}
            <section className="py-8 border-b bg-white sticky top-20 z-40 shadow-sm">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category.id
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search services..."
                            className="pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:border-[#d4af37] w-full md:w-64"
                        />
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-16 container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredServices.map((service) => (
                        <motion.div
                            key={service.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-slate-900 flex items-center gap-1">
                                    <Star className="w-3 h-3 text-[#d4af37] fill-current" />
                                    {service.rating}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold font-serif text-slate-900">{service.title}</h3>
                                    <span className="text-lg font-bold text-[#d4af37]">${service.price}</span>
                                </div>

                                <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                                    {service.description}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {service.features.slice(0, 2).map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-500">
                                            <Check className="w-4 h-4 text-green-500" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button className="w-full btn btn-outline group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 flex justify-between items-center">
                                    View Details
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Services;
