// src/services/adminApi.js

// const ADMIN_BASE = 'http://localhost:8000/api/v1/admin';
const ADMIN_BASE = import.meta.env.VITE_ADMIN_URL;

const jsonHeaders = { 'Content-Type': 'application/json' };

const handleJson = async (res) => {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    console.error("API Error:", res.status, data);
    const msg = data?.message || `Request failed (${res.status})`;
    const err = new Error(msg);
    err.data = data;
    err.status = res.status;
    throw err;
  }
  return data;
};

// Auth
export const adminLogin = async ({ email, password }) => {
  const res = await fetch(`${ADMIN_BASE}/login`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  return handleJson(res);
};

export const adminLogout = async () => {
  const res = await fetch(`${ADMIN_BASE}/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  return handleJson(res);
};

export const checkAuth = async () => {
  const res = await fetch(`${ADMIN_BASE}/check-auth`, { credentials: 'include' });
  return handleJson(res);
};

export const getLoginPage = async (error) => {
  const url = new URL(`${ADMIN_BASE}/login`, window.location.origin);
  if (error) url.searchParams.set('error', error);
  const res = await fetch(url.toString().replace(window.location.origin, ''), { credentials: 'include' });
  return handleJson(res);
};

export const getDashboard = async (days = 30, tz = 'UTC') => {
  const res = await fetch(`${ADMIN_BASE}/dashboard?days=${days}&tz=${tz}`, { credentials: 'include' });
  return handleJson(res);
};

// Blogs
export const getBlogs = async (page = 1, limit = 50) => {
  const res = await fetch(`${ADMIN_BASE}/blogs?page=${page}&limit=${limit}`, { credentials: 'include' });
  return handleJson(res);
};

export const getBlogsPage = async (page = 1, limit = 50) => {
  const res = await fetch(`${ADMIN_BASE}/blogs/page?page=${page}&limit=${limit}`, { credentials: 'include' });
  return handleJson(res);
};

export const createBlog = async (formData) => {
  const res = await fetch(`${ADMIN_BASE}/blog`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  return handleJson(res);
};

// Customers
export const getCustomers = async (page = 1, limit = 50) => {
  const res = await fetch(`${ADMIN_BASE}/customers?page=${page}&limit=${limit}`, { credentials: 'include' });
  return handleJson(res);
};

export const deleteCustomer = async (id) => {
  const res = await fetch(`${ADMIN_BASE}/customers/${id}`, { method: 'DELETE', credentials: 'include' });
  return handleJson(res);
};

// Products
export const getProductsAdmin = async (page = 1, limit = 50) => {
  const res = await fetch(`${ADMIN_BASE}/products?page=${page}&limit=${limit}`, { credentials: 'include' });
  return handleJson(res);
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${ADMIN_BASE}/products/${id}`, { method: 'DELETE', credentials: 'include' });
  return handleJson(res);
};

export const approveProduct = async (id) => {
  const res = await fetch(`${ADMIN_BASE}/products/${id}/approval`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify({ approved: true }),
    credentials: 'include',
  });
  return handleJson(res);
};

export const disapproveProduct = async (id) => {
  const res = await fetch(`${ADMIN_BASE}/products/${id}/approval`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify({ approved: false }),
    credentials: 'include',
  });
  return handleJson(res);
};

// Sellers & Vendors
export const getSellers = async (page = 1, limit = 50) => {
  const res = await fetch(`${ADMIN_BASE}/sellers?page=${page}&limit=${limit}`, { credentials: 'include' });
  return handleJson(res);
};

// Deprecated: Mapped to getSellers
export const getVendors = getSellers;

export const approveSeller = async (id) => {
  const res = await fetch(`${ADMIN_BASE}/sellers/${id}/approve`, { method: 'PUT', credentials: 'include' });
  return handleJson(res);
};

export const deleteSeller = async (id) => {
  const res = await fetch(`${ADMIN_BASE}/sellers/${id}`, { method: 'DELETE', credentials: 'include' });
  return handleJson(res);
};

// Orders
export const getOrders = async (page = 1, limit = 50) => {
  const res = await fetch(`${ADMIN_BASE}/orders?page=${page}&limit=${limit}`, { credentials: 'include' });
  return handleJson(res);
};

export const getOrdersByUser = async (userId, page = 1, limit = 50) => {
  const res = await fetch(`${ADMIN_BASE}/orders/${userId}?page=${page}&limit=${limit}`, { credentials: 'include' });
  return handleJson(res);
};

export const updateOrderStatus = async (orderId, orderStatus) => {
  const res = await fetch(`${ADMIN_BASE}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify({ orderStatus }),
    credentials: 'include',
  });
  return handleJson(res);
};

export const getOrderUser = async (orderId) => {
  const res = await fetch(`${ADMIN_BASE}/orders/user/${orderId}`, { credentials: 'include' });
  return handleJson(res);
};

// Second-hand (Sell Product)
export const getSellProducts = async (page = 1, limit = 50) => {
  const res = await fetch(`${ADMIN_BASE}/secondhand-products?page=${page}&limit=${limit}`, { credentials: 'include' });
  return handleJson(res);
};

export const updateSellProductStatus = async (id, userStatus) => {
  console.log(`Updating status for ${id} to ${userStatus}`);
  const url = `${ADMIN_BASE}/secondhand-products/${id}/status`;
  console.log(`PUT ${url}`);
  const res = await fetch(url, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify({ status: userStatus }),
    credentials: 'include',
  });
  return handleJson(res);
};

// Managers
export const getManagers = async (page = 1, limit = 50) => {
  const res = await fetch(`${ADMIN_BASE}/managers?page=${page}&limit=${limit}`, { credentials: 'include' });
  return handleJson(res);
};

export const createManager = async ({ email, password }) => {
  const res = await fetch(`${ADMIN_BASE}/managers`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  return handleJson(res);
};

export const deleteManager = async (id) => {
  const res = await fetch(`${ADMIN_BASE}/managers/${id}`, { method: 'DELETE', credentials: 'include' });
  return handleJson(res);
};

// Delivery placeholder
export const getDelivery = async () => {
  const res = await fetch(`${ADMIN_BASE}/delivery`, { credentials: 'include' });
  return handleJson(res);
};

// Analytics
export const getAnalytics = async ({ from, to, page = 1, limit = 50 }) => {
  const url = new URL(`${ADMIN_BASE}/analytics`, window.location.origin);
  if (from) url.searchParams.set('from', from);
  if (to) url.searchParams.set('to', to);
  url.searchParams.set('page', String(page));
  url.searchParams.set('limit', String(limit));
  const path = url.toString().replace(window.location.origin, '');
  const res = await fetch(path, { credentials: 'include' });
  return handleJson(res);
};

export default {
  adminLogin,
  adminLogout,
  checkAuth,
  getLoginPage,
  getDashboard,
  getBlogs,
  getBlogsPage,
  createBlog,
  getCustomers,
  deleteCustomer,
  getProductsAdmin,
  deleteProduct,
  approveProduct,
  disapproveProduct,
  getSellers,
  getVendors,
  approveSeller,
  deleteSeller,
  getOrders,
  getOrdersByUser,
  updateOrderStatus,
  getOrderUser,
  getSellProducts,
  updateSellProductStatus,
  getManagers,
  createManager,
  deleteManager,
  getDelivery,
  getAnalytics,
};
