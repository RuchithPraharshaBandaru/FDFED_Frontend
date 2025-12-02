// src/services/api.js

const API_BASE_URL = 'http://localhost:8000/api/v1/user';

// --- AUTH FUNCTIONS ---

export const apiLogin = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || 'Login failed');
    }
    const data = await response.json();
    console.log('Login response:', data);
    return {
        success: true,
        user: data.user || data.data?.user || data,
        token: data.token || data.data?.token
    };
};

export const apiLogout = async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Logout failed');
    return { success: true };
};

export const apiCheckAuth = async () => {
    const response = await fetch(`${API_BASE_URL}/account/details`, {
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Not authenticated');
    const data = await response.json();
    console.log('Check auth response:', data);
    return {
        success: true,
        user: data.user || data.data?.user || data,
        token: data.token || data.data?.token
    };
};

export const apiSignup = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Signup failed' }));
        throw new Error(errorData.message || 'Signup failed');
    }
    const data = await response.json();
    console.log('Signup response:', data);
    return {
        success: true,
        user: data.user || data.data?.user || data,
        token: data.token || data.data?.token
    };
};


// --- PRODUCT FUNCTIONS ---

export const fetchProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/products`, {
        credentials: 'include' 
    });
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data;
};

export const fetchProductById = async (productId) => {
    const response = await fetch(`http://localhost:8000/api/v1/product/details/${productId}`, {
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error('Product not found');
    }
    const data = await response.json();
    if (!data.success) {
        throw new Error(data.message || 'Failed to fetch product details');
    }
    return data;
};

export const fetchFilteredProducts = async (filters) => {
    const params = new URLSearchParams();
    
    // Handle multiple categories as array
    if (filters.categories && filters.categories.length > 0) {
        filters.categories.forEach(cat => params.append('category', cat));
    }
    
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    params.append('t', new Date().getTime());

    const response = await fetch(`${API_BASE_URL}/products/filter?${params.toString()}`, {
        credentials: 'include'
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch filtered products');
    }
    const data = await response.json();
    return data.products || [];
};  

export const submitDonation = async (formData) => {
    const response = await fetch(`${API_BASE_URL}/sell`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Submission failed. Please try again.' }));
        throw new Error(errorData.message || 'Submission failed.');
    }
    return response.json();
};

// --- ACCOUNT FUNCTIONS ---

export const apiUpdateAccountDetails = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/account/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include',
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to update details');
    }
    return response.json();
};

export const apiGetAccountAddress = async () => {
    const response = await fetch(`${API_BASE_URL}/account/address/details`, {
        credentials: 'include',
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to fetch address');
    }
    return response.json();
};

export const apiUpdateAccountAddress = async (addressData) => {
    const response = await fetch(`${API_BASE_URL}/account/update/address`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData),
        credentials: 'include',
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to update address');
    }
    return response.json();
};

// --- DASHBOARD FUNCTIONS ---

export const apiGetOrderHistory = async () => {
    const response = await fetch(`${API_BASE_URL}/order-history`, {
        credentials: 'include',
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to fetch order history');
    }
    return response.json();
};

export const apiGetDonatedProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/donated-products`, {
        credentials: 'include',
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to fetch donated products');
    }
    return response.json();
};

// --- CART & CHECKOUT FUNCTIONS ---

/**
 * Fetches the user's current cart items.
 * @returns {Promise<Object>} A promise that resolves to { success, cart }
 */
export const apiGetCart = async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch cart');
    }
    return response.json(); // Assumes { success: true, cart: [...] }
};

/**
 * Fetches all data needed for the checkout page.
 * @returns {Promise<Object>} A promise that resolves to { success, user, total, extra }
 */
export const apiGetCheckoutDetails = async () => {
    const response = await fetch(`${API_BASE_URL}/checkout-details`, {
        credentials: 'include',
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to fetch checkout details');
    }
    return response.json();
};

/**
 * Submits the payment and places the order.
 * @param {object} paymentData - { paymentMethod, address }
 * @returns {Promise<Object>} A promise that resolves to { success, message, orderId }
 */
export const apiSubmitPayment = async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
        credentials: 'include',
    });
    if (!response.ok) {
        const err = await response.json();
        console.error('Payment API error:', err);
        throw new Error(err.error || err.message || 'Payment failed');
    }
    return response.json();
};

/**
 * Syncs the Redux cart with the backend before checkout
 * @param {Array} cartItems - Array of cart items from Redux
 * @returns {Promise<Object>}
 */
export const apiSyncCart = async (cartItems) => {
    const response = await fetch(`${API_BASE_URL}/cart/sync`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart: cartItems }),
        credentials: 'include',
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to sync cart');
    }
    return response.json();
};

export const apiAddToCart = async (productId) => {
    const response = await fetch(`${API_BASE_URL}/cart/add/${productId}`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return response.json();
};

export const apiDecreaseQuantity = async (productId) => {
    const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to decrease quantity');
    return response.json();
};

export const apiRemoveFromCart = async (productId) => {
    const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to remove from cart');
    return response.json();
};
// --- REVIEW FUNCTIONS ---

/**
 * Submits a new review for a product.
 * @param {string} productId - The ID of the product to review.
 * @param {object} reviewData - { rating, description }
 * @returns {Promise<Object>} A promise that resolves to { success, message }
 */
export const apiSubmitReview = async (productId, reviewData) => {
    const response = await fetch(`${API_BASE_URL}/review/create/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
        credentials: 'include',
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to submit review');
    }
    return response.json();
};

// --- *** NEW DELETE REVIEW FUNCTION *** ---
/**
 * Deletes a review.
 * @param {string} reviewId - The ID of the review to delete.
 * @returns {Promise<Object>}
 */
export const apiDeleteReview = async (reviewId) => {
    const response = await fetch(`${API_BASE_URL}/review/delete/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to delete review');
    }
    return response.json();
};