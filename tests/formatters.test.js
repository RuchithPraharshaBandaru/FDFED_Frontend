/**
 * Formatters – Unit Tests
 *
 * Tests all formatting utility functions.
 */
const {
  formatPrice,
  formatDate,
  formatDateTime,
  truncateText,
} = require('../src/utils/formatters');

describe('Formatters', () => {

  // ── PRICE FORMATTING ──────────────────────────────────────────────

  describe('formatPrice', () => {
    it('should format price with default currency symbol (₹)', () => {
      const result = formatPrice(1000);
      expect(result).toContain('₹');
      expect(result).toContain('1,000');
    });

    it('should format price with custom currency symbol', () => {
      const result = formatPrice(500, '$');
      expect(result).toBe('$500');
    });

    it('should handle zero price', () => {
      expect(formatPrice(0)).toBe('₹0');
    });

    it('should handle large numbers with locale formatting', () => {
      const result = formatPrice(1000000);
      expect(result).toContain('₹');
    });
  });

  // ── DATE FORMATTING ───────────────────────────────────────────────

  describe('formatDate', () => {
    it('should format a valid date string', () => {
      const result = formatDate('2024-01-15');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should format a Date object', () => {
      const result = formatDate(new Date(2024, 0, 15));
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  // ── DATE-TIME FORMATTING ──────────────────────────────────────────

  describe('formatDateTime', () => {
    it('should format date with time', () => {
      const result = formatDateTime('2024-01-15T10:30:00');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  // ── TEXT TRUNCATION ───────────────────────────────────────────────

  describe('truncateText', () => {
    it('should return the same text if shorter than maxLength', () => {
      expect(truncateText('Hello', 100)).toBe('Hello');
    });

    it('should truncate text longer than maxLength with ellipsis', () => {
      const longText = 'A'.repeat(150);
      const result = truncateText(longText, 100);
      expect(result.length).toBe(103); // 100 chars + '...'
      expect(result.endsWith('...')).toBe(true);
    });

    it('should use default maxLength of 100', () => {
      const longText = 'B'.repeat(150);
      const result = truncateText(longText);
      expect(result.length).toBe(103);
    });

    it('should handle null/undefined text', () => {
      expect(truncateText(null)).toBeNull();
      expect(truncateText(undefined)).toBeUndefined();
    });

    it('should handle empty string', () => {
      expect(truncateText('')).toBe('');
    });

    it('should handle text exactly at maxLength', () => {
      const text = 'C'.repeat(100);
      expect(truncateText(text, 100)).toBe(text); // No truncation
    });
  });
});
