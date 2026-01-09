/**
 * Storage Utilities
 * Helper functions for localStorage operations
 */

export const storage = {
    /**
     * Get item from localStorage
     */
    get: <T>(key: string): T | null => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error getting item from storage: ${key}`, error);
            return null;
        }
    },

    /**
     * Set item in localStorage
     */
    set: <T>(key: string, value: T): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting item in storage: ${key}`, error);
        }
    },

    /**
     * Remove item from localStorage
     */
    remove: (key: string): void => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing item from storage: ${key}`, error);
        }
    },

    /**
     * Clear all items from localStorage
     */
    clear: (): void => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing storage', error);
        }
    },
};
