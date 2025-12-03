// src/App.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { selectTheme } from './store/slices/themeSlice';
import { checkAuth, selectIsAuthenticated } from './store/slices/authSlice'; // Added selectIsAuthenticated
import { fetchCartItems } from './store/slices/cartSlice'; // Added fetchCartItems
import { industryCheckAuth } from './store/slices/industrySlice';
import { ToastProvider } from './hooks/useToastStore.jsx';
import MainLayout from './components/layouts/MainLayout';
import HomePage from './components/pages/HomePage';
import ProductPage from './components/pages/ProductPage';
import StorePage from './components/pages/StorePage';
import CartPage from './components/pages/CartPage';
import AboutUsPage from './components/pages/AboutusPage';
import SellPage from './components/pages/SellPage';
import ProtectedRoute from './components/layouts/ProtectedRoute';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import AccountLayout from './components/layouts/AccountLayout';
import AccountPage from './components/pages/AccountPage';
import AccountAddressPage from './components/pages/AccountAddressPage';
import OrderHistoryPage from './components/pages/OrderHistoryPage';
import MyDonationsPage from './components/pages/MyDonationsPage';
import CheckoutPage from './components/pages/CheckoutPage';
import IndustryLayout from './components/layouts/IndustryLayout';
import IndustryLoginPage from './components/pages/IndustryLoginPage';
import IndustrySignupPage from './components/pages/IndustrySignupPage';
import IndustryHomePage from './components/pages/IndustryHomePage';
import IndustryProfilePage from './components/pages/IndustryProfilePage';
import IndustryCartPage from './components/pages/IndustryCartPage';
import IndustryCheckoutPage from './components/pages/IndustryCheckoutPage';
import IndustryDashboardPage from './components/pages/IndustryDashboardPage';
import IndustryInventoryPage from './components/pages/IndustryInventoryPage';
import ProtectedIndustryRoute from './components/layouts/ProtectedIndustryRoute';

function App() {
    const dispatch = useDispatch();
    const theme = useSelector(selectTheme);
    const isAuthenticated = useSelector(selectIsAuthenticated); // Select auth state
    
    // Check authentication on mount
    useEffect(() => {
        dispatch(checkAuth());
        dispatch(industryCheckAuth());
    }, [dispatch]);

    // Sync cart when user is authenticated (but NOT on industry routes)
    useEffect(() => {
        if (isAuthenticated && !window.location.pathname.startsWith('/industry')) {
            dispatch(fetchCartItems());
        }
    }, [dispatch, isAuthenticated]);
    
    // Apply theme to document on mount and when it changes
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);
    
    return (
        <ToastProvider>
            <MainLayout>
                <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<HomePage />} />
                <Route path="/store" element={<StorePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/about" element={<AboutUsPage />} />
                
                {/* --- Auth Routes --- */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* --- Protected Routes --- */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/sell" element={<SellPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    
                    {/* --- Account & Dashboard Routes --- */}
                    <Route path="/account" element={<AccountLayout />}>
                        <Route index element={<AccountPage />} />
                        <Route path="address" element={<AccountAddressPage />} />
                        <Route path="orders" element={<OrderHistoryPage />} />
                        <Route path="donations" element={<MyDonationsPage />} />
                    </Route>
                </Route>

                {/* --- Industry Routes (separate role) --- */}
                <Route path="/industry" element={<IndustryLayout />}>
                    <Route index element={<IndustryHomePage />} />
                    <Route path="inventory" element={<IndustryInventoryPage />} />
                    <Route path="login" element={<IndustryLoginPage />} />
                    <Route path="signup" element={<IndustrySignupPage />} />
                    <Route element={<ProtectedIndustryRoute />}>
                        <Route path="profile" element={<IndustryProfilePage />} />
                        <Route path="cart" element={<IndustryCartPage />} />
                        <Route path="checkout" element={<IndustryCheckoutPage />} />
                        <Route path="dashboard" element={<IndustryDashboardPage />} />
                    </Route>
                </Route>
            </Routes>
            </MainLayout>
        </ToastProvider>
    );
}

export default App;