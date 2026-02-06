import React, { createContext, useContext, useState, useEffect } from 'react';
// Adjust path to your api service
import { 
    industryLogin, 
    industryLogout, 
    postIndustryCart, 
    getIndustryProfile, 
    getIndustryCart 
} from '../services/api';

const IndustryContext = createContext();

export const useIndustry = () => {
    const context = useContext(IndustryContext);
    if (!context) {
        throw new Error("useIndustry must be used within an IndustryProvider");
    }
    return context;
};

export const IndustryProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [loadingAuth, setLoadingAuth] = useState(true);

    const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

    // 1. Check Session on Mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const profileData = await getIndustryProfile();
                if (profileData && (profileData.success || profileData.industry)) {
                    const userData = profileData.industry || profileData.data || profileData;
                    setUser(userData);
                    setIsAuthenticated(true);
                    fetchCart();
                }
            } catch (err) {
                // Session expired or not logged in
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoadingAuth(false);
            }
        };
        checkSession();
    }, []);

    // 2. Helper to fetch cart
    const fetchCart = async () => {
        try {
            const cartData = await getIndustryCart();
            const items = cartData.cart || cartData.items || cartData.data || [];
            setCart(Array.isArray(items) ? items : []);
        } catch (err) {
            console.error("Failed to load cart context", err);
        }
    };

    // 3. Actions
    const login = async (credentials) => {
        try {
            const data = await industryLogin(credentials);
            if (data.success) {
                setUser(data.industry);
                setIsAuthenticated(true);
                await fetchCart();
                return { success: true };
            }
            return { success: false, message: data.message || "Login failed" };
        } catch (err) {
            return { success: false, message: err.message || "Connection failed" };
        }
    };

    const logout = async () => {
        try { await industryLogout(); } catch (e) { console.error(e); }
        setIsAuthenticated(false);
        setUser(null);
        setCart([]);
    };

    const addToCart = async (product, qty) => {
        try {
            const payload = {
                id: product._id || product.id,
                quantity: qty,
                fabric: product.fabric,
                price: product.estimated_value
            };
            await postIndustryCart(payload);
            await fetchCart(); // Refresh cart data
            return true;
        } catch (err) {
            console.error("Context Add Error", err);
            return false;
        }
    };

    return (
        <IndustryContext.Provider value={{ 
            isAuthenticated, 
            user, 
            login, 
            logout, 
            cart, 
            cartCount, 
            fetchCart, 
            addToCart, 
            loadingAuth 
        }}>
            {children}
        </IndustryContext.Provider>
    );
};