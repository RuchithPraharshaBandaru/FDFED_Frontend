// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import HomePage from './components/pages/HomePage';
import ProductPage from './components/pages/ProductPage';
import StorePage from './components/pages/StorePage';
import CartPage from './components/pages/CartPage';
import AboutUsPage from './components/pages/AboutusPage';
import SellPage from './components/pages/SellPage';

// --- Import new components ---
import ProtectedRoute from './components/layouts/ProtectedRoute';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import AccountLayout from './components/layouts/AccountLayout';
import AccountPage from './components/pages/AccountPage';
import AccountAddressPage from './components/pages/AccountAddressPage';
import OrderHistoryPage from './components/pages/OrderHistoryPage';
import MyDonationsPage from './components/pages/MyDonationsPage';
import CheckoutPage from './components/pages/CheckoutPage'; // <-- 1. Import
import { ThemeProvider } from './context/ThemeContext';

function App() {
    return (
        <ThemeProvider>
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
                        <Route path="/checkout" element={<CheckoutPage />} /> {/* <-- 2. Add Checkout Route */}
                        
                        {/* --- Account & Dashboard Routes --- */}
                        <Route path="/account" element={<AccountLayout />}>
                            <Route index element={<AccountPage />} />
                            <Route path="address" element={<AccountAddressPage />} />
                            <Route path="orders" element={<OrderHistoryPage />} />
                            <Route path="donations" element={<MyDonationsPage />} />
                        </Route>
                    </Route>
                </Routes>
            </MainLayout>
        </ThemeProvider>
    );
}

export default App;