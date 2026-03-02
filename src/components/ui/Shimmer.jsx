// src/components/ui/Shimmer.jsx
import React from 'react';

// Base shimmer animation component
export const Shimmer = ({ className = '' }) => (
    <div className={`animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer rounded ${className}`} />
);

// Shimmer for text lines
export const ShimmerText = ({ width = 'w-full', height = 'h-4', className = '' }) => (
    <Shimmer className={`${width} ${height} ${className}`} />
);

// Shimmer for circular elements (avatars, icons)
export const ShimmerCircle = ({ size = 'w-10 h-10', className = '' }) => (
    <Shimmer className={`${size} rounded-full ${className}`} />
);

// Shimmer for rectangular elements (images, cards)
export const ShimmerRect = ({ width = 'w-full', height = 'h-32', className = '' }) => (
    <Shimmer className={`${width} ${height} ${className}`} />
);

// Dashboard Stats Card Shimmer
export const DashboardStatShimmer = () => (
    <div className="p-6 bg-card border border-border rounded-lg">
        <div className="flex items-center">
            <div className="flex-1 space-y-2">
                <Shimmer className="h-4 w-24" />
                <Shimmer className="h-8 w-16" />
            </div>
            <ShimmerCircle size="w-12 h-12" />
        </div>
    </div>
);

// Product Card Shimmer
export const ProductCardShimmer = () => (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
        <ShimmerRect height="h-48" />
        <div className="p-4 space-y-3">
            <Shimmer className="h-5 w-3/4" />
            <Shimmer className="h-4 w-1/2" />
            <div className="flex justify-between items-center">
                <Shimmer className="h-6 w-20" />
                <Shimmer className="h-6 w-16 rounded-full" />
            </div>
            <div className="flex gap-2 pt-2">
                <Shimmer className="h-9 flex-1" />
                <Shimmer className="h-9 flex-1" />
            </div>
        </div>
    </div>
);

// Order Row Shimmer
export const OrderRowShimmer = () => (
    <div className="p-4 bg-card border border-border rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
                <ShimmerRect width="w-16" height="h-16" className="rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <Shimmer className="h-5 w-48" />
                    <Shimmer className="h-4 w-32" />
                    <Shimmer className="h-4 w-40" />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Shimmer className="h-6 w-20" />
                <Shimmer className="h-6 w-24 rounded-full" />
                <Shimmer className="h-9 w-28" />
            </div>
        </div>
    </div>
);

// Profile Form Field Shimmer
export const ProfileFieldShimmer = () => (
    <div className="space-y-2">
        <Shimmer className="h-4 w-24" />
        <Shimmer className="h-10 w-full" />
    </div>
);

// Recent Item Shimmer (for dashboard lists)
export const RecentItemShimmer = () => (
    <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
        <ShimmerRect width="w-16" height="h-16" className="rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
            <Shimmer className="h-4 w-3/4" />
            <Shimmer className="h-3 w-1/2" />
        </div>
        <Shimmer className="h-6 w-20 rounded-full" />
    </div>
);

// Table Row Shimmer
export const TableRowShimmer = ({ columns = 5 }) => (
    <tr className="border-b border-border">
        {Array.from({ length: columns }).map((_, i) => (
            <td key={i} className="px-4 py-3">
                <Shimmer className="h-4 w-full" />
            </td>
        ))}
    </tr>
);

// Full Dashboard Shimmer
export const DashboardShimmer = () => (
    <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8 space-y-2">
                <Shimmer className="h-9 w-72" />
                <Shimmer className="h-5 w-96" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                    <DashboardStatShimmer key={i} />
                ))}
            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-card border border-border rounded-lg mb-8">
                <Shimmer className="h-6 w-32 mb-4" />
                <div className="flex flex-wrap gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Shimmer key={i} className="h-10 w-32" />
                    ))}
                </div>
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Products */}
                <div className="p-6 bg-card border border-border rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <Shimmer className="h-6 w-36" />
                        <Shimmer className="h-9 w-20" />
                    </div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <RecentItemShimmer key={i} />
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="p-6 bg-card border border-border rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <Shimmer className="h-6 w-32" />
                        <Shimmer className="h-9 w-20" />
                    </div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <RecentItemShimmer key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Products Page Shimmer
export const ProductsPageShimmer = () => (
    <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="space-y-2">
                    <Shimmer className="h-9 w-48" />
                    <Shimmer className="h-5 w-32" />
                </div>
                <Shimmer className="h-10 w-36" />
            </div>

            {/* Search/Filter Bar */}
            <div className="p-4 bg-card border border-border rounded-lg mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <Shimmer className="h-10 flex-1" />
                    <Shimmer className="h-10 w-28" />
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <ProductCardShimmer key={i} />
                ))}
            </div>
        </div>
    </div>
);

// Orders Page Shimmer
export const OrdersPageShimmer = () => (
    <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6 space-y-2">
                <Shimmer className="h-9 w-48" />
                <Shimmer className="h-5 w-64" />
            </div>

            {/* Search/Filter Bar */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <Shimmer className="h-10 flex-1" />
                    <Shimmer className="h-10 w-28" />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[...Array(3)].map((_, i) => (
                    <DashboardStatShimmer key={i} />
                ))}
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <OrderRowShimmer key={i} />
                ))}
            </div>
        </div>
    </div>
);

// Profile Page Shimmer
export const ProfilePageShimmer = () => (
    <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            {/* Header */}
            <div className="mb-8 space-y-2">
                <Shimmer className="h-9 w-48" />
                <Shimmer className="h-5 w-72" />
            </div>

            {/* Profile Card */}
            <div className="p-8 bg-card border border-border rounded-lg">
                {/* Avatar Section */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
                    <ShimmerCircle size="w-20 h-20" />
                    <div className="space-y-2">
                        <Shimmer className="h-6 w-40" />
                        <Shimmer className="h-4 w-32" />
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileFieldShimmer />
                        <ProfileFieldShimmer />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileFieldShimmer />
                        <ProfileFieldShimmer />
                    </div>
                    
                    {/* Address Section */}
                    <div className="pt-4 border-t border-border">
                        <Shimmer className="h-6 w-32 mb-4" />
                        <div className="space-y-4">
                            <ProfileFieldShimmer />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ProfileFieldShimmer />
                                <ProfileFieldShimmer />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ProfileFieldShimmer />
                                <ProfileFieldShimmer />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Shimmer className="h-11 w-full max-w-xs" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Edit Product Page Shimmer
export const EditProductPageShimmer = () => (
    <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
            {/* Header */}
            <div className="mb-8 space-y-2">
                <Shimmer className="h-9 w-48" />
                <Shimmer className="h-5 w-64" />
            </div>

            {/* Form Card */}
            <div className="p-6 bg-card border border-border rounded-lg">
                <div className="space-y-6">
                    {/* Image Preview */}
                    <div className="flex justify-center mb-6">
                        <ShimmerRect width="w-48" height="h-48" className="rounded-lg" />
                    </div>

                    {/* Form Fields */}
                    <ProfileFieldShimmer />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileFieldShimmer />
                        <ProfileFieldShimmer />
                    </div>
                    <ProfileFieldShimmer />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileFieldShimmer />
                        <ProfileFieldShimmer />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <Shimmer className="h-11 w-32" />
                        <Shimmer className="h-11 w-32" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Shimmer;
