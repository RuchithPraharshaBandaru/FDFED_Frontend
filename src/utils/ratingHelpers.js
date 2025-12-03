// src/utils/ratingHelpers.js

/**
 * Calculate average rating from reviews array
 * @param {Array} reviews - Array of review objects with rating property
 * @returns {number|null} - Average rating rounded to 1 decimal, or null if no reviews
 */
export const calculateAverageRating = (reviews = []) => {
    // 1. Basic safety check
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return null;
    
    // 2. Filter out invalid reviews (missing rating or non-numbers)
    const validReviews = reviews.filter(review => {
        const r = Number(review?.rating);
        return !isNaN(r) && r > 0;
    });

    // 3. If no valid reviews remain, return null (displays as ~)
    if (validReviews.length === 0) return null;
    
    // 4. Calculate sum using the coerced Number value
    const sum = validReviews.reduce((acc, review) => acc + Number(review.rating), 0);
    
    return (sum / validReviews.length).toFixed(1);
};

/**
 * Get review count
 * @param {Array} reviews - Array of review objects
 * @returns {number} - Number of reviews
 */
export const getReviewCount = (reviews = []) => {
    // Ensure we only count valid reviews to match the rating logic
    if (!reviews || !Array.isArray(reviews)) return 0;
    return reviews.filter(r => !isNaN(Number(r?.rating)) && Number(r?.rating) > 0).length;
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