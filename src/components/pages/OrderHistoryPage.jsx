// src/components/pages/OrderHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { apiGetOrderHistory } from '../../services/api';
import { Link } from 'react-router-dom';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const data = await apiGetOrderHistory();
                if (data.success) {
                    setOrders(data.orders);
                }
            } catch (err) {
                setError('Failed to load order history.');
            }
            setLoading(false);
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="dark:text-white">Loading order history...</div>;
    if (error) return <div className="text-red-600 dark:text-red-400">{error}</div>;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">Order History</h2>
            {orders.length === 0 ? (
                <p className="dark:text-gray-300">You have not placed any orders yet.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.orderId} className="border dark:border-gray-700 rounded-lg p-4 dark:bg-gray-700">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold dark:text-white">Order ID: {order.orderId}</h3>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{new Date(order.orderDate).toLocaleDateString()}</span>
                            </div>
                            <p className="dark:text-gray-300">Status: <span className="font-medium text-green-500">{order.status}</span></p>
                            <p className="dark:text-gray-300">Total: <span className="font-medium">${order.totalAmount.toFixed(2)}</span></p>
                            
                            <div className="mt-4">
                                <h4 className="font-medium mb-2 dark:text-white">Items:</h4>
                                <ul className="list-disc pl-5 space-y-2">
                                    {order.products.map((item) => (
                                        // --- THIS IS THE FIX ---
                                        // We must check if item.productId exists (it could be null if deleted)
                                        item.productId ? (
                                            <li key={item.productId._id} className="flex items-center justify-between">
                                                <div>
                                                    <Link to={`/product/${item.productId._id}`} className="text-green-500 hover:underline">
                                                        {item.productId.title}
                                                    </Link>
                                                    <span className="text-gray-500 ml-2"> (x {item.quantity})</span>
                                                </div>
                                                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                            </li>
                                        ) : (
                                            // This fallback renders if the product was deleted
                                            // We use item._id (from the order schema) as the key
                                            <li key={item._id} className="flex items-center justify-between">
                                                <span className="text-gray-500 italic">Product no longer available</span>
                                                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
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