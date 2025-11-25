// src/components/layouts/ProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthInitialized } from '../../store/slices/authSlice';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const initialized = useSelector(selectAuthInitialized);

    // Wait for auth check to complete before deciding
    if (!initialized) {
        return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;