import { calculateAverageRating } from './ratingHelpers';

// Utility functions for sorting products

/**
 * Sort products by price (low to high)
 */
export const sortByPriceLowToHigh = (products) => {
    return [...products].sort((a, b) => a.price - b.price);
};

/**
 * Sort products by price (high to low)
 */
export const sortByPriceHighToLow = (products) => {
    return [...products].sort((a, b) => b.price - a.price);
};

/**
 * Sort products by rating (highest to lowest)
 */
export const sortByRating = (products) => {
    return [...products].sort((a, b) => {
        // Use the robust helper function instead of manual calculation
        // coerce to Number because calculateAverageRating returns a string or null
        const ratingA = Number(calculateAverageRating(a.reviews)) || 0;
        const ratingB = Number(calculateAverageRating(b.reviews)) || 0;
        
        return ratingB - ratingA;
    });
};

/**
 * Sort products by popularity (number of reviews)
 */
export const sortByPopularity = (products) => {
    return [...products].sort((a, b) => 
        (b.reviews?.length || 0) - (a.reviews?.length || 0)
    );
};

/**
 * Main sorting function that handles all sort types
 * @param {Array} products - Array of product objects
 * @param {string} sortBy - Sort type: 'newest', 'price-low-high', 'price-high-low', 'rating', 'popular'
 * @returns {Array} - Sorted array of products
 */
export const sortProducts = (products, sortBy = 'newest') => {
    switch(sortBy) {
        case 'price-low-high':
            return sortByPriceLowToHigh(products);
        case 'price-high-low':
            return sortByPriceHighToLow(products);
        case 'rating':
            return sortByRating(products);
        case 'popular':
            return sortByPopularity(products);
        case 'newest':
        default:
            return products; // Keep original order
    }
};