import axios from 'axios';

const API_URL = import.meta.env.VITE_CONTACT_SERVICE_URL || 'http://localhost:8083/api/v1/contact';

export interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

export const contactService = {
    submitForm: async (data: ContactFormData) => {
        const response = await axios.post(`${API_URL}/submit`, data);
        return response.data;
    }
};
