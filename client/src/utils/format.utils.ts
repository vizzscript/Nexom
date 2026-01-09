/**
 * Format Utilities
 * Helper functions for formatting data
 */

/**
 * Format currency
 */
export const formatCurrency = (amount: number, currency: string = '₹'): string => {
    return `${currency}${amount.toLocaleString('en-IN')}`;
};

/**
 * Format date
 */
export const formatDate = (date: string | Date, format: 'short' | 'long' = 'short'): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (format === 'long') {
        return dateObj.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    return dateObj.toLocaleDateString('en-IN');
};

/**
 * Truncate text
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitalize first letter
 */
export const capitalizeFirst = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
