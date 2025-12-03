import React, { useEffect, useState } from 'react';
import Badge from '../ui/Badge';
import { getIndustryDashboard } from '../../services/api';
import { TrendingUp, Package, DollarSign, ShoppingCart } from 'lucide-react';

const IndustryDashboardPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try {
                const res = await getIndustryDashboard();
                if (!mounted) return;
                setData(res || null);
            } catch (err) {
                if (mounted) setError(err.message || 'Failed to load dashboard');
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background py-12">
                <div className="container mx-auto px-4">
                    <div className="animate-pulse space-y-4">
                        <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[1,2,3].map(i => (
                                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background py-12">
                <div className="container mx-auto px-4">
                    <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                        <p className="font-semibold">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    const orders = data?.orders || [];
    const totalAmount = data?.totalAmount || 0;
    const totalOrders = orders.length;
    const totalItems = orders.reduce((sum, order) => sum + (order.quantity || 0), 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/10 to-cyan-50/10 dark:from-gray-950 dark:via-blue-950/10 dark:to-cyan-950/10 py-12">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="mb-8">
                    <Badge className="mb-2 bg-blue-500 hover:bg-blue-600 border-none text-white">Dashboard</Badge>
                    <h1 className="text-4xl font-bold mb-2">Order Dashboard</h1>
                    <p className="text-muted-foreground">Track your bulk orders and spending</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Total Orders</h3>
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold">{totalOrders}</p>
                        <p className="text-xs text-muted-foreground mt-2">Bulk orders placed</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Total Items</h3>
                            <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center">
                                <Package className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold">{totalItems}</p>
                        <p className="text-xs text-muted-foreground mt-2">Fabric combinations ordered</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Total Spent</h3>
                            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold">₹{totalAmount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-2">Total investment</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Avg Order</h3>
                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold">₹{(totalAmount / Math.max(totalOrders, 1)).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-2">Per order average</p>
                    </div>
                </div>

                {/* Orders List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-border shadow-sm">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-xl font-bold">Order History</h2>
                    </div>

                    {orders.length === 0 ? (
                        <div className="p-12 text-center">
                            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                            <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                            <p className="text-muted-foreground">You haven't placed any bulk orders yet. Start shopping now!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-border bg-muted/30">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Fabric</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Size</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Quantity</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Amount</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {orders.map((order, idx) => (
                                        <tr key={order.id || order._id || idx} className="hover:bg-muted/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-medium">{order.fabric || 'Fabric'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm">{order.size || 'N/A'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline">{order.quantity || 0} units</Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-blue-600">₹{(order.amount || 0).toLocaleString()}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none">
                                                    Completed
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {orders.length > 0 && (
                        <div className="p-6 border-t border-border bg-muted/20">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total from {totalOrders} orders</span>
                                <span className="text-2xl font-bold text-blue-600">₹{totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IndustryDashboardPage;
