// src/components/layouts/SellerLayout.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { fetchSellerProfile } from '../../store/slices/sellerSlice';
import { SellerNavbar } from './SellerNavbar';

export const SellerLayout = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, loading, seller } = useSelector((state) => state.seller);

    useEffect(() => {
        // Try to fetch seller profile to verify authentication
        if (!seller) {
            dispatch(fetchSellerProfile());
        }
    }, [dispatch, seller]);

    // Show loading while checking authentication
    if (loading && !seller) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Verifying seller authentication...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated || !seller) {
        return <Navigate to="/seller/login" replace />;
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
            <SellerNavbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
};