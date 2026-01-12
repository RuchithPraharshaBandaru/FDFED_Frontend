import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { industryLogin, industrySignup, getIndustryProfile, industryLogout } from '../../services/api';

const initialState = {
    industry: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    initialized: false
};

export const industryLoginThunk = createAsyncThunk(
    'industry/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const res = await industryLogin(credentials);
            return res.industry || res;
        } catch (err) {
            return rejectWithValue(err.message || 'Login failed');
        }
    }
);

export const industrySignupThunk = createAsyncThunk(
    'industry/signup',
    async (data, { rejectWithValue }) => {
        try {
            const res = await industrySignup(data);
            return res.industry || res;
        } catch (err) {
            return rejectWithValue(err.message || 'Signup failed');
        }
    }
);

export const industryCheckAuth = createAsyncThunk(
    'industry/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const res = await getIndustryProfile();
            return res || null;
        } catch (err) {
            return rejectWithValue(err.message || 'Not authenticated');
        }
    }
);

export const industryLogoutThunk = createAsyncThunk(
    'industry/logout',
    async (_, { rejectWithValue }) => {
        try {
            const res = await industryLogout();
            return res;
        } catch (err) {
            return rejectWithValue(err.message || 'Logout failed');
        }
    }
);

const industrySlice = createSlice({
    name: 'industry',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(industryLoginThunk.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(industryLoginThunk.fulfilled, (state, action) => { state.isLoading = false; state.industry = action.payload; state.isAuthenticated = true; state.initialized = true; })
            .addCase(industryLoginThunk.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; state.isAuthenticated = false; state.initialized = true; })

            .addCase(industrySignupThunk.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(industrySignupThunk.fulfilled, (state, action) => { state.isLoading = false; state.industry = action.payload; state.isAuthenticated = true; state.initialized = true; })
            .addCase(industrySignupThunk.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; state.isAuthenticated = false; state.initialized = true; })

            .addCase(industryCheckAuth.pending, (state) => { state.isLoading = true; })
            .addCase(industryCheckAuth.fulfilled, (state, action) => { state.isLoading = false; state.industry = action.payload; state.isAuthenticated = !!action.payload; state.initialized = true; })
            .addCase(industryCheckAuth.rejected, (state) => { state.isLoading = false; state.industry = null; state.isAuthenticated = false; state.initialized = true; })

            .addCase(industryLogoutThunk.pending, (state) => { state.isLoading = true; })
            .addCase(industryLogoutThunk.fulfilled, (state) => { state.isLoading = false; state.industry = null; state.isAuthenticated = false; })
            .addCase(industryLogoutThunk.rejected, (state) => { state.isLoading = false; state.industry = null; state.isAuthenticated = false; });
    }
});

export default industrySlice.reducer;

// Selectors
export const selectIndustry = (state) => state.industry.industry;
export const selectIndustryIsAuthenticated = (state) => state.industry.isAuthenticated;
export const selectIndustryInitialized = (state) => state.industry.initialized;
