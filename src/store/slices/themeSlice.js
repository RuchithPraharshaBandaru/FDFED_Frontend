// src/store/slices/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    mode: 'light' // 'light' or 'dark'
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
            
            // Update DOM
            const root = document.documentElement;
            if (state.mode === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        },
        setTheme: (state, action) => {
            state.mode = action.payload;
            
            // Update DOM
            const root = document.documentElement;
            if (state.mode === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    }
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;

// Selectors
export const selectTheme = (state) => state.theme.mode;
