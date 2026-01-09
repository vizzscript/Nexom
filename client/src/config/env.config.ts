/**
 * Environment Configuration
 * Centralized environment variables management
 */

export const ENV_CONFIG = {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1/auth',
    SERVICE_CATALOG_URL: import.meta.env.VITE_SERVICE_CATALOG_URL || 'http://localhost:8082/api/v1',
    PAYMENT_SERVICE_URL: import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:8084/api/v1/payments',
    CONTACT_SERVICE_URL: import.meta.env.VITE_CONTACT_SERVICE_URL || 'http://localhost:8083/api/v1',
    STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder',
    NODE_ENV: import.meta.env.MODE,
    IS_DEVELOPMENT: import.meta.env.DEV,
    IS_PRODUCTION: import.meta.env.PROD,
} as const;
