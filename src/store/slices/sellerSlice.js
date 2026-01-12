// src/store/slices/sellerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as sellerApi from '../../services/sellerApi';

// Async thunks for seller operations
export const loginSeller = createAsyncThunk(
    'seller/login',
    async (credentials, { rejectWithValue }) => {
        try {
            return await sellerApi.apiSellerLogin(credentials);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logoutSeller = createAsyncThunk(
    'seller/logout',
    async (_, { rejectWithValue }) => {
        try {
            return await sellerApi.apiSellerLogout();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const signupSeller = createAsyncThunk(
    'seller/signup',
    async (formData, { rejectWithValue }) => {
        try {
            return await sellerApi.apiSellerSignup(formData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchSellerProfile = createAsyncThunk(
    'seller/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            return await sellerApi.apiGetSellerProfile();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateSellerProfile = createAsyncThunk(
    'seller/updateProfile',
    async (updateData, { rejectWithValue }) => {
        try {
            return await sellerApi.apiUpdateSellerProfile(updateData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchSellerProducts = createAsyncThunk(
    'seller/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            return await sellerApi.apiGetSellerProducts();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchSellerOrders = createAsyncThunk(
    'seller/fetchOrders',
    async (_, { rejectWithValue }) => {
        try {
            return await sellerApi.apiGetSellerOrders();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    seller: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    products: [],
    orders: [],
    productsLoading: false,
    ordersLoading: false,
};

const sellerSlice = createSlice({
    name: 'seller',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSeller: (state) => {
            state.seller = null;
            state.isAuthenticated = false;
            state.products = [];
            state.soldProducts = [];
            state.error = null;
        },
        updateProduct: (state, action) => {
            const index = state.products.findIndex(p => p._id === action.payload._id);
            if (index !== -1) {
                state.products[index] = action.payload;
            }
        },
        removeProduct: (state, action) => {
            state.products = state.products.filter(p => p._id !== action.payload);
        },
        addProduct: (state, action) => {
            state.products.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginSeller.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginSeller.fulfilled, (state, action) => {
                state.loading = false;
                state.seller = action.payload.seller;
                state.isAuthenticated = true;
            })
            .addCase(loginSeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            // Logout
            .addCase(logoutSeller.fulfilled, (state) => {
                state.seller = null;
                state.isAuthenticated = false;
                state.products = [];
                state.soldProducts = [];
            })
            // Signup
            .addCase(signupSeller.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupSeller.fulfilled, (state, action) => {
                state.loading = false;
                state.seller = action.payload.seller;
                state.isAuthenticated = true;
            })
            .addCase(signupSeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch profile
            .addCase(fetchSellerProfile.fulfilled, (state, action) => {
                state.seller = action.payload.seller;
                state.isAuthenticated = true;
            })
            .addCase(fetchSellerProfile.rejected, (state) => {
                state.isAuthenticated = false;
                state.seller = null;
            })
            // Update profile
            .addCase(updateSellerProfile.fulfilled, (state, action) => {
                state.seller = { ...state.seller, ...action.payload.seller };
            })
            // Fetch products
            .addCase(fetchSellerProducts.pending, (state) => {
                state.productsLoading = true;
            })
            .addCase(fetchSellerProducts.fulfilled, (state, action) => {
                state.productsLoading = false;
                state.products = action.payload.products;
            })
            .addCase(fetchSellerProducts.rejected, (state, action) => {
                state.productsLoading = false;
                state.error = action.payload;
            })
            // Fetch orders
            .addCase(fetchSellerOrders.pending, (state) => {
                state.ordersLoading = true;
            })
            .addCase(fetchSellerOrders.fulfilled, (state, action) => {
                state.ordersLoading = false;
                state.orders = Array.isArray(action.payload.orders) ? action.payload.orders : (Array.isArray(action.payload) ? action.payload : []);
            })
            .addCase(fetchSellerOrders.rejected, (state, action) => {
                state.ordersLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearSeller, updateProduct, removeProduct, addProduct } = sellerSlice.actions;
export default sellerSlice.reducer;