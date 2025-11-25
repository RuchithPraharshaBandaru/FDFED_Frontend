// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiLogin, apiSignup, apiLogout, apiCheckAuth } from '../../services/api';

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false, // Changed back to false - we'll set this when checking auth
    error: null,
    initialized: false // Track if we've checked auth yet
};

// Async thunks
export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiCheckAuth();
            console.log('checkAuth response:', response);
            if (response.success) {
                return {
                    user: response.user,
                    token: response.token
                };
            }
            return rejectWithValue('Not authenticated');
        } catch (error) {
            console.log('checkAuth error:', error);
            return rejectWithValue(error.message || 'Not authenticated');
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await apiLogin(credentials);
            console.log('loginUser response:', response);
            if (response.success) {
                return {
                    user: response.user,
                    token: response.token
                };
            }
            return rejectWithValue(response.message || 'Login failed');
        } catch (error) {
            console.log('loginUser error:', error);
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

export const signupUser = createAsyncThunk(
    'auth/signup',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await apiSignup(userData);
            if (response.success) {
                return {
                    user: response.user,
                    token: response.token
                };
            }
            return rejectWithValue(response.message || 'Signup failed');
        } catch (error) {
            return rejectWithValue(error.message || 'Signup failed');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await apiLogout();
            return null;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Check Auth
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                console.log('CheckAuth fulfilled, payload:', action.payload);
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
                state.initialized = true;
                console.log('Auth state after checkAuth:', { user: state.user, isAuthenticated: state.isAuthenticated });
            })
            .addCase(checkAuth.rejected, (state) => {
                console.log('CheckAuth rejected - user not authenticated');
                state.isLoading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.initialized = true;
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log('Login fulfilled, payload:', action.payload);
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
                console.log('Auth state after login:', { user: state.user, isAuthenticated: state.isAuthenticated });
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Signup
            .addCase(signupUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.isLoading = false;
                // Still logout even if API call fails
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            });
    }
});

export const { setUser, updateUser, clearError } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectToken = (state) => state.auth.token;
export const selectAuthInitialized = (state) => state.auth.initialized;
