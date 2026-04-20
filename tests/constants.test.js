/**
 * Constants – Unit Tests
 *
 * Verifies that all exported constants have the correct structure and values.
 */
const {
  POINTS_TABLE,
  CATEGORIES,
  FABRIC_TYPES,
  SIZES,
  GENDERS,
  USAGE_DURATIONS,
  PRICE_RANGES,
  SORT_OPTIONS,
  TIME_SLOTS,
} = require('../src/utils/constants');

describe('Constants', () => {

  // ── POINTS TABLE ──────────────────────────────────────────────────

  describe('POINTS_TABLE', () => {
    it('should be a non-empty array', () => {
      expect(Array.isArray(POINTS_TABLE)).toBe(true);
      expect(POINTS_TABLE.length).toBeGreaterThan(0);
    });

    it('should have entries with required keys (s, f, u, p)', () => {
      POINTS_TABLE.forEach(entry => {
        expect(entry).toHaveProperty('s');
        expect(entry).toHaveProperty('f');
        expect(entry).toHaveProperty('u');
        expect(entry).toHaveProperty('p');
      });
    });

    it('should have positive point values', () => {
      POINTS_TABLE.forEach(entry => {
        expect(entry.p).toBeGreaterThan(0);
      });
    });

    it('should contain entries for all fabric types (Cotton, Silk, Linen, Leather, Cashmere)', () => {
      const fabrics = [...new Set(POINTS_TABLE.map(e => e.f))];
      expect(fabrics).toContain('Cotton');
      expect(fabrics).toContain('Silk');
      expect(fabrics).toContain('Linen');
      expect(fabrics).toContain('Leather');
      expect(fabrics).toContain('Cashmere');
    });

    it('should contain entries for sizes S, M, L', () => {
      const sizes = [...new Set(POINTS_TABLE.map(e => e.s))];
      expect(sizes).toContain('S');
      expect(sizes).toContain('M');
      expect(sizes).toContain('L');
    });
  });

  // ── CATEGORIES ────────────────────────────────────────────────────

  describe('CATEGORIES', () => {
    it('should be a non-empty array of strings', () => {
      expect(Array.isArray(CATEGORIES)).toBe(true);
      expect(CATEGORIES.length).toBeGreaterThan(0);
      CATEGORIES.forEach(cat => {
        expect(typeof cat).toBe('string');
      });
    });

    it('should contain standard categories', () => {
      expect(CATEGORIES).toContain('Silk');
      expect(CATEGORIES).toContain('Cotton');
      expect(CATEGORIES).toContain('Leather');
    });
  });

  // ── FABRIC TYPES ──────────────────────────────────────────────────

  describe('FABRIC_TYPES', () => {
    it('should be a non-empty array', () => {
      expect(Array.isArray(FABRIC_TYPES)).toBe(true);
      expect(FABRIC_TYPES.length).toBeGreaterThan(0);
    });

    it('should include common fabric types', () => {
      expect(FABRIC_TYPES).toContain('Cotton');
      expect(FABRIC_TYPES).toContain('Silk');
      expect(FABRIC_TYPES).toContain('Polyester');
      expect(FABRIC_TYPES).toContain('Other');
    });
  });

  // ── SIZES ─────────────────────────────────────────────────────────

  describe('SIZES', () => {
    it('should contain standard clothing sizes', () => {
      expect(SIZES).toEqual(expect.arrayContaining(['XS', 'S', 'M', 'L', 'XL', 'XXL']));
    });

    it('should have 6 sizes', () => {
      expect(SIZES).toHaveLength(6);
    });
  });

  // ── GENDERS ───────────────────────────────────────────────────────

  describe('GENDERS', () => {
    it('should contain Male, Female, Unisex', () => {
      expect(GENDERS).toEqual(expect.arrayContaining(['Male', 'Female', 'Unisex']));
    });

    it('should have 3 options', () => {
      expect(GENDERS).toHaveLength(3);
    });
  });

  // ── USAGE DURATIONS ───────────────────────────────────────────────

  describe('USAGE_DURATIONS', () => {
    it('should be a non-empty array', () => {
      expect(Array.isArray(USAGE_DURATIONS)).toBe(true);
      expect(USAGE_DURATIONS.length).toBeGreaterThan(0);
    });
  });

  // ── PRICE RANGES ──────────────────────────────────────────────────

  describe('PRICE_RANGES', () => {
    it('should have label and value properties', () => {
      PRICE_RANGES.forEach(range => {
        expect(range).toHaveProperty('label');
        expect(range).toHaveProperty('value');
        expect(typeof range.label).toBe('string');
        expect(typeof range.value).toBe('string');
      });
    });

    it('should have 3 price ranges', () => {
      expect(PRICE_RANGES).toHaveLength(3);
    });
  });

  // ── SORT OPTIONS ──────────────────────────────────────────────────

  describe('SORT_OPTIONS', () => {
    it('should have value and label properties', () => {
      SORT_OPTIONS.forEach(option => {
        expect(option).toHaveProperty('value');
        expect(option).toHaveProperty('label');
      });
    });

    it('should include standard sort options', () => {
      const values = SORT_OPTIONS.map(o => o.value);
      expect(values).toContain('newest');
      expect(values).toContain('price-low-high');
      expect(values).toContain('price-high-low');
      expect(values).toContain('rating');
      expect(values).toContain('popular');
    });
  });

  // ── TIME SLOTS ────────────────────────────────────────────────────

  describe('TIME_SLOTS', () => {
    it('should be a non-empty array of strings', () => {
      expect(Array.isArray(TIME_SLOTS)).toBe(true);
      expect(TIME_SLOTS.length).toBeGreaterThan(0);
      TIME_SLOTS.forEach(slot => {
        expect(typeof slot).toBe('string');
      });
    });

    it('should have 4 time slots', () => {
      expect(TIME_SLOTS).toHaveLength(4);
    });
  });
});
