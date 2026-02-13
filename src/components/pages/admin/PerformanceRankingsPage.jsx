import React, { useState, useEffect, useCallback } from 'react';
import {
    getSellerRankings, getIndustryRankings,
    getSellerTimeseries, getIndustryTimeseries,
} from '../../../services/adminApi';
import {
    Trophy, TrendingUp, Store, Building2, IndianRupee, ShoppingBag,
    Users, BarChart3, Clock, Loader2, AlertCircle, ChevronRight,
    ArrowLeft, X, Hash, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

/* ────────── constants ────────── */
const PERIODS = [
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' },
    { value: '12m', label: '12 Months' },
    { value: 'lifetime', label: 'Lifetime' },
];
const METRICS = [
    { value: 'value', label: 'Revenue', icon: IndianRupee },
    { value: 'orders', label: 'Orders', icon: ShoppingBag },
];
const INTERVALS = [
    { value: 'day', label: 'Daily' },
    { value: 'week', label: 'Weekly' },
    { value: 'month', label: 'Monthly' },
];
const TABS = [
    { value: 'sellers', label: 'Sellers', icon: Store },
    { value: 'industries', label: 'Industries', icon: Building2 },
];

const formatCurrency = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const formatNum = (n) => new Intl.NumberFormat('en-IN').format(n);

const RANK_STYLES = [
    'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-200 dark:shadow-amber-900/30',
    'bg-gradient-to-r from-gray-300 to-slate-400 text-white shadow-md',
    'bg-gradient-to-r from-amber-600 to-orange-700 text-white shadow-md',
];

/* ────────── main component ────────── */
const PerformanceRankingsPage = () => {
    const [tab, setTab] = useState('sellers');
    const [period, setPeriod] = useState('3m');
    const [metric, setMetric] = useState('value');
    const [limit, setLimit] = useState(10);

    // Rankings data
    const [rankings, setRankings] = useState(null);
    const [loadingRankings, setLoadingRankings] = useState(false);
    const [errorRankings, setErrorRankings] = useState(null);

    // Timeseries modal
    const [tsOpen, setTsOpen] = useState(null);   // { id, name }
    const [tsData, setTsData] = useState(null);
    const [tsLoading, setTsLoading] = useState(false);
    const [tsError, setTsError] = useState(null);
    const [tsInterval, setTsInterval] = useState('month');

    /* ── fetch rankings ── */
    const fetchRankings = useCallback(async () => {
        setLoadingRankings(true);
        setErrorRankings(null);
        try {
            const fn = tab === 'sellers' ? getSellerRankings : getIndustryRankings;
            const res = await fn(period, limit, metric);
            const payload = res?.data && typeof res.data === 'object' ? res.data : res;
            setRankings(payload);
        } catch (err) {
            setErrorRankings(err.message || 'Failed to load rankings');
        } finally {
            setLoadingRankings(false);
        }
    }, [tab, period, metric, limit]);

    useEffect(() => { fetchRankings(); }, [fetchRankings]);

    /* ── fetch timeseries ── */
    const openTimeseries = useCallback(async (id, name) => {
        setTsOpen({ id, name });
        setTsLoading(true);
        setTsError(null);
        setTsData(null);
        try {
            const fn = tab === 'sellers' ? getSellerTimeseries : getIndustryTimeseries;
            const res = await fn(id, period, 'month', metric);
            const payload = res?.data && typeof res.data === 'object' ? res.data : res;
            setTsData(payload);
        } catch (err) {
            setTsError(err.message || 'Failed to load timeseries');
        } finally {
            setTsLoading(false);
        }
    }, [tab, period, metric]);

    const refetchTimeseries = useCallback(async (interval) => {
        if (!tsOpen) return;
        setTsLoading(true);
        setTsError(null);
        try {
            const fn = tab === 'sellers' ? getSellerTimeseries : getIndustryTimeseries;
            const res = await fn(tsOpen.id, period, interval, metric);
            const payload = res?.data && typeof res.data === 'object' ? res.data : res;
            setTsData(payload);
        } catch (err) {
            setTsError(err.message || 'Failed to load timeseries');
        } finally {
            setTsLoading(false);
        }
    }, [tsOpen, tab, period, metric]);

    useEffect(() => {
        if (tsOpen) refetchTimeseries(tsInterval);
    }, [tsInterval]);

    const closeTimeseries = () => { setTsOpen(null); setTsData(null); setTsError(null); };

    const items = rankings?.data || [];

    /* ────────── RENDER ────────── */
    return (
        <div className="space-y-6 p-2">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Trophy size={28} className="text-amber-500" />
                    Performance Rankings
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Compare sellers and industries by revenue and order volume</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                {TABS.map(t => (
                    <button
                        key={t.value}
                        onClick={() => { setTab(t.value); setTsOpen(null); }}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.value
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/40'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        <t.icon size={16} />
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 flex flex-wrap items-center gap-3">
                {/* Period */}
                <div className="flex gap-1.5">
                    {PERIODS.map(p => (
                        <button
                            key={p.value}
                            onClick={() => setPeriod(p.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p.value
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-300 dark:ring-blue-700'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            <Clock size={12} className="inline mr-1 -mt-0.5" />
                            {p.label}
                        </button>
                    ))}
                </div>

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />

                {/* Metric */}
                <div className="flex gap-1.5">
                    {METRICS.map(m => (
                        <button
                            key={m.value}
                            onClick={() => setMetric(m.value)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${metric === m.value
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-300 dark:ring-emerald-700'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            <m.icon size={12} />
                            {m.label}
                        </button>
                    ))}
                </div>

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />

                {/* Limit */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Show</span>
                    <select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 outline-none"
                    >
                        {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>
            </div>

            {/* Loading */}
            {loadingRankings && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                    <Loader2 size={40} className="animate-spin text-blue-500 mx-auto" />
                    <p className="mt-3 text-gray-500">Loading {tab} rankings...</p>
                </div>
            )}

            {/* Error */}
            {errorRankings && !loadingRankings && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 flex items-start gap-4">
                    <AlertCircle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-red-800 dark:text-red-300">Error Loading Rankings</h3>
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errorRankings}</p>
                        <button onClick={fetchRankings} className="mt-3 text-sm font-medium text-red-700 dark:text-red-300 hover:underline">Try again</button>
                    </div>
                </div>
            )}

            {/* Rankings Table */}
            {!loadingRankings && !errorRankings && rankings && (
                <>
                    {items.length === 0 ? (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                            <BarChart3 size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Data</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">No rankings data available for this period.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item, idx) => {
                                const isSeller = tab === 'sellers';
                                const id = isSeller ? item.sellerId : item.industryId;
                                const name = isSeller ? item.sellerName : item.industry;
                                const maxVal = Math.max(...items.map(i => i.totalValue));
                                const pct = maxVal > 0 ? (item.totalValue / maxVal) * 100 : 0;

                                return (
                                    <div
                                        key={id}
                                        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                                    >
                                        <div className="p-5 flex items-center gap-4">
                                            {/* Rank Badge */}
                                            <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg ${idx < 3 ? RANK_STYLES[idx] : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                                                }`}>
                                                {item.rank}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">{name}</h3>
                                                    {idx === 0 && <Trophy size={16} className="text-amber-500 flex-shrink-0" />}
                                                </div>
                                                {/* Bar */}
                                                <div className="mt-2 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="hidden md:flex items-center gap-6 flex-shrink-0">
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(item.totalValue)}</div>
                                                    <div className="text-xs text-gray-500">Revenue</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-gray-900 dark:text-white">{formatNum(item.totalOrders)}</div>
                                                    <div className="text-xs text-gray-500">Orders</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(item.avgOrderValue)}</div>
                                                    <div className="text-xs text-gray-500">Avg Order</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                                        {formatNum(isSeller ? item.uniqueBuyers : item.activeBuyers)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{isSeller ? 'Buyers' : 'Active'}</div>
                                                </div>
                                            </div>

                                            {/* Chart button */}
                                            <button
                                                onClick={() => openTimeseries(id, name)}
                                                className="flex-shrink-0 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                                title="View trend chart"
                                            >
                                                <TrendingUp size={18} />
                                            </button>
                                        </div>

                                        {/* Mobile stats */}
                                        <div className="md:hidden px-5 pb-4 grid grid-cols-4 gap-3 text-center">
                                            <div>
                                                <div className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(item.totalValue)}</div>
                                                <div className="text-[11px] text-gray-500">Revenue</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900 dark:text-white">{formatNum(item.totalOrders)}</div>
                                                <div className="text-[11px] text-gray-500">Orders</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-emerald-600">{formatCurrency(item.avgOrderValue)}</div>
                                                <div className="text-[11px] text-gray-500">Avg</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-purple-600">
                                                    {formatNum(isSeller ? item.uniqueBuyers : item.activeBuyers)}
                                                </div>
                                                <div className="text-[11px] text-gray-500">{isSeller ? 'Buyers' : 'Active'}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {/* --- Timeseries Modal --- */}
            {tsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeTimeseries}>
                    <div
                        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-5 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <TrendingUp size={20} className="text-blue-500" />
                                    {tsOpen.name}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                    {metric === 'value' ? 'Revenue' : 'Orders'} trend · {PERIODS.find(p => p.value === period)?.label}
                                </p>
                            </div>
                            <button onClick={closeTimeseries} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Interval pills */}
                        <div className="px-5 pt-4 flex gap-2">
                            {INTERVALS.map(i => (
                                <button
                                    key={i.value}
                                    onClick={() => setTsInterval(i.value)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tsInterval === i.value
                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-300 dark:ring-blue-700'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {i.label}
                                </button>
                            ))}
                        </div>

                        {/* Chart Area */}
                        <div className="p-5">
                            {tsLoading ? (
                                <div className="text-center py-12">
                                    <Loader2 size={36} className="animate-spin text-blue-500 mx-auto" />
                                    <p className="mt-3 text-gray-500 text-sm">Loading chart data...</p>
                                </div>
                            ) : tsError ? (
                                <div className="text-center py-12">
                                    <AlertCircle size={36} className="text-red-400 mx-auto mb-2" />
                                    <p className="text-red-500 text-sm">{tsError}</p>
                                </div>
                            ) : tsData?.points?.length > 0 ? (
                                <TimeseriesChart points={tsData.points} metric={metric} />
                            ) : (
                                <div className="text-center py-12">
                                    <BarChart3 size={36} className="text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm">No timeseries data</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ────────── Timeseries Bar Chart ────────── */
const TimeseriesChart = ({ points, metric }) => {
    const maxVal = Math.max(...points.map(p => p.value), 1);
    const total = points.reduce((s, p) => s + p.value, 0);
    const avg = points.length > 0 ? total / points.length : 0;

    // Trend: compare last point to first
    const first = points[0]?.value || 0;
    const last = points[points.length - 1]?.value || 0;
    const trendPct = first > 0 ? ((last - first) / first) * 100 : 0;
    const trendUp = trendPct >= 0;

    const CHART_COLORS = [
        'from-blue-400 to-blue-600',
        'from-indigo-400 to-indigo-600',
        'from-violet-400 to-violet-600',
        'from-purple-400 to-purple-600',
        'from-blue-500 to-indigo-500',
        'from-indigo-500 to-violet-500',
        'from-violet-500 to-purple-500',
        'from-blue-400 to-violet-500',
        'from-indigo-400 to-purple-500',
        'from-blue-500 to-purple-600',
        'from-violet-400 to-blue-500',
        'from-purple-400 to-indigo-500',
    ];

    return (
        <div>
            {/* Summary row */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 flex-1 min-w-[120px]">
                    <div className="text-xs text-gray-500 mb-1">Total</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {metric === 'value' ? formatCurrency(total) : formatNum(total)}
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 flex-1 min-w-[120px]">
                    <div className="text-xs text-gray-500 mb-1">Average</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {metric === 'value' ? formatCurrency(avg) : formatNum(Math.round(avg))}
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 flex-1 min-w-[120px]">
                    <div className="text-xs text-gray-500 mb-1">Trend</div>
                    <div className={`text-lg font-bold flex items-center gap-1 ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {trendUp ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                        {Math.abs(trendPct).toFixed(1)}%
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="flex items-end gap-1.5 h-52">
                {points.map((pt, idx) => {
                    const h = maxVal > 0 ? (pt.value / maxVal) * 100 : 0;
                    const color = CHART_COLORS[idx % CHART_COLORS.length];
                    return (
                        <div key={pt.date} className="flex-1 flex flex-col items-center group relative">
                            {/* Tooltip */}
                            <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                <div className="font-semibold">{pt.date}</div>
                                <div>{metric === 'value' ? formatCurrency(pt.value) : formatNum(pt.value)}</div>
                            </div>
                            {/* Bar */}
                            <div
                                className={`w-full rounded-t-lg bg-gradient-to-t ${color} transition-all duration-500 min-h-[4px] hover:opacity-80`}
                                style={{ height: `${Math.max(h, 2)}%` }}
                            />
                            {/* Label */}
                            <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1.5 truncate max-w-full text-center leading-tight">
                                {pt.date}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PerformanceRankingsPage;
