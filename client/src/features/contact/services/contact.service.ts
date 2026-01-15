import axios from 'axios';

/**
 * Contact Service
 * Handles contact form submissions
 */

import { ENV_CONFIG } from '@/config/env.config';

// Define the shape of the notification returned by the backend
export interface InAppNotification {
    title: string;
    body: string;
    timestamp: string;
    referenceId: string;
    status?: string;
}

export interface ContactResponse {
    status: number;
    message: string;
    notification?: InAppNotification;
}

export interface ContactMessage {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    notificationTitle: string;
    notificationBody: string;
    status: 'pending' | 'in-progress' | 'resolved';
    userId?: string;
    isRead: boolean;
    createdAt: string;
}

const CONTACT_API_URL = `${ENV_CONFIG.CONTACT_SERVICE_URL}/contact`;

export const contactService = {
    submitContactForm: async (formData: any): Promise<ContactResponse> => {
        const response = await axios.post<ContactResponse>(`${CONTACT_API_URL}/submit`, formData);
        return response.data;
    },

    getMessages: async (): Promise<ContactMessage[]> => {
        const response = await axios.get<ContactMessage[]>(`${CONTACT_API_URL}/messages`);
        return response.data;
    },

    markAsRead: async (id: string): Promise<any> => {
        const response = await axios.patch(`${CONTACT_API_URL}/messages/${id}/read`);
        return response.data;
    },

    deleteMessage: async (id: string): Promise<any> => {
        const response = await axios.delete(`${CONTACT_API_URL}/messages/${id}`);
        return response.data;
    }
};