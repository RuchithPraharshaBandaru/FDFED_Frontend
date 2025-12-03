// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import industryReducer from './slices/industrySlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart', 'auth', 'theme'] // Only persist these reducers
};

const rootReducer = combineReducers({
    cart: cartReducer,
    auth: authReducer,
    theme: themeReducer
    , industry: industryReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);
