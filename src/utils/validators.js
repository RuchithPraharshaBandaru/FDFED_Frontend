// Utility functions for validation

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Object with isValid and message properties
 */
export const validatePassword = (password) => {
    if (!password || password.length < 6) {
        return {
            isValid: false,
            message: 'Password must be at least 6 characters long'
        };
    }
    return {
        isValid: true,
        message: 'Password is valid'
    };
};

/**
 * Validate required fields
 * @param {object} formData - Form data object
 * @param {Array} requiredFields - Array of required field names
 * @returns {object} - Object with isValid and missing fields
 */
export const validateRequiredFields = (formData, requiredFields = []) => {
    const missing = requiredFields.filter(field => !formData[field]);
    
    return {
        isValid: missing.length === 0,
        missingFields: missing,
        message: missing.length > 0 
            ? `Please fill in: ${missing.join(', ')}` 
            : 'All required fields filled'
    };
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
export const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
};

/**
 * Validate pincode format
 * @param {string} pincode - Pincode to validate
 * @returns {boolean} - True if valid pincode format
 */
export const isValidPincode = (pincode) => {
    const pincodeRegex = /^[0-9]{6}$/;
    return pincodeRegex.test(pincode);
};
