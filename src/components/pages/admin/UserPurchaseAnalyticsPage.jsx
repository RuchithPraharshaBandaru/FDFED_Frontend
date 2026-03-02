import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, selectAdminCustomers } from '../../../store/slices/adminSlice';
import { getUserPurchaseAnalytics } from '../../../services/adminApi';
import {
    ShoppingBag, TrendingUp, Package, BarChart3, Clock, ArrowLeft,
    Search, User, AlertCircle, Loader2, Tag, IndianRupee, ChevronRight
} from 'lucide-react';

const PERIODS = [
    { value: '3m', label: 'Last 3 Months' },
    { value: '6m', label: 'Last 6 Months' },
    { value: '1y', label: 'Last 1 Year' },
    { value: 'lifetime', label: 'Lifetime' },
];

const formatCurrency = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const CATEGORY_COLORS = [
    { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', bar: 'bg-blue-500', ring: 'ring-blue-500' },
    { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', bar: 'bg-purple-500', ring: 'ring-purple-500' },
    { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', bar: 'bg-emerald-500', ring: 'ring-emerald-500' },
    { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', bar: 'bg-amber-500', ring: 'ring-amber-500' },
    { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300', bar: 'bg-rose-500', ring: 'ring-rose-500' },
    { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300', bar: 'bg-cyan-500', ring: 'ring-cyan-500' },
    { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300', bar: 'bg-indigo-500', ring: 'ring-indigo-500' },
    { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-300', bar: 'bg-teal-500', ring: 'ring-teal-500' },
];

const UserPurchaseAnalyticsPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get customers from Redux store
    const { items: allCustomers, loading: loadingCustomers } = useSelector(selectAdminCustomers);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');

    // Analytics state
    const [data, setData] = useState(null);
    const [period, setPeriod] = useState('3m');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Expanded category
    const [expandedCategory, setExpandedCategory] = useState(null);

    // Auto-load customers when on search page
    useEffect(() => {
        if (!userId && (!allCustomers || allCustomers.length === 0)) {
            dispatch(fetchCustomers({ page: 1, limit: 200 }));
        }
    }, [userId, dispatch, allCustomers]);

    // Filter customers based on search query
    const filteredCustomers = useMemo(() => {
        if (!allCustomers || allCustomers.length === 0) return [];
        if (!searchQuery.trim()) return allCustomers;
        const q = searchQuery.toLowerCase();
        return allCustomers.filter(u => {
            const name = `${u.firstname || ''} ${u.lastname || ''}`.toLowerCase();
            const email = (u.email || '').toLowerCase();
            return name.includes(q) || email.includes(q);
        });
    }, [allCustomers, searchQuery]);

    // Fetch analytics when userId or period changes
    useEffect(() => {
        if (!userId) { setData(null); return; }
        const fetchAnalytics = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getUserPurchaseAnalytics(userId, period);
                setData(res.data || res);
            } catch (err) {
                setError(err.message || 'Failed to load analytics');
                setData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [userId, period]);

    // If no userId, show search UI
    if (!userId) {
        return (
            <div className="space-y-6 p-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Purchase Analytics</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Select a customer to view their purchase behavior</p>
                </div>

                {/* Search Bar */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Filter by name or email..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Customer List */}
                    {loadingCustomers ? (
                        <div className="mt-6 text-center py-8">
                            <Loader2 size={32} className="animate-spin text-blue-500 mx-auto" />
                            <p className="mt-2 text-gray-500">Loading customers...</p>
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="mt-6 text-center py-8">
                            <User size={48} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">
                                {searchQuery ? `No customers match "${searchQuery}"` : 'No customers found'}
                            </p>
                        </div>
                    ) : (
                        <div className="mt-4 space-y-2 max-h-[500px] overflow-y-auto">
                            <p className="text-sm text-gray-500 mb-3">{filteredCustomers.length} customer{filteredCustomers.length > 1 ? 's' : ''} found</p>
                            {filteredCustomers.map(u => (
                                <button
                                    key={u._id}
                                    onClick={() => navigate(`/admin/user-analytics/${u._id}`)}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group text-left"
                                >
                                    <img
                                        src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((u.firstname || '') + ' ' + (u.lastname || ''))}&background=random`}
                                        alt=""
                                        className="h-12 w-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-900 shadow-sm"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-900 dark:text-white truncate">{u.firstname} {u.lastname}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{u.email}</div>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Analytics view for a specific user
    return (
        <div className="space-y-6 p-2">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/user-analytics')}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Purchase Analytics</h1>
                        {data?.user && (
                            <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                                Viewing analytics for <span className="font-medium text-gray-700 dark:text-gray-300">{data.user.firstname} {data.user.lastname}</span> ({data.user.email})
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Period Filters */}
            <div className="flex flex-wrap gap-2">
                {PERIODS.map(p => (
                    <button
                        key={p.value}
                        onClick={() => setPeriod(p.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${period === p.value
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Clock size={14} className="inline mr-1.5 -mt-0.5" />
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                    <Loader2 size={40} className="animate-spin text-blue-500 mx-auto" />
                    <p className="mt-3 text-gray-500">Loading purchase analytics...</p>
                </div>
            )}

            {/* Error */}
            {error && !loading && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 flex items-start gap-4">
                    <AlertCircle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-red-800 dark:text-red-300">Error Loading Analytics</h3>
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
                        <button onClick={() => setPeriod(period)} className="mt-3 text-sm font-medium text-red-700 dark:text-red-300 hover:underline">
                            Try again
                        </button>
                    </div>
                </div>
            )}

            {/* Analytics Content */}
            {data && !loading && !error && (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        <SummaryCard
                            icon={<Tag size={22} />}
                            label="Categories"
                            value={data.summary?.totalCategories ?? 0}
                            color="blue"
                        />
                        <SummaryCard
                            icon={<Package size={22} />}
                            label="Items Purchased"
                            value={data.summary?.totalQuantity ?? 0}
                            color="purple"
                        />
                        <SummaryCard
                            icon={<IndianRupee size={22} />}
                            label="Total Revenue"
                            value={formatCurrency(data.summary?.totalRevenue ?? 0)}
                            color="emerald"
                        />
                        <SummaryCard
                            icon={<ShoppingBag size={22} />}
                            label="Total Orders"
                            value={data.summary?.totalOrders ?? 0}
                            color="amber"
                        />
                        <SummaryCard
                            icon={<TrendingUp size={22} />}
                            label="Top Category"
                            value={data.summary?.mostPurchasedCategory || 'N/A'}
                            color="rose"
                            className="col-span-2 lg:col-span-1"
                        />
                    </div>

                    {/* Period Info */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex flex-wrap items-center gap-4 text-sm">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium">
                            <Clock size={14} /> {data.periodLabel}
                        </span>
                        {data.startDate && (
                            <span className="text-gray-500 dark:text-gray-400">
                                {data.startDate} — {data.endDate}
                            </span>
                        )}
                    </div>

                    {/* Category Breakdown */}
                    {(data.categoryBreakdown || []).length > 0 ? (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <BarChart3 size={22} className="text-blue-500" />
                                Category Breakdown
                            </h2>

                            {/* Visual Bar Chart */}
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
                                <div className="space-y-4">
                                    {data.categoryBreakdown.map((cat, i) => {
                                        const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                                        const maxQty = Math.max(...data.categoryBreakdown.map(c => c.totalQuantity));
                                        const pct = maxQty > 0 ? (cat.totalQuantity / maxQty) * 100 : 0;
                                        return (
                                            <div key={cat.category} className="group">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-sm font-semibold ${color.bg} ${color.text}`}>
                                                        {cat.category}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {cat.totalQuantity} items · {formatCurrency(cat.totalRevenue)}
                                                    </span>
                                                </div>
                                                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${color.bar} rounded-full transition-all duration-700 ease-out`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Category Detail Cards */}
                            <div className="grid gap-4">
                                {data.categoryBreakdown.map((cat, i) => {
                                    const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                                    const isExpanded = expandedCategory === cat.category;
                                    return (
                                        <div key={cat.category} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                                            <button
                                                onClick={() => setExpandedCategory(isExpanded ? null : cat.category)}
                                                className="w-full p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl ${color.bg} flex items-center justify-center`}>
                                                        <Tag size={22} className={color.text} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{cat.category}</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {cat.uniqueProducts} unique product{cat.uniqueProducts !== 1 ? 's' : ''} · {cat.orderCount} order{cat.orderCount !== 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right hidden sm:block">
                                                        <div className="text-lg font-bold text-gray-900 dark:text-white">{cat.totalQuantity}</div>
                                                        <div className="text-xs text-gray-500">items</div>
                                                    </div>
                                                    <div className="text-right hidden sm:block">
                                                        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(cat.totalRevenue)}</div>
                                                        <div className="text-xs text-gray-500">revenue</div>
                                                    </div>
                                                    <ChevronRight size={20} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                                </div>
                                            </button>

                                            {/* Expanded: Top Products */}
                                            {isExpanded && (cat.topProducts || []).length > 0 && (
                                                <div className="border-t border-gray-100 dark:border-gray-800 p-5 bg-gray-50/50 dark:bg-gray-800/30">
                                                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">Top Products</h4>
                                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {cat.topProducts.map((prod) => (
                                                            <div key={prod.productId} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                                                                {prod.image ? (
                                                                    <img
                                                                        src={prod.image}
                                                                        alt={prod.title}
                                                                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                                    />
                                                                ) : (
                                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                                                        <Package size={20} className="text-gray-400" />
                                                                    </div>
                                                                )}
                                                                <div className="min-w-0">
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{prod.title}</div>
                                                                    <div className="text-xs text-gray-500 truncate">ID: {prod.productId?.slice(-8)}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Mobile stats row */}
                                            {isExpanded && (
                                                <div className="sm:hidden border-t border-gray-100 dark:border-gray-800 p-4 grid grid-cols-3 gap-4 text-center">
                                                    <div>
                                                        <div className="font-bold text-gray-900 dark:text-white">{cat.totalQuantity}</div>
                                                        <div className="text-xs text-gray-500">Items</div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-emerald-600">{formatCurrency(cat.totalRevenue)}</div>
                                                        <div className="text-xs text-gray-500">Revenue</div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 dark:text-white">{cat.orderCount}</div>
                                                        <div className="text-xs text-gray-500">Orders</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                            <ShoppingBag size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Purchase Data</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">This user hasn't made any purchases in the selected period.</p>
                            <div className="mt-4 flex gap-2 justify-center flex-wrap">
                                {PERIODS.filter(p => p.value !== period).map(p => (
                                    <button
                                        key={p.value}
                                        onClick={() => setPeriod(p.value)}
                                        className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Try {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// Summary Card Component
const SummaryCard = ({ icon, label, value, color, className = '' }) => {
    const colors = {
        blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
        emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
        amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
        rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    };

    return (
        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm ${className}`}>
            <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}>
                {icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white truncate">{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
        </div>
    );
};

export default UserPurchaseAnalyticsPage;
