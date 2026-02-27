// src/components/pages/admin/DispatchPage.jsx
import React, { useEffect, useState } from 'react';
import adminApi from '../../../services/adminApi';
import { Package, Truck, Check, Loader2 } from 'lucide-react';

const DispatchPage = () => {
    const [pendingItems, setPendingItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [deliveryFeeOverride, setDeliveryFeeOverride] = useState('');
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const fetchPendingItems = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getPendingItems();
            setPendingItems(data.items || []);
            setSelectedItems([]); // Clear selection on refresh
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingItems();
    }, []);

    const toggleItemSelection = (itemId) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter(id => id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
    };

    const handleCreatePickup = async () => {
        if (selectedItems.length === 0) return;

        try {
            setCreating(true);
            await adminApi.createPickup({
                itemIds: selectedItems,
                deliveryFeeOverride: deliveryFeeOverride ? Number(deliveryFeeOverride) : undefined
            });
            alert('Pickup created successfully!');
            setDeliveryFeeOverride('');
            fetchPendingItems();
        } catch (err) {
            alert(err.message);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dispatch & Pickup Creation</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending Items List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                            <h2 className="font-semibold text-gray-900 dark:text-white">Pending Items</h2>
                            <button onClick={fetchPendingItems} className="text-sm text-blue-600 hover:text-blue-500">Refresh</button>
                        </div>

                        {loading ? (
                            <div className="p-12 flex justify-center">
                                <Loader2 className="animate-spin text-blue-600" />
                            </div>
                        ) : pendingItems.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                                No pending items found.
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {pendingItems.map((item) => (
                                    <label key={item._id} className="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                                        <div className="flex items-center h-5">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item._id)}
                                                onChange={() => toggleItemSelection(item._id)}
                                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <p className="font-medium text-gray-900 dark:text-white">{item.items} ({item.size})</p>
                                            <p className="text-gray-500 dark:text-gray-400">Customer: {item.user_id?.firstname}</p>
                                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                                {item.user_id?.Address?.street || 'No Address'}, {item.user_id?.Address?.city}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Dispatch Action Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                <Truck className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create Pickup</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Selected Items:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{selectedItems.length}</span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Override Delivery Fee (Optional)
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        min="0"
                                        value={deliveryFeeOverride}
                                        onChange={(e) => setDeliveryFeeOverride(e.target.value)}
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Default"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleCreatePickup}
                                disabled={selectedItems.length === 0 || creating}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {creating ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Check className="-ml-1 mr-2 h-4 w-4" />
                                        Dispatch Pickup
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DispatchPage;
