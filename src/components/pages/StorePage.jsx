import React, { useState, useEffect } from 'react';
import { fetchFilteredProducts } from '../../services/api.js';
import ProductCard from '../ui/ProductCard';
import FilterSidebar from '../ui/FilterSidebar';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const StorePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: '',
        minPrice: null,
        maxPrice: null
    });

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const productData = await fetchFilteredProducts(filters);
                setProducts(productData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(() => loadProducts(), 200);
        return () => clearTimeout(timer);
    }, [filters]);

    const handleFilterChange = (filterType, value) => {
        setFilters(prevFilters => {
            if (filterType === 'price') {
                return { ...prevFilters, ...value };
            }
            return { ...prevFilters, [filterType]: value };
        });
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto py-10 px-6 flex">
                <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />

                <main className="flex-1">
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-800">Shop Sustainable Fashion</h1>
                            <p className="text-gray-500 mt-1">
                                Discover unique, pre-loved pieces from our community.
                            </p>
                        </div>
                        <div className="relative">
                            <select className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                                <option>Sort by: Newest</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                            <ChevronDown className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="bg-gray-200 h-80 w-full rounded-md animate-pulse"></div>
                            ))
                        ) : (
                            products.length > 0 ? (
                                products.map(product => <ProductCard key={product._id} {...product} />)
                            ) : (
                                <p className="col-span-full text-center text-gray-500">No products found.</p>
                            )
                        )}
                        {error && <p className="col-span-full text-center text-red-500">{error}</p>}
                    </div>

                    {/* Pagination */}
                    <div className="mt-12 flex justify-center items-center space-x-2">
                        <button className="p-2 rounded hover:bg-gray-100"><ChevronLeft className="h-5 w-5" /></button>
                        <button className="px-4 py-2 rounded text-gray-700 hover:bg-gray-100">1</button>
                        <button className="px-4 py-2 rounded text-white bg-green-600">2</button>
                        <button className="px-4 py-2 rounded text-gray-700 hover:bg-gray-100">3</button>
                        <span className="text-gray-500">...</span>
                        <button className="px-4 py-2 rounded text-gray-700 hover:bg-gray-100">9</button>
                        <button className="p-2 rounded hover:bg-gray-100"><ChevronRight className="h-5 w-5" /></button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StorePage;