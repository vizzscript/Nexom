/**
 * Simple logger utility for Nexom microservices
 */
export const logger = {
    info: (service: string, message: string, data?: any) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${service}] [INFO] [${timestamp}] ${message}`, data ? data : '');
    },
    error: (service: string, message: string, error?: any) => {
        const timestamp = new Date().toLocaleTimeString();
        console.error(`[${service}] [ERROR] [${timestamp}] ${message}`, error ? error : '');
    },
    warn: (service: string, message: string, data?: any) => {
        const timestamp = new Date().toLocaleTimeString();
        console.warn(`[${service}] [WARN] [${timestamp}] ${message}`, data ? data : '');
    },
    success: (service: string, message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${service}] [SUCCESS] [${timestamp}] ${message}`);
    }
};
