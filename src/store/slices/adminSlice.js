// src/store/slices/adminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getDashboard,
  getBlogs,
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
  getSellProducts,
  updateSellProductStatus,
  getManagers,
  createManager,
  deleteManager,
  getAnalytics,
} from '../../services/adminApi';

// Thunks
export const fetchDashboard = createAsyncThunk('admin/dashboard', async ({ days = 30, tz = 'UTC' } = {}, { rejectWithValue }) => {
  try {
    const api = await getDashboard(days, tz);
    const data = api.data || api; // some APIs wrap under {data}
    const summary = data.summary || data.metrics || {};
    const series = data.series || {};
    // Normalize various possible keys for top lists
    const rawTop = data.top || {};
    const top = {
      products: rawTop.products || rawTop.topProducts || rawTop.product || [],
      sellers: rawTop.sellers || rawTop.topSellers || rawTop.vendor || rawTop.vendorTop || [],
    };
    const breakdowns = data.breakdowns || {};
    const window = data.window || {};
    return { summary, series, top, breakdowns, window };
  } catch (e) { return rejectWithValue(e.message); }
});

export const fetchBlogs = createAsyncThunk('admin/blogs', async ({ page = 1, limit = 50 } = {}, { rejectWithValue }) => {
  try {
    const data = await getBlogs(page, limit);
    // Support multiple response shapes:
    // 1) { items, total }
    // 2) { blogs }
    // 3) { success, data: { items, total, page, limit } }
    const payload = data?.data && typeof data.data === 'object' ? data.data : data;
    const items = payload.blogs || payload.items || [];
    const total = typeof payload.total === 'number' ? payload.total : items.length;
    const currentPage = typeof payload.page === 'number' ? payload.page : page;
    const currentLimit = typeof payload.limit === 'number' ? payload.limit : limit;
    return { items, total, page: currentPage, limit: currentLimit };
  } catch (e) { return rejectWithValue(e.message); }
});

export const addBlog = createAsyncThunk('admin/blogs/add', async (formData, { rejectWithValue }) => {
  try { return (await createBlog(formData)).data?.blog; } catch (e) { return rejectWithValue(e?.data?.message || e.message); }
});

export const fetchCustomers = createAsyncThunk('admin/customers', async ({ page = 1, limit = 50 } = {}, { rejectWithValue }) => {
  try {
    const data = await getCustomers(page, limit);
    const payload = data?.data && typeof data.data === 'object' ? data.data : data;
    const items = payload.customers || payload.items || [];
    const total = typeof payload.total === 'number' ? payload.total : items.length;
    const currentPage = typeof payload.page === 'number' ? payload.page : page;
    const currentLimit = typeof payload.limit === 'number' ? payload.limit : limit;
    return { items, total, page: currentPage, limit: currentLimit };
  } catch (e) { return rejectWithValue(e.message); }
});

export const removeCustomer = createAsyncThunk('admin/customers/delete', async (id, { rejectWithValue }) => {
  try { await deleteCustomer(id); return id; } catch (e) { return rejectWithValue(e?.data?.message || e.message); }
});

export const fetchProductsAdminThunk = createAsyncThunk('admin/products', async ({ page = 1, limit = 50 } = {}, { rejectWithValue }) => {
  try {
    const data = await getProductsAdmin(page, limit);
    const payload = data?.data && typeof data.data === 'object' ? data.data : data;
    const items = payload.products || payload.items || [];
    const total = typeof payload.total === 'number' ? payload.total : items.length;
    const currentPage = typeof payload.page === 'number' ? payload.page : page;
    const currentLimit = typeof payload.limit === 'number' ? payload.limit : limit;
    return { items, total, page: currentPage, limit: currentLimit };
  } catch (e) { return rejectWithValue(e.message); }
});

export const removeProduct = createAsyncThunk('admin/products/delete', async (id, { rejectWithValue }) => {
  try { await deleteProduct(id); return id; } catch (e) { return rejectWithValue(e?.data?.message || e.message); }
});

export const setProductApproved = createAsyncThunk('admin/products/approve', async ({ id, approved }, { rejectWithValue }) => {
  try { approved ? await approveProduct(id) : await disapproveProduct(id); return { id, approved }; } catch (e) { return rejectWithValue(e?.data?.message || e.message); }
});

export const fetchSellersThunk = createAsyncThunk('admin/sellers', async ({ page = 1, limit = 50 } = {}, { rejectWithValue }) => {
  try {
    const data = await getSellers(page, limit);
    const payload = data?.data && typeof data.data === 'object' ? data.data : data;
    const items = payload.sellers || payload.items || [];
    const total = typeof payload.total === 'number' ? payload.total : items.length;
    const currentPage = typeof payload.page === 'number' ? payload.page : page;
    const currentLimit = typeof payload.limit === 'number' ? payload.limit : limit;
    return { items, total, page: currentPage, limit: currentLimit };
  } catch (e) { return rejectWithValue(e.message); }
});

