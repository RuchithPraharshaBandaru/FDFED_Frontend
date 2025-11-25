    // src/components/pages/MyDonationsPage.jsx
import React, { useState, useEffect } from 'react';
import { apiGetDonatedProducts } from '../../services/api';
import { Link } from 'react-router-dom';

const MyDonationsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDonations = async () => {
            setLoading(true);
            try {
                const data = await apiGetDonatedProducts();
                if (data.success) {
                    setProducts(data.products);
                }
            } catch (err) {
                setError('Failed to load donated products.');
            }
            setLoading(false);
        };
        fetchDonations();
    }, []);

    if (loading) return <div className="dark:text-white">Loading donated products...</div>;
    if (error) return <div className="text-red-600 dark:text-red-400">{error}</div>;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">My Donated Products</h2>
            {products.length === 0 ? (
                <p className="dark:text-gray-300">You have not donated any products yet. <Link to="/sell" className="text-green-500 hover:underline">Donate now!</Link></p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="border dark:border-gray-700 rounded-lg overflow-hidden shadow-sm dark:bg-gray-700">
                            {product.imageSrc ? (
                                <img src={product.imageSrc} alt={product.items} className="w-full h-48 object-cover" />
                            ) : (
                                <div className="w-full h-48 bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400">No Image</div>
                            )}
                            <div className="p-4">
                                <h3 className="font-semibold text-lg dark:text-white">{product.items}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{product.fabric} - {product.size} - {product.gender}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Usage: {product.readableUsage}</p>
                                <p className="text-sm dark:text-gray-300">Status: <span className="font-medium text-green-500">{product.userStatus}</span></p>
                                <p className="text-lg font-bold text-green-500 mt-2">Value: {product.estimated_value} pts</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyDonationsPage;