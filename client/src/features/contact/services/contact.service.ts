import type { ContactFormData, ContactResponse } from '@/types';
import axios from 'axios';

/**
 * Contact Service
 * Handles contact form submissions
 */

import { ENV_CONFIG } from '@/config/env.config';

const CONTACT_API_URL = `${ENV_CONFIG.CONTACT_SERVICE_URL}/contact`;

export const contactService = {
    /**
     * Submit contact form
     */
    submitContactForm: async (formData: ContactFormData): Promise<ContactResponse> => {
        const response = await axios.post<ContactResponse>(`${CONTACT_API_URL}/submit`, formData);
        return response.data;
    },
};
