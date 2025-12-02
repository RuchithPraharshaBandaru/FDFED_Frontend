// Utility functions for formatting

/**
 * Format price with currency symbol and locale
 * @param {number} price - Price value
 * @param {string} currency - Currency symbol (default: ₹)
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, currency = '₹') => {
    return `${currency}${price.toLocaleString()}`;
};

/**
 * Format date to localized string
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

/**
 * Format date with time
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date and time string
 */
export const formatDateTime = (date) => {
    return new Date(date).toLocaleString();
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};
