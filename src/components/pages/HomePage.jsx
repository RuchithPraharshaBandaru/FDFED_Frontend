import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../ui/ProductCard';
import { fetchProducts } from '../../services/api.js';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const productData = await fetchProducts();
                setProducts(productData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            {/* Hero Section - Matching the original EJS */}
            <section className="relative bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 font-sans">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex items-center">
                        <div className="w-1/2 relative z-10">
                            <h1 className="text-5xl font-extrabold text-green-900 dark:text-white mb-4 leading-tight">
                                Outpace the changing <br /> <span className="text-green-500">trend - Sustainably fast</span>
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                                Stay ahead with sustainable, trend-driven fashion and essentials.<br />
                                Shop stylishly, live sustainably.
                            </p>
                            <Link to="/store" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
                                Shop Now <i className="fas fa-arrow-right ml-2"></i>
                            </Link>
                        </div>
                        <div className="w-full md:w-1/2">
                            <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
                                alt="Sustainable Fashion" className="w-full rounded-lg shadow-lg object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Categories Section - Matching the original EJS */}
            <section className="py-12 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative overflow-hidden rounded-lg bg-green-100 dark:bg-gray-700 p-8 flex">
                            <div className="w-1/2">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Fashion & Clothing</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">Get Upto 40% Off</p>
                                <Link to="/store" className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors">
                                    Shop Now
                                </Link>
                            </div>
                            <div className="w-1/2">
                                <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                                    alt="Fashion Collection" className="object-cover w-full h-48 rounded-lg" />
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-lg bg-green-100 dark:bg-gray-700 p-8 flex">
                            <div className="w-1/2">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Sell SecondHand Clothes</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">Get Upto 5% Off</p>
                                <Link to="/sell" className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors">
                                    Shop Now
                                </Link>
                            </div>
                            <div className="w-1/2">
                                <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80"
                                    alt="Home Appliances" className="object-cover w-full h-48 rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Products Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-8 text-center tracking-tight dark:text-white">Popular Products</h2>
                    {loading && <p className="text-center dark:text-gray-300">Loading products...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map(product => (
                            <ProductCard key={product._id} {...product} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;