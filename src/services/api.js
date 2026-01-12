// src/services/api.js

const API_BASE_URL = 'http://localhost:8000/api/v1/user';

// Industry API base
const INDUSTRY_BASE = 'http://localhost:8000/api/v1/industry';

// --- INDUSTRY API HELPERS ---
export const industryLogin = async (credentials) => {
    console.log('industryLogin called with', credentials);
    try {
        const res = await fetch(`${INDUSTRY_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
            credentials: 'include'
        });
        console.log('industryLogin fetch completed, status:', res.status);
        let data = await res.json().catch(() => ({}));
        console.log('industryLogin response json:', data);
        if (!res.ok) throw new Error(data.error || data.message || 'Login failed');

        // Normalize array-shaped responses: many backends return [industry, ...]
        if (Array.isArray(data)) {
            return { success: true, industry: data[0], raw: data };
        }

        // If backend returns industry directly, coerce into consistent object
        if (data && (data.industry || data.success || data.companyName || data.email)) {
            return { success: data.success ?? true, industry: data.industry ?? data, raw: data };
        }

        return data;
    } catch (err) {
        console.error('industryLogin fetch error:', err);
        throw err;
    }
};

export const industrySignup = async (body) => {
    console.log('industrySignup called with', body);
    try {
        const res = await fetch(`${INDUSTRY_BASE}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            credentials: 'include'
        });
        console.log('industrySignup fetch completed, status:', res.status);
        let data = await res.json().catch(() => ({}));
        console.log('industrySignup response json:', data);
        if (!res.ok) throw new Error(data.error || data.message || 'Signup failed');

        if (Array.isArray(data)) {
            return { success: true, industry: data[0], raw: data };
        }

        if (data && (data.industry || data.success || data.companyName || data.email)) {
            return { success: data.success ?? true, industry: data.industry ?? data, raw: data };
        }

        return data;
    } catch (err) {
        console.error('industrySignup fetch error:', err);
        throw err;
    }
};

export const fetchIndustryHome = async () => {
    console.log('API: Fetching industry home from:', `${INDUSTRY_BASE}/home`);
    const res = await fetch(`${INDUSTRY_BASE}/home`, { credentials: 'include' });
    console.log('API: Industry home response status:', res.status);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('API: Industry home error response:', err);
        throw new Error(err.message || 'Failed to fetch industry home');
    }
    const data = await res.json();
    console.log('API: Industry home data:', data);
    return data;
};

export const getIndustryProfile = async () => {
    const res = await fetch(`${INDUSTRY_BASE}/profile`, { credentials: 'include' });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to fetch profile');
    }
    return res.json();
};

export const getIndustryProfileForEdit = async () => {
    const res = await fetch(`${INDUSTRY_BASE}/profile/edit`, { credentials: 'include' });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to fetch profile for edit');
    }
    return res.json();
};

export const postIndustryProfileEdit = async (body) => {
    const res = await fetch(`${INDUSTRY_BASE}/profile/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include'
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Failed to update profile');
    return data;
};

export const getIndustryCart = async () => {
    const res = await fetch(`${INDUSTRY_BASE}/cart`, { credentials: 'include' });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.msg || err.message || 'Failed to fetch cart');
    }
    return res.json();
};

export const postIndustryCart = async (body) => {
    console.log('[DEBUG] postIndustryCart sending payload:', body);
    const res = await fetch(`${INDUSTRY_BASE}/cart`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'include'
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.msg || data.message || 'Failed to add to cart');
    return data;
};

export const postIndustryCartDelete = async (body) => {
    const res = await fetch(`${INDUSTRY_BASE}/cart/delete`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'include'
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Failed to delete cart item');
    return data;
};

export const getIndustryCheckout = async () => {
    const res = await fetch(`${INDUSTRY_BASE}/checkout`, { credentials: 'include' });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to fetch checkout');
    }
    return res.json();
};

export const postIndustryCheckout = async () => {
    const res = await fetch(`${INDUSTRY_BASE}/checkout`, { method: 'POST', credentials: 'include' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Checkout failed');
    return data;
};

export const getIndustryDashboard = async () => {
    const res = await fetch(`${INDUSTRY_BASE}/dashboard`, { credentials: 'include' });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to fetch dashboard');
    }
    return res.json();
};

export const industryLogout = async () => {
    const res = await fetch(`${INDUSTRY_BASE}/logout`, { credentials: 'include' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Logout failed');
    return data;
};


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
    const response = await fetch(`${API_BASE_URL}/profile`, {
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Not authenticated');
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        // Received HTML or another content type, treat as unauthenticated
        // Read and discard to free the stream
        await response.text().catch(() => '');
        throw new Error('Not authenticated');
    }
    let data;
    try {
        data = await response.json();
    } catch (e) {
        throw new Error('Not authenticated');
    }
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
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        throw new Error('Backend server is not responding correctly. Please make sure the server is running.');
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
    if (filters.search) params.append('search', filters.search);
    params.append('t', new Date().getTime());

    const response = await fetch(`${API_BASE_URL}/products/filter?${params.toString()}`, {
        credentials: 'include'
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch filtered products');
    }
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        throw new Error('Backend server is not responding correctly. Please make sure the server is running.');
    }
    const data = await response.json();
    return data.products || [];
};

export const searchProducts = async (query) => {
    if (!query || query.trim().length === 0) return [];
    
    const params = new URLSearchParams();
    params.append('search', query.trim());
    params.append('t', new Date().getTime());

    const response = await fetch(`${API_BASE_URL}/products/filter?${params.toString()}`, {
        credentials: 'include'
    });
    
    if (!response.ok) {
        throw new Error('Failed to search products');
    }
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        throw new Error('Backend server is not responding correctly. Please make sure the server is running.');
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

export const apiPredictImage = async (formData) => {
    const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Prediction failed' }));
        throw new Error(errorData.message || 'Prediction failed');
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

export const apiAddToCart = async (productId, size) => { // Accept size param
    const response = await fetch(`${API_BASE_URL}/cart/add/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Content-Type is now required
        },
        body: JSON.stringify({ size }), // Send size in body
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return response.json();
};

