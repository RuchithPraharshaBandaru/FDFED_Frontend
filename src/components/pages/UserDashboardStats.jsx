// src/components/pages/UserDashboardStats.jsx
import React, { useState, useEffect } from 'react';
import { apiGetDashboardStats } from '../../services/api';
import Alert from '../ui/Alert';

const UserDashboardStats = () => {
    const [timePeriod, setTimePeriod] = useState('all');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await apiGetDashboardStats(timePeriod);
                if (data.success) {
                    setStats(data.data);
                } else {
                    setError('Failed to load dashboard stats');
                }
            } catch (err) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [timePeriod]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white bg-clip-text text-transparent">
                    My Dashboard
                </h2>

                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    {['week', 'month', 'year', 'all'].map((period) => (
                        <button
                            key={period}
                            onClick={() => setTimePeriod(period)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${timePeriod === period
                                ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {period.charAt(0).toUpperCase() + period.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {error && <Alert type="error" message={error} />}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-2xl shadow-xl animate-pulse">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/2 mb-4 rounded"></div>
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 w-3/4 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : stats ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                        {/* Orders Card */}
                        <div className="lg:col-span-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50 transform hover:scale-105 transition-transform duration-300">
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Past Orders</h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {stats.totalOrders}
                            </p>
                        </div>

                        {/* Clothes Given Card */}
                        <div className="lg:col-span-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50 transform hover:scale-105 transition-transform duration-300">
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 truncate">Secondhand Clothes Sold</h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {stats.clothesGiven}
                            </p>
                        </div>

                        {/* Money Spent Card */}
                        <div className="lg:col-span-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border-2 border-green-500/20 dark:border-green-500/20 transform hover:scale-105 transition-transform duration-300 overflow-hidden">
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 truncate">Money Spent</h3>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400 truncate" title={formatCurrency(stats.moneySpent)}>
                                {formatCurrency(stats.moneySpent)}
                            </p>
                        </div>

                        {/* Coins Gained Card */}
                        <div className="lg:col-span-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border-2 border-yellow-500/20 dark:border-yellow-500/20 transform hover:scale-105 transition-transform duration-300">
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Virtual Coins Gained</h3>
                            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                                {stats.coinsGained} <span className="text-sm font-normal text-gray-500">coins</span>
                            </p>
                        </div>
                    </div>

                    {/* Top Category Section */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50 flex flex-col sm:flex-row items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">Mostly Bought Category</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Top preference.</p>
                            </div>
                            <div className="mt-4 sm:mt-0 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-6 py-3 rounded-full font-bold text-xl uppercase tracking-wider text-center break-words max-w-full">
                                {stats.topCategory}
                            </div>
                        </div>

                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50 flex flex-col sm:flex-row items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">2nd Most Bought</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Next preference.</p>
                            </div>
                            <div className="mt-4 sm:mt-0 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-6 py-3 rounded-full font-bold text-xl uppercase tracking-wider text-center break-words max-w-full">
                                {stats.secondCategory}
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default UserDashboardStats;
