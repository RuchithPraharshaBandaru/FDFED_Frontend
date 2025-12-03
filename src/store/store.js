// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import sellerReducer from './slices/sellerSlice';
import adminReducer from './slices/adminSlice';
import adminAuthReducer from './slices/adminAuthSlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart', 'auth', 'theme', 'seller','admin', 'adminAuth'] // Only persist these reducers
};

const rootReducer = combineReducers({
    cart: cartReducer,
    auth: authReducer,
    theme: themeReducer,
    seller: sellerReducer,
    admin: adminReducer,
    adminAuth: adminAuthReducer
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
