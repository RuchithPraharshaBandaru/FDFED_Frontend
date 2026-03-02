import React, { useEffect, useState } from 'react';
import { getProductAnalytics } from '../../../services/adminApi';
import { Package, TrendingUp, IndianRupee, ShoppingCart, Calendar } from 'lucide-react';
import Button from '../../ui/Button';

const ProductAnalyticsPage = () => {
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [period, setPeriod] = useState('3m');
    const [periodInfo, setPeriodInfo] = useState({});

    const fetchAnalytics = async (selectedPeriod) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getProductAnalytics(selectedPeriod);
            if (response.success) {
                setAnalytics(response.data.analytics);
                setPeriodInfo({
                    periodLabel: response.data.periodLabel,
                    startDate: response.data.startDate,
                    endDate: response.data.endDate,
                    totalProducts: response.data.totalProducts
                });
            } else {
                setError(response.message || 'Failed to fetch analytics');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while fetching analytics');
            console.error('Analytics fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics(period);
    }, [period]);

    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Product Analytics</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Track the most purchased products by users
                    </p>
                </div>

                {/* Period Filter Buttons */}
                <div className="flex gap-2 flex-wrap">
                    <Button
                        onClick={() => handlePeriodChange('3m')}
                        variant={period === '3m' ? 'primary' : 'outline'}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${period === '3m'
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        Last 3 Months
                    </Button>
                    <Button
                        onClick={() => handlePeriodChange('6m')}
                        variant={period === '6m' ? 'primary' : 'outline'}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${period === '6m'
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        Last 6 Months
                    </Button>
                    <Button
                        onClick={() => handlePeriodChange('1y')}
                        variant={period === '1y' ? 'primary' : 'outline'}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${period === '1y'
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        Last 1 Year
                    </Button>
                </div>
            </div>

            {/* Period Info Card */}
            {periodInfo.periodLabel && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
                        <Calendar size={20} />
                        <span className="font-semibold">{periodInfo.periodLabel}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
                        {periodInfo.startDate && formatDate(periodInfo.startDate)} - {periodInfo.endDate && formatDate(periodInfo.endDate)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-500 mt-1">
                        Showing top {periodInfo.totalProducts} product{periodInfo.totalProducts !== 1 ? 's' : ''}
                    </p>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <p className="text-red-800 dark:text-red-300 font-medium">Error: {error}</p>
                    <button
                        onClick={() => fetchAnalytics(period)}
                        className="mt-2 text-sm text-red-600 dark:text-red-400 underline hover:text-red-800 dark:hover:text-red-200"
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* Analytics Table */}
            {!loading && !error && analytics.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Rank
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="py-4 px-6 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-1">
                                            <Package size={14} />
                                            Quantity Sold
                                        </div>
                                    </th>
                                    <th className="py-4 px-6 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-1">
                                            <IndianRupee size={14} />
                                            Revenue
                                        </div>
                                    </th>
                                    <th className="py-4 px-6 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-1">
                                            <ShoppingCart size={14} />
                                            Orders
                                        </div>
                                    </th>
                                    <th className="py-4 px-6 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Price
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {analytics.map((product, index) => (
                                    <tr
                                        key={product.productId}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                    >
                                        {/* Rank */}
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold text-sm">
                                                {index + 1}
                                            </div>
                                        </td>

                                        {/* Product Info */}
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/48?text=No+Image';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package size={24} className="text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
                                                        {product.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        ID: {product.productId.substring(0, 8)}...
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="py-4 px-6">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                                {product.category || 'Uncategorized'}
                                            </span>
                                        </td>

                                        {/* Quantity */}
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {product.totalQuantity.toLocaleString()}
                                                </span>
                                                <TrendingUp size={14} className="text-green-500 mt-1" />
                                            </div>
                                        </td>

                                        {/* Revenue */}
                                        <td className="py-4 px-6 text-center">
                                            <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                                                {formatCurrency(product.totalRevenue)}
                                            </span>
                                        </td>

                                        {/* Order Count */}
                                        <td className="py-4 px-6 text-center">
                                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold text-sm">
                                                {product.orderCount}
                                            </span>
                                        </td>

                                        {/* Price */}
                                        <td className="py-4 px-6 text-right">
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {formatCurrency(product.price)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* No Data State */}
            {!loading && !error && analytics.length === 0 && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No Analytics Data Available
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        No product purchases found for the selected time period.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProductAnalyticsPage;
