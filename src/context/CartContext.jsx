// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { apiGetCart, apiAddToCart, apiDecreaseQuantity, apiRemoveFromCart } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0); // This was missing
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    // Helper function to calculate totals from cart items
    const calculateCartTotals = (items) => {
        // Filter out items where productId is null (deleted product)
        const validItems = items.filter(item => item.productId);
        const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = validItems.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
        
        setCartItems(validItems);
        setCartCount(totalItems);
        setCartTotal(totalPrice); // This fixes the .toFixed crash
    };

    // Fetches the full cart data from the API
    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            setCartItems([]);
            setCartCount(0);
            setCartTotal(0);
            return;
        }
        setLoading(true);
        try {
            const data = await apiGetCart(); // This returns { cart: [...] }
            calculateCartTotals(data.cart);
        } catch (error) {
            console.error("Failed to get cart:", error);
            setCartItems([]);
            setCartCount(0);
            setCartTotal(0);
        }
        setLoading(false);
    }, [isAuthenticated]);

    // Load cart on auth change
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // --- Public Functions (These fix the "Add to Cart" bug) ---

    const addToCart = async (product) => {
        try {
            await apiAddToCart(product._id);
            await fetchCart(); // Refresh cart from server
        } catch (error) {
            console.error("Failed to add to cart:", error);
        }
    };

    const decreaseQuantity = async (productId) => {
        try {
            await apiDecreaseQuantity(productId);
            await fetchCart(); // Refresh cart from server
        } catch (error) {
            console.error("Failed to decrease quantity:", error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await apiRemoveFromCart(productId);
            await fetchCart(); // Refresh cart from server
        } catch (error) {
            console.error("Failed to remove from cart:", error);
        }
    };

    // This is for the checkout page
    const clearCartCount = () => {
        setCartItems([]);
        setCartCount(0);
        setCartTotal(0);
    };

    // All the values your app needs
    const value = {
        cartItems,
        cartCount,
        cartTotal,
        loading,
        fetchCart,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCartCount,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};