// src/App.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { selectTheme } from './store/slices/themeSlice';
import { checkAuth, selectIsAuthenticated } from './store/slices/authSlice'; // Added selectIsAuthenticated
import { industryCheckAuth } from './store/slices/industrySlice';
import { fetchCartItems } from './store/slices/cartSlice'; // Added fetchCartItems
import { ToastProvider } from './context/ToastContext';
import SplashScreen from './components/ui/SplashScreen';
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
import CheckoutSuccess from './components/pages/CheckoutSuccess';
import CheckoutCancel from './components/pages/CheckoutCancel';
import BlogsPage from './components/pages/BlogsPage';
// Industry imports
import IndustryLayout from './components/layouts/IndustryLayout';
import ProtectedIndustryRoute from './components/layouts/ProtectedIndustryRoute';
import IndustryLoginPage from './components/pages/IndustryLoginPage';
import IndustrySignupPage from './components/pages/IndustrySignupPage';
import IndustryHomePage from './components/pages/IndustryHomePage';
import IndustryDashboardPage from './components/pages/IndustryDashboardPage';
import IndustryInventoryPage from './components/pages/IndustryInventoryPage';
import IndustryCartPage from './components/pages/IndustryCartPage';
import IndustryCheckoutPage from './components/pages/IndustryCheckoutPage';
import IndustryProfilePage from './components/pages/IndustryProfilePage';

// Seller imports
import { SellerLayout } from './components/layouts/SellerLayout';
import { SellerLoginPage } from './components/pages/SellerLoginPage';
import { SellerSignupPage } from './components/pages/SellerSignupPage';
import { SellerDashboardPage } from './components/pages/SellerDashboardPage';
import { SellerProductsPage } from './components/pages/SellerProductsPage';
import { SellerCreateProductPage } from './components/pages/SellerCreateProductPage';
import { SellerEditProductPage } from './components/pages/SellerEditProductPage';
import { SellerOrdersPage } from './components/pages/SellerOrdersPage';
import { SellerProfilePage } from './components/pages/SellerProfilePage';
import AdminLayout from './components/layouts/AdminLayout';
import AdminProtectedRoute from './components/layouts/AdminProtectedRoute';
import AdminLoginPage from './components/pages/admin/AdminLoginPage';
import AdminDashboardPage from './components/pages/admin/AdminDashboardPage';
import AdminBlogsPage from './components/pages/admin/BlogsPage';
import BlogCreatePage from './components/pages/admin/BlogCreatePage';
import CustomersPage from './components/pages/admin/CustomersPage';
import ProductsPage from './components/pages/admin/ProductsPage';
import ProductAnalyticsPage from './components/pages/admin/ProductAnalyticsPage';
import UserPurchaseAnalyticsPage from './components/pages/admin/UserPurchaseAnalyticsPage';
import PerformanceRankingsPage from './components/pages/admin/PerformanceRankingsPage';
import SellersPage from './components/pages/admin/SellersPage';
import VendorsPage from './components/pages/admin/VendorsPage';
import IndustriesPage from './components/pages/admin/IndustriesPage';
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
    const [showSplash, setShowSplash] = useState(true);

    // Check authentication on mount
    useEffect(() => {
        dispatch(checkAuth());
        dispatch(industryCheckAuth());
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
        <ToastProvider>
            {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
            <Routes>
                {/* --- Industry Public Routes --- */}
                <Route path="/industry/login" element={<IndustryLoginPage />} />
                <Route path="/industry/signup" element={<IndustrySignupPage />} />

                {/* --- Protected Industry Routes --- */}
                <Route element={<ProtectedIndustryRoute />}>
                    <Route path="/industry" element={<IndustryLayout />}>
                        <Route index element={<IndustryHomePage />} />
                        <Route path="home" element={<IndustryHomePage />} />
                        <Route path="dashboard" element={<IndustryDashboardPage />} />
                        <Route path="inventory" element={<IndustryInventoryPage />} />
                        <Route path="cart" element={<IndustryCartPage />} />
                        <Route path="checkout" element={<IndustryCheckoutPage />} />
                        <Route path="profile" element={<IndustryProfilePage />} />
                    </Route>
                </Route>

                {/* --- Seller Public Routes --- */}
                <Route path="/seller/login" element={<SellerLoginPage />} />
                <Route path="/seller/signup" element={<SellerSignupPage />} />

                {/* --- Protected Seller Routes --- */}
                <Route path="/seller" element={<SellerLayout />}>
                    <Route path="dashboard" element={<SellerDashboardPage />} />
                    <Route path="products" element={<SellerProductsPage />} />
                    <Route path="products/create" element={<SellerCreateProductPage />} />
                    <Route path="products/edit/:id" element={<SellerEditProductPage />} />
                    <Route path="orders" element={<SellerOrdersPage />} />
                    <Route path="profile" element={<SellerProfilePage />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route element={<AdminProtectedRoute />}>
                    <Route path="admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboardPage />} />
                        <Route path="dashboard" element={<AdminDashboardPage />} />
                        <Route path="product-analytics" element={<ProductAnalyticsPage />} />
                        <Route path="user-analytics" element={<UserPurchaseAnalyticsPage />} />
                        <Route path="user-analytics/:userId" element={<UserPurchaseAnalyticsPage />} />
                        <Route path="performance-rankings" element={<PerformanceRankingsPage />} />
                        <Route path="blogs" element={<AdminBlogsPage />} />
                        <Route path="blogs/create" element={<BlogCreatePage />} />
                        <Route path="customers" element={<CustomersPage />} />
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="sellers" element={<SellersPage />} />
                        <Route path="vendors" element={<VendorsPage />} />
                        <Route path="industries" element={<IndustriesPage />} />
                        <Route path="orders" element={<OrdersPage />} />
                        <Route path="orders/user/:userId" element={<OrderUserPage />} />
                        <Route path="sell-products" element={<SellProductsPage />} />
                        <Route path="managers" element={<ManagersPage />} />
                        <Route path="delivery" element={<DeliveryPage />} />
                        <Route path="analytics" element={<AnalyticsPage />} />
                    </Route>
                </Route>

                {/* --- Regular App Routes with MainLayout --- */}
                <Route element={<MainLayout />}>
                    {/* --- Public Routes --- */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/store" element={<StorePage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/about" element={<AboutUsPage />} />
                    <Route path="/blogs" element={<BlogsPage />} />
                    <Route path="/auth" element={<AuthChoicePage />} />

                    {/* --- Auth Routes --- */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* --- Protected Routes --- */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/sell" element={<SellPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />

                        <Route path="/checkout/success" element={<CheckoutSuccess />} />
                        <Route path="/checkout/cancel" element={<CheckoutCancel />} />
                        
                        {/* --- Account & Dashboard Routes --- */}
                        <Route path="/account" element={<AccountLayout />}>
                            <Route index element={<AccountPage />} />
                            <Route path="address" element={<AccountAddressPage />} />
                            <Route path="orders" element={<OrderHistoryPage />} />
                            <Route path="donations" element={<MyDonationsPage />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </ToastProvider>
    );
}

export default App;