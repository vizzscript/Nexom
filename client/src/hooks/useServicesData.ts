import type { BackendCategory, BackendService, FrontendCategory, FrontendService } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react';

/**
 * Custom hook to fetch and manage services and categories data
 */

const getAuthHeaders = () => {
    return {
        withCredentials: true,
    };
};

export const useServicesData = () => {
    const API_URL = import.meta.env.VITE_SERVICE_CATALOG_URL || 'http://localhost:8082/api/v1';

    const [categories, setCategories] = useState<FrontendCategory[]>([]);
    const [services, setServices] = useState<FrontendService[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_URL}/categories`, getAuthHeaders());
                const mappedCategories: FrontendCategory[] = response.data.data.map((cat: BackendCategory) => ({
                    id: cat.name,
                    name: cat.name,
                    objectId: cat._id,
                }));

                const allCategoryIndex = mappedCategories.findIndex(c => c.name === 'All Services');
                if (allCategoryIndex > -1) {
                    mappedCategories[allCategoryIndex].id = 'All Services';
                    const allCat = mappedCategories.splice(allCategoryIndex, 1)[0];
                    mappedCategories.unshift(allCat);
                } else {
                    mappedCategories.unshift({ id: 'All Services', name: 'All Services', objectId: 'TEMP_ALL_ID' });
                }

                setCategories(mappedCategories);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        const fetchServices = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/services`, getAuthHeaders());
                const mappedServices: FrontendService[] = response.data.data.map((srv: BackendService) => ({
                    id: srv._id,
                    title: srv.title,
                    description: srv.description,
                    category: srv.category,
                    rating: srv.rating,
                    reviews: srv.reviews,
                    price: srv.price,
                    image: srv.imageUrl,
                    features: srv.features,
                    isFeatured: srv.isFeatured,
                }));

                setServices(mappedServices);
                setError(null);
            } catch (err) {
                setError('Failed to fetch services');
                console.error("Error fetching services:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
        fetchServices();
    }, [API_URL]);

    return { categories, services, loading, error };
};