export const apiDecreaseQuantity = async (productId, size) => {
    const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ size }),
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to decrease quantity');
    return response.json();
};

export const apiRemoveFromCart = async (productId, size) => {
    const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ size }),
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

// --- BLOG FUNCTIONS ---
/**
 * Fetches all blogs (public endpoint)
 * @returns {Promise<Array>}
 */
export const fetchBlogs = async () => {
    // CHANGED: Use API_BASE_URL (which is /api/v1/user) instead of the hardcoded admin URL
    const response = await fetch(`${API_BASE_URL}/blogs`, {
        credentials: 'include'
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch blogs');
    }
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        throw new Error('Backend server is not responding correctly. Please make sure the server is running.');
    }
    const data = await response.json();
    console.log('Blogs API response:', data);
    
    // Handle multiple response formats
    if (Array.isArray(data)) {
        return data;
    }
    if (data.blogs) {
        return data.blogs;
    }
    if (data.data?.blogs) {
        return data.data.blogs;
    }
    
    return [];
};

// --- INDUSTRY FUNCTIONS ---

const INDUSTRY_API_URL = 'http://localhost:8000/api/v1/industry';

export const industryLogin = async (credentials) => {
    const response = await fetch(`${INDUSTRY_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || 'Login failed');
    }
    return response.json();
};

export const industrySignup = async (data) => {
    const response = await fetch(`${INDUSTRY_API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Signup failed' }));
        throw new Error(errorData.message || 'Signup failed');
    }
    return response.json();
};

export const getIndustryProfile = async () => {
    const response = await fetch(`${INDUSTRY_API_URL}/profile`, {
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Not authenticated');
    return response.json();
};

export const industryLogout = async () => {
    const response = await fetch(`${INDUSTRY_API_URL}/logout`, {
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Logout failed');
    return { success: true };
};

export const getIndustryDashboard = async () => {
    const response = await fetch(`${INDUSTRY_API_URL}/dashboard`, {
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch dashboard data' }));
        throw new Error(errorData.message || 'Failed to fetch dashboard data');
    }
    return response.json();
};

export const fetchIndustryHome = async () => {
    const response = await fetch(`${INDUSTRY_API_URL}/home`, {
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch home data');
    return response.json();
};

export const getIndustryProfileForEdit = async () => {
    const response = await fetch(`${INDUSTRY_API_URL}/profile/edit`, {
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch profile for edit');
    return response.json();
};

export const postIndustryProfileEdit = async (body) => {
    const response = await fetch(`${INDUSTRY_API_URL}/profile/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
};

export const getIndustryCart = async () => {
    const response = await fetch(`${INDUSTRY_API_URL}/cart?t=${Date.now()}`, {
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch cart');
    return response.json();
};

export const postIndustryCart = async (body) => {
    const response = await fetch(`${INDUSTRY_API_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update cart');
    return response.json();
};

export const postIndustryCartDelete = async (body) => {
    const response = await fetch(`${INDUSTRY_API_URL}/cart/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete from cart');
    return response.json();
};

export const getIndustryCheckout = async () => {
    const response = await fetch(`${INDUSTRY_API_URL}/checkout`, {
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch checkout data');
    return response.json();
};

export const postIndustryCheckout = async () => {
    const response = await fetch(`${INDUSTRY_API_URL}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Checkout failed');
    return response.json();
};