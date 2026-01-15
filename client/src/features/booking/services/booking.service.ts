import { ENV_CONFIG } from '@/config/env.config';
import axios from 'axios';
import type { Booking, CreateBookingRequest } from '../types';

const API_URL = `${ENV_CONFIG.BOOKING_SERVICE_URL}/api/v1/bookings`;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    };
};

export const bookingService = {
    createBooking: async (data: CreateBookingRequest): Promise<Booking> => {
        const response = await axios.post(`${API_URL}`, data, getAuthHeaders());
        return response.data.data;
    },

    getUserBookings: async (userId: string): Promise<Booking[]> => {
        const response = await axios.get(`${API_URL}/user/${userId}`, getAuthHeaders());
        return response.data.data;
    },

    getBookingById: async (id: string): Promise<Booking> => {
        const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
        return response.data.data;
    },

    updateBooking: async (id: string, data: Partial<Booking>): Promise<Booking> => {
        const response = await axios.patch(`${API_URL}/${id}`, data, getAuthHeaders());
        return response.data.data;
    },

    cancelBooking: async (id: string): Promise<Booking> => {
        const response = await axios.patch(`${API_URL}/${id}/cancel`, {}, getAuthHeaders());
        return response.data.data;
    },
};
