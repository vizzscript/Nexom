// useServicesData.ts (New File)
import axios from 'axios';
import { useEffect, useState } from 'react';

// Define the shape of the populated category in the service object
export interface ServiceCategory {
    _id: string;
    name: string;
}

// Define the shape of the data fetched from backend
interface BackendCategory {
    _id: string;
    name: string;
    __v: number; // Optional
}

interface BackendService {
    _id: string;
    title: string;
    description: string;
    category: ServiceCategory;
    price: number;
    duration: string;
    rating: number;
    reviews: number;
    imageUrl: string;
    features: string[];
    isFeatured: boolean;
}

// Define the shape the frontend component expects
export interface FrontendCategory {
    id: string;          // Used for filter button key/onClick (e.g., 'All Services')
    name: string;
    objectId: string;    // The MongoDB _id
}

export interface FrontendService {
    id: string;
    title: string;
    description: string;
    category: ServiceCategory;
    rating: number;
    reviews: number;
    price: number;
    image: string;
    features: string[];
    isFeatured?: boolean; // Added for potential use in Home section
}

// --- Utility Function to get Axios Configuration with Credentials ---
const getAuthHeaders = () => {
    return {
        withCredentials: true,
        // headers: { ... }
    };
};

export const useServicesData = () => {
    const API_URL = import.meta.env.VITE_SERVICE_CATALOG_URL || 'http://localhost:8082/api/v1';

    const [categories, setCategories] = useState<FrontendCategory[]>([]);
    const [services, setServices] = useState<FrontendService[]>([]);
    const [loading, setLoading] = useState(true);

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
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchServices = async () => {
            try {
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
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
        fetchServices();
    }, [API_URL]);

    return { categories, services, loading };
};