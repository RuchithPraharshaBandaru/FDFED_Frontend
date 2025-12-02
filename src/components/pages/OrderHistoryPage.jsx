// src/components/pages/OrderHistoryPage.jsx
import React from 'react';
import { apiGetOrderHistory } from '../../services/api';
import { Link } from 'react-router-dom';
import { useFetchData } from '../../hooks';

const OrderHistoryPage = () => {
    const { data, loading, error } = useFetchData(apiGetOrderHistory, []);
    const orders = data?.orders || [];

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
                                <h3 className="font-bold text-lg bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent">Order ID: {order.orderId}</h3>
                                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{new Date(order.orderDate).toLocaleDateString()}</span>
                            </div>
                            <p className="dark:text-gray-300 mb-2">Status: <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm">{order.status}</span></p>
                            <p className="dark:text-gray-300 font-semibold">Total: <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">${order.totalAmount.toFixed(2)}</span></p>
                            
                            <div className="mt-4 bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30 dark:border-gray-600/30">
                                <h4 className="font-bold mb-3 text-gray-700 dark:text-gray-200">Items:</h4>
                                <ul className="space-y-2">
                                    {order.products.map((item) => (
                                        // --- THIS IS THE FIX ---
                                        // We must check if item.productId exists (it could be null if deleted)
                                        item.productId ? (
                                            <li key={item.productId._id} className="flex items-center justify-between py-2 border-b border-gray-200/30 dark:border-gray-600/30 last:border-0">
                                                <div>
                                                    <Link to={`/product/${item.productId._id}`} className="text-green-600 dark:text-green-400 hover:underline font-semibold">
                                                        {item.productId.title}
                                                    </Link>
                                                    <span className="text-gray-500 ml-2 font-medium"> (x {item.quantity})</span>
                                                </div>
                                                <span className="font-bold dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                                            </li>
                                        ) : (
                                            // This fallback renders if the product was deleted
                                            // We use item._id (from the order schema) as the key
                                            <li key={item._id} className="flex items-center justify-between py-2 border-b border-gray-200/30 dark:border-gray-600/30 last:border-0">
                                                <span className="text-gray-500 italic">Product no longer available</span>
                                                <span className="font-bold dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                                            </li>
                                        )
                                        // --- END OF FIX ---
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