import type { LucideIcon } from 'lucide-react';

/**
 * Service Types
 */

export interface ServiceCategory {
    _id: string;
    name: string;
}

export interface Service {
    id: string;
    title: string;
    price: number;
    description: string;
}

export interface AugmentedService extends Service {
    duration: string;
    icon: LucideIcon;
}

export interface BackendCategory {
    _id: string;
    name: string;
    __v?: number;
}

export interface BackendService {
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

export interface FrontendCategory {
    id: string;
    name: string;
    objectId: string;
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
    isFeatured?: boolean;
}
