// src/store/slices/adminAuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminLogin as apiAdminLogin, adminLogout as apiAdminLogout, checkAuth } from '../../services/adminApi';

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  initialized: false,
};

export const checkAdminAuth = createAsyncThunk('adminAuth/check', async (_, { rejectWithValue }) => {
  try {
    const res = await checkAuth();
    if (res) return true;
    return rejectWithValue('Not authenticated');
  } catch (e) {
    return rejectWithValue(e.message || 'Not authenticated');
  }
});

export const adminLogin = createAsyncThunk('adminAuth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await apiAdminLogin({ email, password });
    if (res?.success) return true;
    return rejectWithValue(res?.message || 'Login failed');
  } catch (e) {
    return rejectWithValue(e?.data?.message || e.message || 'Login failed');
  }
});

export const adminLogout = createAsyncThunk('adminAuth/logout', async (_, { rejectWithValue }) => {
  try {
    const res = await apiAdminLogout();
    if (!res?.success) {
      // Even if server responds non-success, proceed with local cleanup
      console.warn('Server logout did not return success:', res?.message);
    }
    // Local cleanup of persisted state
    try {
      localStorage.removeItem('persist:root');
      Object.keys(localStorage).forEach(k => {
        if (k.toLowerCase().includes('admin')) localStorage.removeItem(k);
      });
    } catch {}
    return true;
  } catch (e) {
    // Proceed with local cleanup despite error
    try {
      localStorage.removeItem('persist:root');
      Object.keys(localStorage).forEach(k => {
        if (k.toLowerCase().includes('admin')) localStorage.removeItem(k);
      });
    } catch {}
    return rejectWithValue(e?.data?.message || e.message || 'Logout failed');
  }
});

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    adminLogoutLocal: (state) => {
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAdminAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAdminAuth.fulfilled, (state) => {
        state.isLoading = false;
        state.initialized = true;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAdminAuth.rejected, (state) => {
        state.isLoading = false;
        state.initialized = true;
        state.isAuthenticated = false;
      })
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(adminLogout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminLogout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(adminLogout.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { adminLogoutLocal } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;

export const selectAdminAuth = (state) => state.adminAuth;
export const selectIsAdminAuthenticated = (state) => state.adminAuth.isAuthenticated;
export const selectAdminAuthLoading = (state) => state.adminAuth.isLoading;
export const selectAdminAuthInitialized = (state) => state.adminAuth.initialized;
export const selectAdminAuthError = (state) => state.adminAuth.error;
