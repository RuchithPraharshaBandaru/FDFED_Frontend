import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
    return useContext(CartContext);
};

// Provider component
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Load cart from local storage on initial render
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Could not parse cart items from localStorage", error);
            return [];
        }
    });

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prevItems => {
            // Check if item already exists
            const existingItem = prevItems.find(item => item._id === product._id);
            if (existingItem) {
                // If it exists, map over the array and update the quantity of the matching item
                return prevItems.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            // If it's a new item, add it to the array with a quantity of 1
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const decreaseQuantity = (productId) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === productId);

            // If item quantity is 1, filtering it out is the same as decreasing quantity
            if (existingItem && existingItem.quantity === 1) {
                return prevItems.filter(item => item._id !== productId);
            }

            // Otherwise, decrease the quantity by 1
            return prevItems.map(item =>
                item._id === productId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            );
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
    };

    // Total number of individual items in the cart (e.g., 2 shirts + 1 jean = 3 items)
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    // Total price of all items in the cart, accounting for quantity
    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const value = {
        cartItems,
        addToCart,
        decreaseQuantity, // Function to decrement quantity
        removeFromCart,
        cartCount,
        cartTotal
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};