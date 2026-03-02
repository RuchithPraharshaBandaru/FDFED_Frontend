// src/store/slices/riderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import riderApi from '../../services/riderApi';

// Initial state
const initialState = {
    rider: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

// Async thunks

export const riderLogin = createAsyncThunk(
    'rider/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await riderApi.riderLogin(credentials);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const riderRegister = createAsyncThunk(
    'rider/register',
    async (riderData, { rejectWithValue }) => {
        try {
            const data = await riderApi.riderRegister(riderData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const checkRiderAuth = createAsyncThunk(
    'rider/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const data = await riderApi.getRiderProfile();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateRiderStatus = createAsyncThunk(
    'rider/updateStatus',
    async (isActive, { rejectWithValue }) => {
        try {
            const data = await riderApi.updateRiderStatus(isActive);
            return { isActive }; // Return the new status
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const riderLogout = createAsyncThunk(
    'rider/logout',
    async (_, { rejectWithValue }) => {
        try {
            // Assuming there might be a logout endpoint, but currently frontend just clears state
            // If backend has logout, call it here. For now, just resolve.
            return true;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice
const riderSlice = createSlice({
    name: 'rider',
    initialState,
    reducers: {
        clearRiderError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(riderLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(riderLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.rider = action.payload.rider;
                state.token = action.payload.token;
            })
            .addCase(riderLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Register
            .addCase(riderRegister.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(riderRegister.fulfilled, (state) => {
                state.loading = false;
                // Registration usually doesn't auto-login unless specified, 
                // but if it does, update state here.
                // For now, assuming it just succeeds and user needs to login.
            })
            .addCase(riderRegister.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Check Auth
            .addCase(checkRiderAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkRiderAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.rider = action.payload.rider;
            })
            .addCase(checkRiderAuth.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.rider = null;
                state.token = null;
            })
            // Update Status
            .addCase(updateRiderStatus.fulfilled, (state, action) => {
                if (state.rider) {
                    state.rider.isActive = action.payload.isActive;
                }
            })
            // Logout
            .addCase(riderLogout.fulfilled, (state) => {
                state.rider = null;
                state.token = null;
                state.isAuthenticated = false;
            });
    },
});

export const { clearRiderError } = riderSlice.actions;

export const selectRider = (state) => state.rider.rider;
export const selectRiderStatus = (state) => state.rider.rider?.isActive;
export const selectIsRiderAuthenticated = (state) => state.rider.isAuthenticated;
export const selectRiderLoading = (state) => state.rider.loading;
export const selectRiderError = (state) => state.rider.error;

export default riderSlice.reducer;
