/**
 * Environment Configuration
 * Centralized environment variables management
 */

export const ENV_CONFIG = {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1/auth',
    NODE_ENV: import.meta.env.MODE,
    IS_DEVELOPMENT: import.meta.env.DEV,
    IS_PRODUCTION: import.meta.env.PROD,
} as const;
