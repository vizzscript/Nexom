// Services.tsx
import { motion } from 'framer-motion';
import { ArrowRight, Check, Search, Star } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useServicesData } from '../services/useServicesData'; // Import the new hook

// NOTE: All Interfaces (BackendCategory, ServiceCategory, etc.) should be removed from here
// and are now housed only in useServicesData.ts

const Services: React.FC = () => {
    // State now holds the human-readable name string for filter selection
    const [selectedCategory, setSelectedCategory] = useState('All Services');

    // Use the custom hook to fetch data
    const { categories, services, loading } = useServicesData();

    const [searchQuery, setSearchQuery] = useState('');

    // 3. Use useMemo for Filtering and Searching
    const filteredServices = useMemo(() => {
        let result = services;

        // 1. Category Filtering - Use the Category Name and then lookup the MongoDB _id
        if (selectedCategory !== 'All Services') {

            // Find the selected category object to get its MongoDB _id (objectId)
            const selectedCategoryObject = categories.find(cat => cat.name === selectedCategory);

            if (selectedCategoryObject) {
                const selectedCategoryId = selectedCategoryObject.objectId;

                // Filter the services by comparing the service's category._id 
                // with the selected category's actual MongoDB _id.
                result = result.filter(service => service.category._id === selectedCategoryId);
            } else {
                // Should not happen, but safe fallback if category is selected but not found
                result = [];
            }
        }

        // 2. Search Query Filtering
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            result = result.filter(service =>
                service.title.toLowerCase().includes(lowerCaseQuery) ||
                service.description.toLowerCase().includes(lowerCaseQuery) ||
                service.category.name.toLowerCase().includes(lowerCaseQuery) ||
                service.features.some(f => f.toLowerCase().includes(lowerCaseQuery))
            );
        }

        return result;
    }, [services, selectedCategory, searchQuery, categories]);


    if (loading) {
        return <div className="pt-20 min-h-screen flex items-center justify-center">Loading Services...</div>;
    }


    // --- Component JSX ---
    return (
        <div className="pt-20 min-h-screen bg-slate-50 pb-4">
            {/* Header */}
            <section className="bg-slate-900 text-white py-20">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-white">Our Services</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Choose from our wide range of premium cleaning solutions designed to meet your specific needs.
                    </p>
                </div>
            </section>

            {/* Filters & Search */}
            <section className="py-8 border-b bg-white sticky top-20 z-40 shadow-sm mb-4">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                        {/* Use fetched categories */}
                        {categories.map(category => (
                            <button
                                // key is the unique ID (e.g., 'Cleaning', 'Maintenance')
                                key={category.id}
                                // Set the state to the category name string
                                onClick={() => setSelectedCategory(category.name)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category.name
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:border-[#d4af37] w-full md:w-64"
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
                            // FIX 1: Add flex, flex-col, and h-full to the card wrapper
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100 flex flex-col h-full"
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

                            {/* FIX 2: Add flex-grow to the content area below the image */}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold font-serif text-slate-900">{service.title}</h3>
                                    <span className="text-lg font-bold text-[#d4af37]">${service.price}</span>
                                </div>

                                {/* Description and Features (This section must grow) */}
                                <div className="flex-grow">
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
                                </div>

                                {/* Action Button (Will now be pushed to the bottom of the content box) */}
                                <button className="w-full btn btn-outline group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 flex justify-between items-center mt-auto">
                                    View Details
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    {filteredServices.length === 0 && (
                        <p className="md:col-span-3 text-center text-slate-500">
                            No services found matching your criteria.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Services;