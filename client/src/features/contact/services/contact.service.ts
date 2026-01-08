import type { ContactFormData, ContactResponse } from '@/types';
import axios from 'axios';

/**
 * Contact Service
 * Handles contact form submissions
 */

const CONTACT_API_URL = 'http://localhost:8083/api/v1/contact';

export const contactService = {
    /**
     * Submit contact form
     */
    submitContactForm: async (formData: ContactFormData): Promise<ContactResponse> => {
        const response = await axios.post<ContactResponse>(`${CONTACT_API_URL}/submit`, formData);
        return response.data;
    },
};
