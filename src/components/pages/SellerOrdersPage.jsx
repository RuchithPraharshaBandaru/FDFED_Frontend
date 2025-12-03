// src/components/pages/SellerOrdersPage.jsx
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerOrders } from '../../store/slices/sellerSlice';
import { apiUpdateOrderStatus } from '../../services/sellerApi';
import { useToast } from '../../context/ToastContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export const SellerOrdersPage = () => {
    const dispatch = useDispatch();
    const { orders, ordersLoading } = useSelector((state) => state.seller);
    const { showSuccess, showError } = useToast();
    const [updatingOrder, setUpdatingOrder] = useState(null);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState('all');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        dispatch(fetchSellerOrders());
    }, [dispatch]);

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Delivered':
                return 'success';
            case 'Shipped':
                return 'default';
            case 'Processing':
            case 'Pending':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            setUpdatingOrder(orderId);
            await apiUpdateOrderStatus(orderId, newStatus);
            showSuccess(`Order status updated to ${newStatus}`);
            // Refresh orders to get updated data
            dispatch(fetchSellerOrders());
        } catch (error) {
            console.error('Failed to update order status:', error);
            showError(error.message || 'Failed to update order status');
        } finally {
            setUpdatingOrder(null);
        }
    };

    // Filter and sort orders
    const filteredOrders = useMemo(() => {
        let filtered = [...orders];

        // Search filter (order ID, customer name, email)
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(order => 
                order.orderId.toLowerCase().includes(search) ||
                `${order.buyer?.firstname} ${order.buyer?.lastname}`.toLowerCase().includes(search) ||
                order.buyer?.email?.toLowerCase().includes(search) ||
                order.items.some(item => item.title.toLowerCase().includes(search))
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Date range filter
        if (dateRange !== 'all') {
            const now = new Date();
            const orderDate = (order) => new Date(order.orderDate);
            
            filtered = filtered.filter(order => {
                const date = orderDate(order);
                switch (dateRange) {
                    case 'today':
                        return date.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return date >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        return date >= monthAgo;
                    default:
                        return true;
                }
            });
        }

        // Amount range filter
        const min = parseFloat(minAmount) || 0;
        const max = parseFloat(maxAmount) || Infinity;
        filtered = filtered.filter(order => order.totalAmount >= min && order.totalAmount <= max);

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.orderDate) - new Date(a.orderDate);
                case 'oldest':
                    return new Date(a.orderDate) - new Date(b.orderDate);
                case 'amount-high':
                    return b.totalAmount - a.totalAmount;
                case 'amount-low':
                    return a.totalAmount - b.totalAmount;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [orders, searchTerm, statusFilter, dateRange, minAmount, maxAmount, sortBy]);

    // Calculate statistics based on filtered orders
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalItems = filteredOrders.reduce((sum, order) => 
        sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setDateRange('all');
        setMinAmount('');
        setMaxAmount('');
        setSortBy('newest');
    };

    const activeFiltersCount = [
        searchTerm,
        statusFilter !== 'all',
        dateRange !== 'all',
        minAmount,
        maxAmount,
        sortBy !== 'newest'
    ].filter(Boolean).length;

    // Calculate statistics
    const allOrdersCount = orders.length;
    const allTotalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const allTotalItems = orders.reduce((sum, order) => 
        sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    if (ordersLoading) {
        return (
            <div className="min-h-screen bg-background py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center h-64">
                        <p className="text-muted-foreground">Loading orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Orders & Sales</h1>
                    <p className="text-muted-foreground mt-2">
                        Track your order requests and sales history ({allOrdersCount} total orders)
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-6 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                <Input
                                    type="text"
                                    placeholder="Search by order ID, customer, email, or product..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        
                        {/* Filter Toggle Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 text-foreground rounded-lg transition-colors border-2 border-border"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                            <span className="font-medium">Filters</span>
                            {activeFiltersCount > 0 && (
                                <Badge variant="default" className="ml-1">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                        </button>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-foreground">Filter Orders</h3>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-primary hover:text-primary/80 font-medium"
                                >
                                    Clear All
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Status Filter */}
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full h-11 rounded-lg border-2 border-border bg-background text-foreground px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </div>

                                {/* Date Range */}
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Date Range</label>
                                    <select
                                        value={dateRange}
                                        onChange={(e) => setDateRange(e.target.value)}
                                        className="w-full h-11 rounded-lg border-2 border-border bg-background text-foreground px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="all">All Time</option>
                                        <option value="today">Today</option>
                                        <option value="week">Last 7 Days</option>
                                        <option value="month">Last 30 Days</option>
                                    </select>
                                </div>

                                {/* Min Amount */}
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Min Amount (₹)</label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={minAmount}
                                        onChange={(e) => setMinAmount(e.target.value)}
                                        min="0"
                                    />
                                </div>

                                {/* Max Amount */}
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Max Amount (₹)</label>
                                    <Input
                                        type="number"
                                        placeholder="No limit"
                                        value={maxAmount}
                                        onChange={(e) => setMaxAmount(e.target.value)}
                                        min="0"
                                    />
                                </div>
                            </div>

                            {/* Sort By */}
                            <div className="mt-4">
                                <label className="text-sm font-medium text-foreground mb-2 block">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full md:w-64 h-11 rounded-lg border-2 border-border bg-background text-foreground px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="amount-high">Amount: High to Low</option>
                                    <option value="amount-low">Amount: Low to High</option>
                                </select>
                            </div>
                        </Card>
                    )}

                    {/* Active Filters Display */}
                    {activeFiltersCount > 0 && (
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm text-muted-foreground">Active filters:</span>
                            {searchTerm && (
                                <Badge variant="secondary" className="gap-1">
                                    Search: {searchTerm}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                                </Badge>
                            )}
                            {statusFilter !== 'all' && (
                                <Badge variant="secondary" className="gap-1">
                                    Status: {statusFilter}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setStatusFilter('all')} />
                                </Badge>
                            )}
                            {dateRange !== 'all' && (
                                <Badge variant="secondary" className="gap-1">
                                    Date: {dateRange}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setDateRange('all')} />
                                </Badge>
                            )}
                            {minAmount && (
                                <Badge variant="secondary" className="gap-1">
                                    Min: ₹{minAmount}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setMinAmount('')} />
                                </Badge>
                            )}
                            {maxAmount && (
                                <Badge variant="secondary" className="gap-1">
                                    Max: ₹{maxAmount}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setMaxAmount('')} />
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Results Count */}
                    {activeFiltersCount > 0 && (
                        <p className="text-sm text-muted-foreground">
                            Showing {totalOrders} of {allOrdersCount} orders
                        </p>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                                <p className="text-2xl font-bold text-foreground">{totalOrders}</p>
                            </div>
                            <div className="p-3 bg-blue-500/10 rounded-full">
                                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                                <p className="text-2xl font-bold text-foreground">
                                    ₹{totalRevenue.toFixed(2)}
                                </p>
                            </div>
                            <div className="p-3 bg-green-500/10 rounded-full">
                                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Items Sold</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {totalItems}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-500/10 rounded-full">
                                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Orders List */}
                {/* Orders Table */}
                {filteredOrders.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <h3 className="text-lg font-medium text-foreground mb-2">
                                {orders.length === 0 ? 'No orders yet' : 'No orders found'}
                            </h3>
                            <p className="text-muted-foreground">
                                {orders.length === 0 
                                    ? 'When customers purchase your products, their orders will appear here.'
                                    : 'Try adjusting your filters to see more results.'
                                }
                            </p>
                        </div>
                    </Card>
                ) : (
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-accent/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Products
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Shipping Address
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Order Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-background divide-y divide-border">
                                    {filteredOrders.map((order) => (
                                        <tr key={order.orderId} className="hover:bg-accent/30">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                                #{order.orderId.slice(-8)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-3">
                                                            {item.image && (
                                                                <img 
                                                                    src={item.image} 
                                                                    alt={item.title}
                                                                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                                                />
                                                            )}
                                                            <div>
                                                                <div className="text-sm font-medium text-foreground">{item.title}</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    ₹{item.price} × {item.quantity} = ₹{item.total}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {order.buyer ? (
                                                    <div>
                                                        <div className="text-sm font-medium text-foreground">
                                                            {order.buyer.firstname} {order.buyer.lastname}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">{order.buyer.email}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-foreground max-w-xs">
                                                    <div>{order.shippingAddress.fullname}</div>
                                                    <div className="text-muted-foreground">
                                                        {order.shippingAddress.plotno}, {order.shippingAddress.street}
                                                    </div>
                                                    <div className="text-muted-foreground">
                                                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                                                    </div>
                                                    <div className="text-muted-foreground">{order.shippingAddress.phone}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                                ₹{order.totalAmount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                {new Date(order.orderDate).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    {order.status === 'Delivered' ? (
                                                        <Badge variant={getStatusVariant(order.status)}>
                                                            {order.status}
                                                        </Badge>
                                                    ) : (
                                                        <>
                                                            <Badge variant={getStatusVariant(order.status)} className="mr-2">
                                                                {order.status}
                                                            </Badge>
                                                            <select
                                                                value={order.status}
                                                                onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                                                                disabled={updatingOrder === order.orderId}
                                                                className="h-9 rounded-lg border-2 border-border bg-background text-foreground px-3 py-1.5 text-sm font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 hover:border-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                <option value="Pending">Pending</option>
                                                                <option value="Processing">Processing</option>
                                                                <option value="Shipped">Shipped</option>
                                                                <option value="Delivered">Delivered</option>
                                                            </select>
                                                        </>
                                                    )}
                                                    {updatingOrder === order.orderId && (
                                                        <span className="text-xs text-muted-foreground">Updating...</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};