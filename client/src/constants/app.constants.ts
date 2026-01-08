/**
 * Application Constants
 */

export const APP_CONSTANTS = {
    APP_NAME: 'Nexom',
    APP_DESCRIPTION: 'Professional Home Cleaning Services',
} as const;

export const STORAGE_KEYS = {
    AUTH_TOKEN: 'token',
    USER_DATA: 'user_data',
} as const;

export const API_ENDPOINTS = {
    AUTH: {
        SEND_OTP: '/send-otp',
        VERIFY_OTP: '/verify-otp',
        RESEND_OTP: '/resend-otp',
    },
    CONTACT: {
        SUBMIT: '/contact',
    },
} as const;

export const ROUTES = {
    HOME: '/',
    SERVICES: '/services',
    BOOK: '/book',
    ABOUT: '/about',
    CONTACT: '/contact',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
} as const;
