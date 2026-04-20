/**
 * Rating Helpers – Unit Tests
 *
 * Tests the rating calculation, review counting, and display formatting.
 */
const {
  calculateAverageRating,
  getReviewCount,
  formatRatingDisplay,
} = require('../src/utils/ratingHelpers');

describe('Rating Helpers', () => {

  // ── AVERAGE RATING CALCULATION ────────────────────────────────────

  describe('calculateAverageRating', () => {
    it('should return null for empty reviews array', () => {
      expect(calculateAverageRating([])).toBeNull();
    });

    it('should return null for null/undefined input', () => {
      expect(calculateAverageRating(null)).toBeNull();
      expect(calculateAverageRating(undefined)).toBeNull();
    });

    it('should return null for non-array input', () => {
      expect(calculateAverageRating('not an array')).toBeNull();
    });

    it('should calculate correct average for valid reviews', () => {
      const reviews = [
        { rating: 5 },
        { rating: 4 },
        { rating: 3 },
      ];
      expect(calculateAverageRating(reviews)).toBe('4.0');
    });

    it('should return correct average for single review', () => {
      expect(calculateAverageRating([{ rating: 3 }])).toBe('3.0');
    });

    it('should filter out reviews with invalid ratings', () => {
      const reviews = [
        { rating: 5 },
        { rating: null },
        { rating: 0 },
        { rating: 'invalid' },
        { rating: 4 },
      ];
      // Only 5 and 4 are valid (0 is excluded, null/invalid are excluded)
      expect(calculateAverageRating(reviews)).toBe('4.5');
    });

    it('should return null when all reviews have invalid ratings', () => {
      const reviews = [
        { rating: 0 },
        { rating: null },
        { rating: 'bad' },
      ];
      expect(calculateAverageRating(reviews)).toBeNull();
    });

    it('should handle string ratings that are valid numbers', () => {
      const reviews = [
        { rating: '5' },
        { rating: '3' },
      ];
      expect(calculateAverageRating(reviews)).toBe('4.0');
    });

    it('should round to 1 decimal place', () => {
      const reviews = [
        { rating: 5 },
        { rating: 4 },
        { rating: 4 },
      ];
      expect(calculateAverageRating(reviews)).toBe('4.3');
    });
  });

  // ── REVIEW COUNT ──────────────────────────────────────────────────

  describe('getReviewCount', () => {
    it('should return 0 for empty array', () => {
      expect(getReviewCount([])).toBe(0);
    });

    it('should return 0 for null/undefined', () => {
      expect(getReviewCount(null)).toBe(0);
      expect(getReviewCount(undefined)).toBe(0);
    });

    it('should count only valid reviews', () => {
      const reviews = [
        { rating: 5 },
        { rating: 0 },   // invalid (0)
        { rating: 3 },
        { rating: null }, // invalid
      ];
      expect(getReviewCount(reviews)).toBe(2);
    });

    it('should count all reviews when all are valid', () => {
      const reviews = [
        { rating: 1 },
        { rating: 2 },
        { rating: 3 },
      ];
      expect(getReviewCount(reviews)).toBe(3);
    });
  });

  // ── RATING DISPLAY ────────────────────────────────────────────────

  describe('formatRatingDisplay', () => {
    it('should return "~" for no reviews', () => {
      expect(formatRatingDisplay([])).toBe('~');
    });

    it('should return "~" for null/undefined', () => {
      expect(formatRatingDisplay(null)).toBe('~');
      expect(formatRatingDisplay(undefined)).toBe('~');
    });

    it('should return formatted string with rating and count', () => {
      const reviews = [
        { rating: 5 },
        { rating: 4 },
      ];
      const result = formatRatingDisplay(reviews);
      expect(result).toBe('4.5 (2)');
    });

    it('should return "~" when all reviews are invalid', () => {
      const reviews = [{ rating: 0 }, { rating: null }];
      expect(formatRatingDisplay(reviews)).toBe('~');
    });
  });
});
