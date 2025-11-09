// src/services/api.js

/**
 * Fetches a list of public products for the homepage.
 * This function calls the new, unauthenticated route.
 * @returns {Promise<Array>} A promise that resolves to an array of products.
 */
export const fetchProducts = async () => {
    // Change the URL to the new public route
    const response = await fetch('http://localhost:8000/api/v1/user/public-products');
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data;
};

/**
 * Fetches the details for a single product by its ID.
 * @param {string} productId - The ID of the product to fetch.
 * @returns {Promise<Object>} A promise that resolves to the product data.
 */
export const fetchProductById = async (productId) => {
    const response = await fetch(`http://localhost:8000/api/v1/product/details/${productId}`);
    if (!response.ok) {
        throw new Error('Product not found');
    }
    const data = await response.json();

    if (!data.success) {
        throw new Error(data.message || 'Failed to fetch product details');
    }
    return data;
};


/**
 * Fetches products based on filter criteria.
 * @param {object} filters - An object containing category, minPrice, maxPrice.
 * @returns {Promise<Array>} A promise that resolves to an array of filtered products.
 */
export const fetchFilteredProducts = async (filters) => {
    // Create a URLSearchParams object to easily build the query string
    const params = new URLSearchParams();

    if (filters.category) {
        params.append('category', filters.category);
    }
    if (filters.minPrice) {
        params.append('minPrice', filters.minPrice);
    }
    if (filters.maxPrice) {
        params.append('maxPrice', filters.maxPrice);
    }

   
    params.append('t', new Date().getTime());

    const response = await fetch(`http://localhost:8000/api/v1/user/products/filter?${params.toString()}`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch filtered products');
    }
    const data = await response.json();
    return data.products || []; // Your backend returns { success, products }
};  

// ... (keep all existing functions like fetchProducts, fetchProductById, etc.)

/**
 * Submits the sell/donation form.
 * @param {FormData} formData - The form data object including text fields and the file.
 * @returns {Promise<Object>} A promise that resolves on successful submission.
 */
export const submitDonation = async (formData) => {
    
    const response = await fetch('http://localhost:8000/api/v1/user/sell', {
        method: 'POST',
        body: formData,
        // credentials: 'include' // <-- REMOVED THIS LINE
    });

    if (!response.ok) {
        // Try to parse an error message from the backend
        const errorData = await response.json().catch(() => ({ message: 'Submission failed. Please try again.' }));
        throw new Error(errorData.message || 'Submission failed.');
    }
    
    // The backend redirects on success, which fetch handles.
    // We'll return a simple success object.
    return { success: true };
};