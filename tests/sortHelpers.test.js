/**
 * Sort Helpers – Unit Tests
 *
 * Tests all product sorting utility functions.
 */
const {
  sortByPriceLowToHigh,
  sortByPriceHighToLow,
  sortByRating,
  sortByPopularity,
  sortProducts,
} = require('../src/utils/sortHelpers');

// Sample products for testing
const sampleProducts = [
  { _id: '1', title: 'Shirt', price: 500, reviews: [{ rating: 4 }, { rating: 5 }] },
  { _id: '2', title: 'Jeans', price: 1200, reviews: [{ rating: 3 }] },
  { _id: '3', title: 'Jacket', price: 800, reviews: [{ rating: 5 }, { rating: 5 }, { rating: 4 }] },
  { _id: '4', title: 'Cap', price: 200, reviews: [] },
];

describe('Sort Helpers', () => {

  // ── PRICE LOW TO HIGH ─────────────────────────────────────────────

  describe('sortByPriceLowToHigh', () => {
    it('should sort products from lowest to highest price', () => {
      const sorted = sortByPriceLowToHigh(sampleProducts);
      expect(sorted[0].price).toBe(200);
      expect(sorted[1].price).toBe(500);
      expect(sorted[2].price).toBe(800);
      expect(sorted[3].price).toBe(1200);
    });

    it('should not mutate the original array', () => {
      const original = [...sampleProducts];
      sortByPriceLowToHigh(sampleProducts);
      expect(sampleProducts).toEqual(original);
    });

    it('should handle empty array', () => {
      expect(sortByPriceLowToHigh([])).toEqual([]);
    });
  });

  // ── PRICE HIGH TO LOW ─────────────────────────────────────────────

  describe('sortByPriceHighToLow', () => {
    it('should sort products from highest to lowest price', () => {
      const sorted = sortByPriceHighToLow(sampleProducts);
      expect(sorted[0].price).toBe(1200);
      expect(sorted[1].price).toBe(800);
      expect(sorted[2].price).toBe(500);
      expect(sorted[3].price).toBe(200);
    });

    it('should not mutate the original array', () => {
      const original = [...sampleProducts];
      sortByPriceHighToLow(sampleProducts);
      expect(sampleProducts).toEqual(original);
    });
  });

  // ── SORT BY RATING ────────────────────────────────────────────────

  describe('sortByRating', () => {
    it('should sort products by highest average rating first', () => {
      const sorted = sortByRating(sampleProducts);
      // Jacket: (5+5+4)/3 = 4.7, Shirt: (4+5)/2 = 4.5, Jeans: 3.0, Cap: no reviews (0)
      expect(sorted[0].title).toBe('Jacket');
      expect(sorted[1].title).toBe('Shirt');
      expect(sorted[2].title).toBe('Jeans');
      expect(sorted[3].title).toBe('Cap');
    });

    it('should handle products with no reviews', () => {
      const products = [
        { _id: '1', price: 100, reviews: [] },
        { _id: '2', price: 200, reviews: [{ rating: 5 }] },
      ];
      const sorted = sortByRating(products);
      expect(sorted[0]._id).toBe('2');
    });

    it('should not mutate the original array', () => {
      const original = [...sampleProducts];
      sortByRating(sampleProducts);
      expect(sampleProducts).toEqual(original);
    });
  });

  // ── SORT BY POPULARITY ────────────────────────────────────────────

  describe('sortByPopularity', () => {
    it('should sort by number of reviews (most first)', () => {
      const sorted = sortByPopularity(sampleProducts);
      // Jacket: 3 reviews, Shirt: 2, Jeans: 1, Cap: 0
      expect(sorted[0].title).toBe('Jacket');
      expect(sorted[1].title).toBe('Shirt');
      expect(sorted[2].title).toBe('Jeans');
      expect(sorted[3].title).toBe('Cap');
    });

    it('should handle products with undefined reviews', () => {
      const products = [
        { _id: '1', price: 100 },
        { _id: '2', price: 200, reviews: [{ rating: 5 }] },
      ];
      const sorted = sortByPopularity(products);
      expect(sorted[0]._id).toBe('2');
    });
  });

  // ── MAIN SORT FUNCTION ────────────────────────────────────────────

  describe('sortProducts', () => {
    it('should sort by price low to high', () => {
      const sorted = sortProducts(sampleProducts, 'price-low-high');
      expect(sorted[0].price).toBe(200);
      expect(sorted[3].price).toBe(1200);
    });

    it('should sort by price high to low', () => {
      const sorted = sortProducts(sampleProducts, 'price-high-low');
      expect(sorted[0].price).toBe(1200);
      expect(sorted[3].price).toBe(200);
    });

    it('should sort by rating', () => {
      const sorted = sortProducts(sampleProducts, 'rating');
      expect(sorted[0].title).toBe('Jacket');
    });

    it('should sort by popularity', () => {
      const sorted = sortProducts(sampleProducts, 'popular');
      expect(sorted[0].title).toBe('Jacket');
    });

    it('should return original order for "newest" or default', () => {
      const sorted = sortProducts(sampleProducts, 'newest');
      expect(sorted).toEqual(sampleProducts);
    });

    it('should return original order for unknown sort type', () => {
      const sorted = sortProducts(sampleProducts, 'unknown');
      expect(sorted).toEqual(sampleProducts);
    });

    it('should use "newest" as default when no sortBy provided', () => {
      const sorted = sortProducts(sampleProducts);
      expect(sorted).toEqual(sampleProducts);
    });
  });
});
