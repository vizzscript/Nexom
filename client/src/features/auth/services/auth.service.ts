import { API_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import { apiClient } from '@/lib/api/apiClient';
import type { AuthResponse, LoginCredentials, OtpRequest } from '@/types';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

export const authService = {
    /**
     * Send OTP to email
     */
    sendOtp: async (email: string): Promise<AuthResponse> => {
        const payload: OtpRequest = { email };
        const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.SEND_OTP, payload);
        return response.data;
    },

    /**
     * Verify OTP and login
     */
    verifyOtp: async (email: string, otp: string): Promise<AuthResponse> => {
        const payload: LoginCredentials = { email, otp };
        const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.VERIFY_OTP, payload);

        if (response.data.token) {
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
        }

        return response.data;
    },

    /**
     * Resend OTP
     */
    resendOtp: async (email: string): Promise<AuthResponse> => {
        const payload: OtpRequest = { email };
        const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.RESEND_OTP, payload);
        return response.data;
    },

    /**
     * Logout user
     */
    logout: (): void => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    },

    /**
     * Get stored token
     */
    getToken: (): string | null => {
        return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    },
};
