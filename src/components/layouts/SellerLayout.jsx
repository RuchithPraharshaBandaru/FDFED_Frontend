// src/components/layouts/SellerLayout.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { fetchSellerProfile } from '../../store/slices/sellerSlice';
import { SellerNavbar } from './SellerNavbar';
import { Shimmer, ShimmerText } from '../ui/Shimmer';

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
                <div className="text-center space-y-4">
                    {/* Animated logo placeholder */}
                    <div className="relative mx-auto w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
                    </div>
                    {/* Shimmer text */}
                    <div className="space-y-2">
                        <Shimmer className="h-5 w-48 mx-auto" />
                        <Shimmer className="h-4 w-32 mx-auto" />
                    </div>
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