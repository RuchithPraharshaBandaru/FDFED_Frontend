import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiLogin, apiLogout, apiCheckAuth } from '../services/api'; // We will add these

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // For loading screen

    // 3. Check for existing session on app load
    useEffect(() => {
        const checkLoggedIn = async () => {
            setIsLoading(true);
            try {
                // This API call will check the httpOnly cookie
                const data = await apiCheckAuth();
                if (data.success) {
                    setUser(data.user);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                // If it fails (401, etc.), user is not logged in
                setUser(null);
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        };
        checkLoggedIn();
    }, []);

    // 4. Login Function
    const login = async (email, password) => {
        try {
            // This API call will set the httpOnly cookie
            await apiLogin(email, password);
            // After logging in, check auth to get user data
            const data = await apiCheckAuth();
            setUser(data.user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Login failed:", error);
            throw error; // Re-throw to let the login page handle the error
        }
    };

    // 5. Logout Function
    const logout = async () => {
        try {
            await apiLogout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // 6. Provide values to children
    const value = {
        user,
        setUser,
        isAuthenticated,
        isLoading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// 7. Create a custom hook for easy access
export const useAuth = () => {
    return useContext(AuthContext);
};