export const fetchVendorsThunk = createAsyncThunk('admin/vendors', async ({ page = 1, limit = 50 } = {}, { rejectWithValue }) => {
  try { return (await getVendors(page, limit)).data; } catch (e) { return rejectWithValue(e.message); }
});

export const approveSellerThunk = createAsyncThunk('admin/sellers/approve', async (id, { rejectWithValue }) => {
  try { await approveSeller(id); return id; } catch (e) { return rejectWithValue(e?.data?.message || e.message); }
});

export const deleteSellerThunk = createAsyncThunk('admin/sellers/delete', async (id, { rejectWithValue }) => {
  try { await deleteSeller(id); return id; } catch (e) { return rejectWithValue(e?.data?.message || e.message); }
});

export const fetchOrdersThunk = createAsyncThunk('admin/orders', async ({ page = 1, limit = 50 } = {}, { rejectWithValue }) => {
  try {
    const data = await getOrders(page, limit);
    const payload = data?.data && typeof data.data === 'object' ? data.data : data;
    // API may return array OR map keyed by userId
    let raw = payload.items || payload.orders || payload;
    let items;
    if (Array.isArray(raw)) items = raw;
    else if (raw && typeof raw === 'object') {
      items = Object.entries(raw).map(([id, val]) => ({ _id: id, ...val }));
    } else items = [];
    const total = typeof payload.total === 'number' ? payload.total : items.length;
    const currentPage = typeof payload.page === 'number' ? payload.page : page;
    const currentLimit = typeof payload.limit === 'number' ? payload.limit : limit;
    return { items, total, page: currentPage, limit: currentLimit };
  } catch (e) { return rejectWithValue(e.message); }
});

export const fetchOrdersByUserThunk = createAsyncThunk('admin/ordersByUser', async ({ userId, page = 1, limit = 50 }, { rejectWithValue }) => {
  try { return { userId, data: (await getOrdersByUser(userId, page, limit)).data }; } catch (e) { return rejectWithValue(e.message); }
});

export const updateOrderStatusThunk = createAsyncThunk('admin/orders/updateStatus', async ({ orderId, orderStatus }, { rejectWithValue }) => {
  try { return (await updateOrderStatus(orderId, orderStatus)).data?.order || { _id: orderId, orderStatus }; } catch (e) { return rejectWithValue(e?.data?.message || e.message); }
});

export const fetchSellProductsThunk = createAsyncThunk('admin/sellProducts', async ({ page = 1, limit = 50 } = {}, { rejectWithValue }) => {
  try { return (await getSellProducts(page, limit)).data; } catch (e) { return rejectWithValue(e.message); }
});

export const updateSellProductStatusThunk = createAsyncThunk('admin/sellProducts/update', async ({ id, userStatus }, { rejectWithValue }) => {
  try { await updateSellProductStatus(id, userStatus); return { id, userStatus }; } catch (e) { return rejectWithValue(e?.data?.message || e.message); }
});

export const fetchManagersThunk = createAsyncThunk('admin/managers', async ({ page = 1, limit = 50 } = {}, { rejectWithValue }) => {
  try {
    const data = await getManagers(page, limit);
    const payload = data?.data && typeof data.data === 'object' ? data.data : data;
    const items = payload.managers || payload.items || [];
    const total = typeof payload.total === 'number' ? payload.total : items.length;
    const currentPage = typeof payload.page === 'number' ? payload.page : page;
    const currentLimit = typeof payload.limit === 'number' ? payload.limit : limit;
    return { items, total, page: currentPage, limit: currentLimit };
  } catch (e) { return rejectWithValue(e.message); }
});

export const createManagerThunk = createAsyncThunk('admin/managers/create', async ({ email, password }, { rejectWithValue }) => {
  try { await createManager({ email, password }); return { email }; } catch (e) { return rejectWithValue(e?.data?.message || e.message); }
});

export const deleteManagerThunk = createAsyncThunk('admin/managers/delete', async (id, { rejectWithValue }) => {
  try { await deleteManager(id); return id; } catch (e) { return rejectWithValue(e?.data?.message || e.message); }
});

export const fetchAnalyticsThunk = createAsyncThunk('admin/analytics', async (params, { rejectWithValue }) => {
  try { return (await getAnalytics(params)).data; } catch (e) { return rejectWithValue(e.message); }
});

const emptyList = () => ({ items: [], total: 0, page: 1, limit: 50, loading: false, error: null });

