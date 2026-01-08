/**
 * Validation Utilities
 * Helper functions for form validation
 */

export const validators = {
    /**
     * Validate email format
     */
    isValidEmail: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate required field
     */
    isRequired: (value: string): boolean => {
        return value.trim().length > 0;
    },

    /**
     * Validate minimum length
     */
    minLength: (value: string, min: number): boolean => {
        return value.trim().length >= min;
    },

    /**
     * Validate maximum length
     */
    maxLength: (value: string, max: number): boolean => {
        return value.trim().length <= max;
    },

    /**
     * Validate phone number (basic)
     */
    isValidPhone: (phone: string): boolean => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    },
};
