// src/components/layouts/RiderProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsRiderAuthenticated } from '../../store/slices/riderSlice';

const RiderProtectedRoute = () => {
    const isAuthenticated = useSelector(selectIsRiderAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/rider/login" replace />;
    }

    return <Outlet />;
};

export default RiderProtectedRoute;
