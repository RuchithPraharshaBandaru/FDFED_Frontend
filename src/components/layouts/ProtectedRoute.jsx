// src/components/layouts/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext'; // <-- FIX: Was ../, now ../../
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        // You can return a loading spinner here
        return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white">Loading...</div>;
    }

    if (!isAuthenticated) {
        // Redirect to login page if not logged in
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the child route (e.g., <SellPage />)
    return <Outlet />;
};

export default ProtectedRoute;