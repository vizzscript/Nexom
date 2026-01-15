/**
 * Environment Configuration
 * Centralized environment variables management
 */

export const ENV_CONFIG = {
    API_URL: import.meta.env.VITE_API_URL,
    SERVICE_CATALOG_URL: import.meta.env.VITE_SERVICE_CATALOG_URL,
    PAYMENT_SERVICE_URL: import.meta.env.VITE_PAYMENT_SERVICE_URL,
    CONTACT_SERVICE_URL: import.meta.env.VITE_CONTACT_SERVICE_URL,
    BOOKING_SERVICE_URL: import.meta.env.VITE_BOOKING_SERVICE_URL,
    STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    NODE_ENV: import.meta.env.MODE,
    IS_DEVELOPMENT: import.meta.env.DEV,
    IS_PRODUCTION: import.meta.env.PROD,
} as const;
