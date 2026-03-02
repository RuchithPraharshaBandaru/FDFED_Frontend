// src/services/sellerApi.js

// const API_BASE_URL = 'http://localhost:8000/api/v1/seller';
const API_BASE_URL = import.meta.env.VITE_SELLER_URL;

// Helper function to handle API responses
const handleApiResponse = async (response) => {
    if (response.status === 302 || !response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch {
            errorData = { error: 'Request failed' };
        }
        throw new Error(errorData.error || errorData.message || 'Request failed');
    }
    return await response.json();
};

// --- AUTH FUNCTIONS ---

export const apiSellerLogin = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
    });
    
    return await handleApiResponse(response);
};

export const apiSellerLogout = async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'GET',
        credentials: 'include',
    });
    
    return await handleApiResponse(response);
};

export const apiSellerSignup = async (formData) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        body: formData, // FormData for file uploads
        credentials: 'include',
    });
    
    return await handleApiResponse(response);
};

// --- ACCOUNT FUNCTIONS ---

export const apiGetSellerProfile = async () => {
    const response = await fetch(`${API_BASE_URL}/account/me`, {
        method: 'GET',
        credentials: 'include',
    });
    
    return await handleApiResponse(response);
};

export const apiUpdateSellerProfile = async (updateData) => {
    const response = await fetch(`${API_BASE_URL}/account`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
        credentials: 'include',
    });
    
    return await handleApiResponse(response);
};

// --- PRODUCT FUNCTIONS ---

export const apiGetSellerProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        credentials: 'include',
    });
    
    return await handleApiResponse(response);
};

export const apiGetProduct = async (id) => {
    const response = await fetch(`${API_BASE_URL}/product/${id}`, {
        method: 'GET',
        credentials: 'include',
    });
    
    return await handleApiResponse(response);
};

export const apiCreateProduct = async (productData) => {
    const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        body: productData, // FormData for file uploads
        credentials: 'include',
    });
    
    return await handleApiResponse(response);
};

export const apiUpdateProduct = async (id, updateData) => {
    const response = await fetch(`${API_BASE_URL}/update/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
        credentials: 'include',
    });
    
    return await handleApiResponse(response);
};

export const apiDeleteProduct = async (id) => {
    const response = await fetch(`${API_BASE_URL}/product/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    
    return await handleApiResponse(response);
};

// --- ORDER FUNCTIONS ---

export const apiGetSellerOrders = async () => {
    const response = await fetch(`${API_BASE_URL}/orders/requests`, {
        method: 'GET',
        credentials: 'include',
    });
    
    return await handleApiResponse(response);
};

export const apiUpdateOrderStatus = async (orderId, orderStatus) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/seller/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderStatus }),
        credentials: 'include',
    });
    
    return await handleApiResponse(response);
};
