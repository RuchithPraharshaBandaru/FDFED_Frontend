    // src/components/pages/MyDonationsPage.jsx
import React from 'react';
import { apiGetDonatedProducts } from '../../services/api';
import { Link } from 'react-router-dom';
import { useFetchData } from '../../hooks';

const MyDonationsPage = () => {
    const { data, loading, error } = useFetchData(apiGetDonatedProducts, []);
    const products = data?.products || [];

    if (loading) return <div className="text-center py-12 text-gray-700 dark:text-gray-300 font-semibold">Loading sold products...</div>;
    if (error) return <div className="text-red-600 dark:text-red-400 font-semibold">{error}</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white bg-clip-text text-transparent">My Sold Products</h2>
            {products.length === 0 ? (
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50 text-center">
                    <p className="dark:text-gray-300">You have not sold any products yet. <Link to="/sell" className="text-green-500 hover:underline font-bold">List one now!</Link></p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl hover:border-green-500/30 transition-all">
                            {product.imageSrc ? (
                                <img src={product.imageSrc} alt={product.items} className="w-full h-48 object-cover" />
                            ) : (
                                <div className="w-full h-48 bg-gradient-to-br from-gray-200/50 to-gray-300/50 dark:from-gray-700/50 dark:to-gray-600/50 backdrop-blur-sm flex items-center justify-center text-gray-500 dark:text-gray-400 font-semibold">No Image</div>
                            )}
                            <div className="p-4 space-y-2">
                                <h3 className="font-bold text-lg bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent">{product.items}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{product.fabric} - {product.size} - {product.gender}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Usage: {product.readableUsage}</p>
                                <p className="text-sm dark:text-gray-300">Status: <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm">{product.userStatus}</span></p>
                                <p className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-2">Value: {product.estimated_value} pts</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyDonationsPage;