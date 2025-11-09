import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import HomePage from './components/pages/HomePage';
import ProductPage from './components/pages/ProductPage';
import StorePage from './components/pages/StorePage';
import CartPage from './components/pages/CartPage';
import AboutUsPage from './components/pages/AboutusPage';
import SellPage from './components/pages/SellPage'; // <-- 1. Import the new page

function App() {
    return (
        <MainLayout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/store" element={<StorePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} /> 
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/sell" element={<SellPage />} /> {/* <-- 2. Add the new route */}
            </Routes>
        </MainLayout>
    );
}

export default App;