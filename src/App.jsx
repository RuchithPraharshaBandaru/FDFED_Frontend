// src/App.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { selectTheme } from './store/slices/themeSlice';
import { checkAuth, selectIsAuthenticated } from './store/slices/authSlice'; // Added selectIsAuthenticated
import { fetchCartItems } from './store/slices/cartSlice'; // Added fetchCartItems
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
import AdminLayout from './components/layouts/AdminLayout';
import AdminProtectedRoute from './components/layouts/AdminProtectedRoute';
import AdminLoginPage from './components/pages/admin/AdminLoginPage';
import AdminDashboardPage from './components/pages/admin/AdminDashboardPage';
import BlogsPage from './components/pages/admin/BlogsPage';
import BlogCreatePage from './components/pages/admin/BlogCreatePage';
import CustomersPage from './components/pages/admin/CustomersPage';
import ProductsPage from './components/pages/admin/ProductsPage';
import SellersPage from './components/pages/admin/SellersPage';
import VendorsPage from './components/pages/admin/VendorsPage';
import OrdersPage from './components/pages/admin/OrdersPage';
import OrderUserPage from './components/pages/admin/OrderUserPage';
import SellProductsPage from './components/pages/admin/SellProductsPage';
import ManagersPage from './components/pages/admin/ManagersPage';
import DeliveryPage from './components/pages/admin/DeliveryPage';
import AnalyticsPage from './components/pages/admin/AnalyticsPage';
import AuthChoicePage from './components/pages/AuthChoicePage';

function App() {
    const dispatch = useDispatch();
    const theme = useSelector(selectTheme);
    const isAuthenticated = useSelector(selectIsAuthenticated); // Select auth state
    
    // Check authentication on mount
    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    // Sync cart when user is authenticated
    useEffect(() => {
        if (isAuthenticated) {
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
        <Routes>
            {/* Main site layout */}
            <Route element={<MainLayout />}>
                {/* --- Public Routes --- */}
                <Route index element={<HomePage />} />
                <Route path="store" element={<StorePage />} />
                <Route path="product/:id" element={<ProductPage />} />
                <Route path="about" element={<AboutUsPage />} />
                <Route path="auth" element={<AuthChoicePage />} />

                {/* --- Auth Routes --- */}
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />

                {/* --- Protected Routes --- */}
                <Route element={<ProtectedRoute />}>
                    <Route path="cart" element={<CartPage />} />
                    <Route path="sell" element={<SellPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    {/* --- Account & Dashboard Routes --- */}
                    <Route path="account" element={<AccountLayout />}>
                        <Route index element={<AccountPage />} />
                        <Route path="address" element={<AccountAddressPage />} />
                        <Route path="orders" element={<OrderHistoryPage />} />
                        <Route path="donations" element={<MyDonationsPage />} />
                    </Route>
                </Route>
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<AdminProtectedRoute />}> 
                <Route path="/admin" element={<AdminLayout />}> 
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="blogs" element={<BlogsPage />} />
                    <Route path="blogs/create" element={<BlogCreatePage />} />
                    <Route path="customers" element={<CustomersPage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="sellers" element={<SellersPage />} />
                    <Route path="vendors" element={<VendorsPage />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="orders/user/:userId" element={<OrderUserPage />} />
                    <Route path="sell-products" element={<SellProductsPage />} />
                    <Route path="managers" element={<ManagersPage />} />
                    <Route path="delivery" element={<DeliveryPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;