const initialState = {
  dashboard: {
    metrics: null,
    series: {
      usersCreated: [
        { date: '2025-11-27', value: 3, label: 'usersCreated' },
        { date: '2025-11-28', value: 5, label: 'usersCreated' },
        { date: '2025-11-29', value: 2, label: 'usersCreated' },
        { date: '2025-11-30', value: 4, label: 'usersCreated' },
        { date: '2025-12-01', value: 6, label: 'usersCreated' },
        { date: '2025-12-02', value: 1, label: 'usersCreated' },
        { date: '2025-12-03', value: 0, label: 'usersCreated' },
      ],
      productsAdded: [
        { date: '2025-11-27', value: 1, label: 'productsAdded' },
        { date: '2025-11-28', value: 2, label: 'productsAdded' },
        { date: '2025-11-29', value: 0, label: 'productsAdded' },
        { date: '2025-11-30', value: 3, label: 'productsAdded' },
        { date: '2025-12-01', value: 1, label: 'productsAdded' },
        { date: '2025-12-02', value: 2, label: 'productsAdded' },
        { date: '2025-12-03', value: 0, label: 'productsAdded' },
      ],
      ordersCount: [
        { date: '2025-11-27', value: 12, label: 'ordersCount' },
        { date: '2025-11-28', value: 8, label: 'ordersCount' },
        { date: '2025-11-29', value: 10, label: 'ordersCount' },
        { date: '2025-11-30', value: 15, label: 'ordersCount' },
        { date: '2025-12-01', value: 7, label: 'ordersCount' },
        { date: '2025-12-02', value: 9, label: 'ordersCount' },
        { date: '2025-12-03', value: 11, label: 'ordersCount' },
      ],
      revenue: [
        { date: '2025-11-27', value: 1234, label: 'revenue' },
        { date: '2025-11-28', value: 2450, label: 'revenue' },
        { date: '2025-11-29', value: 980, label: 'revenue' },
        { date: '2025-11-30', value: 3150, label: 'revenue' },
        { date: '2025-12-01', value: 2110, label: 'revenue' },
        { date: '2025-12-02', value: 1675, label: 'revenue' },
        { date: '2025-12-03', value: 0, label: 'revenue' },
      ],
    },
    top: { products: [], sellers: [] },
    breakdowns: null,
    window: null,
    users: emptyList(),
    products: emptyList(),
    registeredProducts: emptyList(),
    loading: false,
    error: null,
  },
  blogs: emptyList(),
  customers: emptyList(),
  products: emptyList(),
  sellers: emptyList(),
  vendors: emptyList(),
  orders: emptyList(),
  userOrders: {}, // map userId -> list shape
  sellProducts: emptyList(),
  managers: emptyList(),
  analytics: { summary: null, items: [], total: 0, page: 1, limit: 50, loading: false, error: null },
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchDashboard.pending, (s) => { s.dashboard.loading = true; s.dashboard.error = null; })
      .addCase(fetchDashboard.fulfilled, (s, a) => {
        s.dashboard.loading = false;
        s.dashboard.metrics = a.payload.summary || null;
        s.dashboard.series = a.payload.series || null;
        s.dashboard.top = a.payload.top || { products: [], sellers: [] };
        s.dashboard.breakdowns = a.payload.breakdowns || null;
        s.dashboard.window = a.payload.window || null;
      })
      .addCase(fetchDashboard.rejected, (s, a) => { s.dashboard.loading = false; s.dashboard.error = a.payload || a.error?.message; })

      // Blogs
      .addCase(fetchBlogs.pending, (s) => { s.blogs.loading = true; s.blogs.error = null; })
      .addCase(fetchBlogs.fulfilled, (s, a) => { s.blogs = { ...a.payload, loading: false, error: null }; })
      .addCase(fetchBlogs.rejected, (s, a) => { s.blogs.loading = false; s.blogs.error = a.payload; })
      .addCase(addBlog.fulfilled, (s, a) => { if (a.payload) s.blogs.items.unshift(a.payload); })

      // Customers
      .addCase(fetchCustomers.fulfilled, (s, a) => { s.customers = { ...a.payload, loading: false, error: null }; })
      .addCase(fetchCustomers.pending, (s) => { s.customers.loading = true; s.customers.error = null; })
      .addCase(fetchCustomers.rejected, (s, a) => { s.customers.loading = false; s.customers.error = a.payload; })
      .addCase(removeCustomer.fulfilled, (s, a) => { s.customers.items = s.customers.items.filter(u => u._id !== a.payload); })

      // Products
      .addCase(fetchProductsAdminThunk.pending, (s) => { s.products.loading = true; s.products.error = null; })
      .addCase(fetchProductsAdminThunk.fulfilled, (s, a) => { s.products = { ...a.payload, loading: false, error: null }; })
      .addCase(fetchProductsAdminThunk.rejected, (s, a) => { s.products.loading = false; s.products.error = a.payload; })
      .addCase(removeProduct.fulfilled, (s, a) => { s.products.items = s.products.items.filter(p => p._id !== a.payload); })
      .addCase(setProductApproved.fulfilled, (s, a) => { const p = s.products.items.find(p => p._id === a.payload.id); if (p) p.verified = !!a.payload.approved; })

      // Sellers & Vendors
      .addCase(fetchSellersThunk.pending, (s) => { s.sellers.loading = true; s.sellers.error = null; })
      .addCase(fetchSellersThunk.fulfilled, (s, a) => { s.sellers = { ...a.payload, loading: false, error: null }; })
      .addCase(fetchSellersThunk.rejected, (s, a) => { s.sellers.loading = false; s.sellers.error = a.payload; })
      .addCase(fetchVendorsThunk.fulfilled, (s, a) => { s.vendors = { ...a.payload, loading: false, error: null }; })
      .addCase(approveSellerThunk.fulfilled, (s, a) => { /* optional local mark */ })
      .addCase(deleteSellerThunk.fulfilled, (s, a) => { s.sellers.items = s.sellers.items.filter(x => x._id !== a.payload); })

      // Orders
      .addCase(fetchOrdersThunk.pending, (s) => { s.orders.loading = true; s.orders.error = null; })
      .addCase(fetchOrdersThunk.fulfilled, (s, a) => { s.orders = { ...a.payload, loading: false, error: null }; })
      .addCase(fetchOrdersThunk.rejected, (s, a) => { s.orders.loading = false; s.orders.error = a.payload; })
      .addCase(fetchOrdersByUserThunk.fulfilled, (s, a) => { s.userOrders[a.payload.userId] = { ...a.payload.data, loading: false, error: null }; })
      .addCase(updateOrderStatusThunk.fulfilled, (s, a) => {
        const updated = a.payload; // {_id, orderStatus}
        // update in orders.items if present
        s.orders.items.forEach((u) => {
          (u.orders || []).forEach((o) => { if (o._id === updated._id) o.orderStatus = updated.orderStatus; });
        });
        // also attempt in any userOrders maps
        Object.values(s.userOrders).forEach((list) => {
          (list?.items || []).forEach((o) => { if (o._id === updated._id) o.orderStatus = updated.orderStatus; });
        });
      })

      // Sell Products
      .addCase(fetchSellProductsThunk.pending, (s) => { s.sellProducts.loading = true; s.sellProducts.error = null; })
      .addCase(fetchSellProductsThunk.fulfilled, (s, a) => { s.sellProducts = { ...a.payload, loading: false, error: null }; })
      .addCase(fetchSellProductsThunk.rejected, (s, a) => { s.sellProducts.loading = false; s.sellProducts.error = a.payload; })
      .addCase(updateSellProductStatusThunk.fulfilled, (s, a) => {
        const r = s.sellProducts.items.find(i => (i._id === a.payload.id) || (i.id === a.payload.id));
        if (r) r.userStatus = a.payload.userStatus;
      })

      // Managers
      .addCase(fetchManagersThunk.pending, (s) => { s.managers.loading = true; s.managers.error = null; })
      .addCase(fetchManagersThunk.fulfilled, (s, a) => { s.managers = { ...a.payload, loading: false, error: null }; })
      .addCase(fetchManagersThunk.rejected, (s, a) => { s.managers.loading = false; s.managers.error = a.payload; })
      .addCase(createManagerThunk.fulfilled, (s) => { /* server provides no item; list will refresh on next load */ })
      .addCase(deleteManagerThunk.fulfilled, (s, a) => { s.managers.items = s.managers.items.filter(m => m._id !== a.payload); })

      // Analytics
      .addCase(fetchAnalyticsThunk.pending, (s) => { s.analytics.loading = true; s.analytics.error = null; })
      .addCase(fetchAnalyticsThunk.fulfilled, (s, a) => { s.analytics = { ...a.payload, loading: false, error: null }; })
      .addCase(fetchAnalyticsThunk.rejected, (s, a) => { s.analytics.loading = false; s.analytics.error = a.payload; });
  }
});

export default adminSlice.reducer;

// Selectors
export const selectAdminDashboard = (s) => s.admin.dashboard;
export const selectAdminBlogs = (s) => s.admin.blogs;
export const selectAdminCustomers = (s) => s.admin.customers;
export const selectAdminProducts = (s) => s.admin.products;
export const selectAdminSellers = (s) => s.admin.sellers;
export const selectAdminVendors = (s) => s.admin.vendors;
export const selectAdminOrders = (s) => s.admin.orders;
export const selectAdminUserOrders = (s, userId) => s.admin.userOrders[userId];
export const selectAdminSellProducts = (s) => s.admin.sellProducts;
export const selectAdminManagers = (s) => s.admin.managers;
export const selectAdminAnalytics = (s) => s.admin.analytics;
