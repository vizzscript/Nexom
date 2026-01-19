import { ENV_CONFIG } from '@/config/env.config';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

import { toast } from 'react-hot-toast';

// Set up global axios interceptors for all axios instances that use the default export
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        // Skip toast for 401 as it's handled by redirection
        if (error.response?.status !== 401) {
            const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
            toast.error(message);
        }
        return Promise.reject(error);
    }
);

/**
 * API Client Configuration
 * Centralized axios instance with interceptors
 */

class ApiClient {
    private instance: AxiosInstance;

    constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL,
            timeout: 20000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor
        this.instance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.instance.interceptors.response.use(
            (response) => response,
            (error) => {
                // If 401, handle redirection. The actual toast is handled by global interceptor if it wasn't a 401.
                // However, since we used axios.create, we must also add the toast here OR not use axios.create
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                } else {
                    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
                    toast.error(message);
                }
                return Promise.reject(error);
            }
        );
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.get<T>(url, config);
    }

    public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.post<T>(url, data, config);
    }

    public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.put<T>(url, data, config);
    }

    public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.patch<T>(url, data, config);
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.delete<T>(url, config);
    }
}

// Export singleton instance
export const apiClient = new ApiClient(ENV_CONFIG.API_URL);
