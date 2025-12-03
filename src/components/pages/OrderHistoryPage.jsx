// src/components/pages/OrderHistoryPage.jsx
import React, { useMemo } from 'react';
import { apiGetOrderHistory } from '../../services/api';
import { Link } from 'react-router-dom';
import { useFetchData } from '../../hooks';

const OrderHistoryPage = () => {
    const { data, loading, error } = useFetchData(apiGetOrderHistory, []);
    const allOrders = data?.orders || [];
    
    // Process orders: Filter valid ones and Sort by date (Latest first)
    const orders = useMemo(() => {
        // 1. Filter out orders where product data might be missing
        const validOrders = allOrders.filter(order => 
            order.products && order.products.some(item => item.productId !== null)
        );

        // 2. Sort by orderDate descending (Newest first)
        // We use the new 'orderDate' field from the backend, falling back to createdAt if needed
        return validOrders.sort((a, b) => {
            const dateA = new Date(a.orderDate || a.createdAt || 0);
            const dateB = new Date(b.orderDate || b.createdAt || 0);
            return dateB - dateA;
        });
    }, [allOrders]);

    // Helper to format date safely
    const formatDate = (dateString) => {
        if (!dateString) return 'Date Pending';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Date Pending' : date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) return <div className="text-center py-12 text-gray-700 dark:text-gray-300 font-semibold">Loading order history...</div>;
    if (error) return <div className="text-red-600 dark:text-red-400 font-semibold">{error}</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white bg-clip-text text-transparent">Order History</h2>
            {orders.length === 0 ? (
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50 text-center">
                    <p className="dark:text-gray-300 font-medium">You have not placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.orderId} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl hover:border-green-500/30 transition-all">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent">
                                    Order ID: {order.orderId}
                                </h3>
                                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {formatDate(order.orderDate || order.createdAt)}
                                </span>
                            </div>
                            <div className="mb-4 flex gap-4 text-sm">
                                <p className="dark:text-gray-300">
                                    Status: <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                                        'bg-blue-100 text-blue-800'
                                    }`}>{order.status}</span>
                                </p>
                                <p className="dark:text-gray-300 font-semibold">
                                    Total: <span className="text-green-600 dark:text-green-400">₹{order.totalAmount?.toFixed(2)}</span>
                                </p>
                            </div>
                            
                            <div className="mt-4 bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30 dark:border-gray-600/30">
                                <h4 className="font-bold mb-3 text-gray-700 dark:text-gray-200">Items:</h4>
                                <ul className="space-y-3">
                                    {order.products.filter(item => item.productId !== null).map((item, index) => (
                                        <li key={item.productId._id || index} className="flex items-center gap-4 py-3 border-b border-gray-200/30 dark:border-gray-600/30 last:border-0">
                                            {/* Image Handling */}
                                            {(item.productId.image || item.productId.imageSrc) ? (
                                                <img 
                                                    src={item.productId.image || item.productId.imageSrc} 
                                                    alt={item.productId.title} 
                                                    className="w-16 h-16 object-cover rounded-lg shadow-sm bg-gray-100 dark:bg-gray-800"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-500 font-medium">
                                                    No Img
                                                </div>
                                            )}
                                            
                                            <div className="flex-1">
                                                <Link to={`/product/${item.productId._id}`} className="text-green-600 dark:text-green-400 hover:underline font-semibold line-clamp-1">
                                                    {item.productId.title}
                                                </Link>
                                                <div className="flex items-center text-gray-500 text-xs mt-1">
                                                    <span className="font-medium">Qty: {item.quantity}</span>
                                                    {item.size && <span className="ml-3 border-l pl-3 border-gray-300 dark:border-gray-600">Size: {item.size}</span>}
                                                </div>
                                            </div>
                                            <span className="font-bold dark:text-white whitespace-nowrap">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;