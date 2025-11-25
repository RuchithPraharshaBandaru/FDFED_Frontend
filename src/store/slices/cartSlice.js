// src/store/slices/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiAddToCart, apiRemoveFromCart, apiDecreaseQuantity, apiGetCart } from '../../services/api';
import { logoutUser } from './authSlice';

const initialState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    isLoading: false
};

// --- NEW THUNK TO FETCH CART FROM DB ---
export const fetchCartItems = createAsyncThunk(
    'cart/fetchCartItems',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetCart();
            // The backend returns nested objects: { productId: {...}, quantity: 2 }
            // We need to map this to the flat structure your Redux slice expects.
            if (response && response.cart) {
                return response.cart
                    .filter(item => item.productId) // Filter out null products
                    .map(item => ({
                        ...item.productId, // Spread product details (title, price, image, etc.)
                        _id: item.productId._id, // Ensure _id is the product ID
                        quantity: item.quantity,
                        totalPrice: item.productId.price * item.quantity
                    }));
            }
            return [];
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunks for backend sync
export const addToCartAsync = createAsyncThunk(
    'cart/addToCartAsync',
    async (product, { rejectWithValue }) => {
        try {
            await apiAddToCart(product._id);
            return product;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeFromCartAsync = createAsyncThunk(
    'cart/removeFromCartAsync',
    async (productId, { rejectWithValue }) => {
        try {
            await apiRemoveFromCart(productId);
            return productId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const decrementQuantityAsync = createAsyncThunk(
    'cart/decrementQuantityAsync',
    async (productId, { rejectWithValue }) => {
        try {
            await apiDecreaseQuantity(productId);
            return productId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item._id === newItem._id);
            
            if (existingItem) {
                existingItem.quantity++;
                existingItem.totalPrice += newItem.price;
            } else {
                state.items.push({
                    ...newItem,
                    quantity: 1,
                    totalPrice: newItem.price
                });
            }
            
            state.totalQuantity++;
            state.totalAmount += newItem.price;
        },
        
        removeFromCart: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item._id === id);
            
            if (existingItem) {
                state.totalQuantity -= existingItem.quantity;
                state.totalAmount -= existingItem.totalPrice;
                state.items = state.items.filter(item => item._id !== id);
            }
        },
        
        incrementQuantity: (state, action) => {
            const id = action.payload;
            const item = state.items.find(item => item._id === id);
            
            if (item) {
                item.quantity++;
                item.totalPrice += item.price;
                state.totalQuantity++;
                state.totalAmount += item.price;
            }
        },
        
        decrementQuantity: (state, action) => {
            const id = action.payload;
            const item = state.items.find(item => item._id === id);
            
            if (item && item.quantity > 1) {
                item.quantity--;
                item.totalPrice -= item.price;
                state.totalQuantity--;
                state.totalAmount -= item.price;
            }
        },
        
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        },
        
        // For syncing with backend
        setCart: (state, action) => {
            const { items } = action.payload;
            state.items = items;
            state.totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
            state.totalAmount = items.reduce((total, item) => total + item.totalPrice, 0);
        }
    },
    extraReducers: (builder) => {
        builder
            // --- NEW HANDLERS FOR FETCH CART ITEMS ---
            .addCase(fetchCartItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
                // Recalculate totals based on the fetched items
                state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
                state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
            })
            .addCase(fetchCartItems.rejected, (state) => {
                state.isLoading = false;
            })

            // Add to cart async
            .addCase(addToCartAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                const newItem = action.payload;
                const existingItem = state.items.find(item => item._id === newItem._id);
                
                if (existingItem) {
                    existingItem.quantity++;
                    existingItem.totalPrice += newItem.price;
                } else {
                    state.items.push({
                        ...newItem,
                        quantity: 1,
                        totalPrice: newItem.price
                    });
                }
                
                state.totalQuantity++;
                state.totalAmount += newItem.price;
            })
            .addCase(addToCartAsync.rejected, (state) => {
                state.isLoading = false;
            })
            // Remove from cart async
            .addCase(removeFromCartAsync.fulfilled, (state, action) => {
                const id = action.payload;
                const existingItem = state.items.find(item => item._id === id);
                
                if (existingItem) {
                    state.totalQuantity -= existingItem.quantity;
                    state.totalAmount -= existingItem.totalPrice;
                    state.items = state.items.filter(item => item._id !== id);
                }
            })
            // Decrement quantity async
            .addCase(decrementQuantityAsync.fulfilled, (state, action) => {
                const id = action.payload;
                const item = state.items.find(item => item._id === id);
                
                if (item && item.quantity > 1) {
                    item.quantity--;
                    item.totalPrice -= item.price;
                    state.totalQuantity--;
                    state.totalAmount -= item.price;
                } else if (item && item.quantity === 1) {
                    // Remove item if quantity becomes 0
                    state.totalQuantity--;
                    state.totalAmount -= item.price;
                    state.items = state.items.filter(i => i._id !== id);
                }
            })
            // Clear cart on logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.items = [];
                state.totalQuantity = 0;
                state.totalAmount = 0;
                state.isLoading = false;
            });
    }
});

export const { 
    addToCart, 
    removeFromCart, 
    incrementQuantity, 
    decrementQuantity, 
    clearCart,
    setCart 
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalQuantity = (state) => state.cart.totalQuantity;
export const selectCartTotalAmount = (state) => state.cart.totalAmount;
export const selectCartLoading = (state) => state.cart.isLoading;