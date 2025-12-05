import axios from 'axios';

const API_URL = 'http://localhost:8081/api/v1/auth';

export const authService = {
    sendOtp: async (email: string) => {
        const response = await axios.post(`${API_URL}/send-otp`, { email });
        return response.data;
    },

    verifyOtp: async (email: string, otp: string) => {
        const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    resendOtp: async (email: string) => {
        const response = await axios.post(`${API_URL}/resend-otp`, { email });
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};
