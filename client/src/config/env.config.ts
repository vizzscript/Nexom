/**
 * Environment Configuration
 * Centralized environment variables management
 */

export const ENV_CONFIG = {
    API_URL: import.meta.env.VITE_API_URL || '/api/v1',
    SERVICE_CATALOG_URL: import.meta.env.VITE_SERVICE_CATALOG_URL || '/api/v1',
    PAYMENT_SERVICE_URL: import.meta.env.VITE_PAYMENT_SERVICE_URL || '/api/v1/payments',
    CONTACT_SERVICE_URL: import.meta.env.VITE_CONTACT_SERVICE_URL || '/api/v1/contact',
    BOOKING_SERVICE_URL: import.meta.env.VITE_BOOKING_SERVICE_URL || '/api/v1/bookings',

    NODE_ENV: import.meta.env.MODE,
    IS_DEVELOPMENT: import.meta.env.DEV,
    IS_PRODUCTION: import.meta.env.PROD,
} as const;
