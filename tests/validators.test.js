/**
 * Validators – Unit Tests
 *
 * Tests all validation utility functions used across the frontend.
 */
const {
  isValidEmail,
  validatePassword,
  validateRequiredFields,
  isValidPhone,
  isValidPincode,
} = require('../src/utils/validators');

describe('Validators', () => {

  // ── EMAIL VALIDATION ──────────────────────────────────────────────

  describe('isValidEmail', () => {
    it('should return true for valid email formats', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@domain.co')).toBe(true);
      expect(isValidEmail('name+tag@email.org')).toBe(true);
    });

    it('should return false for invalid email formats', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user @domain.com')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
    });
  });

  // ── PASSWORD VALIDATION ───────────────────────────────────────────

  describe('validatePassword', () => {
    it('should return invalid for empty or short passwords', () => {
      const result1 = validatePassword('');
      expect(result1.isValid).toBe(false);
      expect(result1.message).toMatch(/at least 6 characters/i);

      const result2 = validatePassword('abc');
      expect(result2.isValid).toBe(false);

      const result3 = validatePassword(null);
      expect(result3.isValid).toBe(false);
    });

    it('should return valid for passwords with 6+ characters', () => {
      const result = validatePassword('password123');
      expect(result.isValid).toBe(true);
      expect(result.message).toMatch(/valid/i);
    });

    it('should return valid for exactly 6 characters', () => {
      const result = validatePassword('abcdef');
      expect(result.isValid).toBe(true);
    });
  });

  // ── REQUIRED FIELDS VALIDATION ────────────────────────────────────

  describe('validateRequiredFields', () => {
    it('should return valid when all required fields are present', () => {
      const formData = { firstname: 'John', lastname: 'Doe', email: 'john@test.com' };
      const result = validateRequiredFields(formData, ['firstname', 'lastname', 'email']);
      expect(result.isValid).toBe(true);
      expect(result.missingFields).toHaveLength(0);
    });

    it('should return invalid when required fields are missing', () => {
      const formData = { firstname: 'John' };
      const result = validateRequiredFields(formData, ['firstname', 'lastname', 'email']);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain('lastname');
      expect(result.missingFields).toContain('email');
      expect(result.message).toMatch(/Please fill in/i);
    });

    it('should handle empty formData', () => {
      const result = validateRequiredFields({}, ['firstname', 'email']);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toHaveLength(2);
    });

    it('should return valid when no required fields specified', () => {
      const result = validateRequiredFields({ anything: 'value' }, []);
      expect(result.isValid).toBe(true);
    });

    it('should treat falsy values as missing', () => {
      const formData = { name: '', email: null, phone: 0 };
      const result = validateRequiredFields(formData, ['name', 'email', 'phone']);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain('name');
      expect(result.missingFields).toContain('email');
      expect(result.missingFields).toContain('phone');
    });
  });

  // ── PHONE VALIDATION ──────────────────────────────────────────────

  describe('isValidPhone', () => {
    it('should return true for valid 10-digit phone numbers', () => {
      expect(isValidPhone('1234567890')).toBe(true);
      expect(isValidPhone('9876543210')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(isValidPhone('')).toBe(false);
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('12345678901')).toBe(false); // 11 digits
      expect(isValidPhone('abcdefghij')).toBe(false);
      expect(isValidPhone('123-456-7890')).toBe(false);
    });
  });

  // ── PINCODE VALIDATION ────────────────────────────────────────────

  describe('isValidPincode', () => {
    it('should return true for valid 6-digit pincodes', () => {
      expect(isValidPincode('400001')).toBe(true);
      expect(isValidPincode('110001')).toBe(true);
    });

    it('should return false for invalid pincodes', () => {
      expect(isValidPincode('')).toBe(false);
      expect(isValidPincode('1234')).toBe(false);
      expect(isValidPincode('1234567')).toBe(false); // 7 digits
      expect(isValidPincode('abcdef')).toBe(false);
    });
  });
});
