import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import HomePage from './components/pages/HomePage';
import ProductPage from './components/pages/ProductPage';
import StorePage from './components/pages/StorePage';
import CartPage from './components/pages/CartPage'; // Import the new CartPage
import AboutUsPage from './components/pages/AboutusPage';
function App() {
    return (
        <MainLayout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/store" element={<StorePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} /> 
                <Route path="/about" element={<AboutUsPage />} />
            </Routes>
        </MainLayout>
    );
}

export default App;