// Utility functions for product ratings

/**
 * Calculate average rating from reviews array
 * @param {Array} reviews - Array of review objects with rating property
 * @returns {number|null} - Average rating rounded to 1 decimal, or null if no reviews
 */
export const calculateAverageRating = (reviews = []) => {
    if (!reviews || reviews.length === 0) return null;
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
};

/**
 * Get review count
 * @param {Array} reviews - Array of review objects
 * @returns {number} - Number of reviews
 */
export const getReviewCount = (reviews = []) => {
    return reviews ? reviews.length : 0;
};

/**
 * Format rating display string
 * @param {Array} reviews - Array of review objects
 * @returns {string} - Formatted rating string (e.g., "4.5 (12)" or "~")
 */
export const formatRatingDisplay = (reviews = []) => {
    const rating = calculateAverageRating(reviews);
    const count = getReviewCount(reviews);
    
    if (!rating) return '~';
    return count > 0 ? `${rating} (${count})` : rating;
};
