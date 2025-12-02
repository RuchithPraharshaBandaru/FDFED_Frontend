import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchFilteredProducts } from '../../services/api.js';
import ProductCard from '../ui/ProductCard';
import FilterSidebar from '../ui/FilterSidebar';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePagination } from '../../hooks';
import { sortProducts } from '../../utils/sortHelpers';

const StorePage = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('newest');
    const [filters, setFilters] = useState({
        categories: [],
        minPrice: null,
        maxPrice: null,
        search: ''
    });

    // Sort products using utility function
    const sortedProducts = useMemo(() => {
        return sortProducts(products, sortBy);
    }, [products, sortBy]);

    // Use custom pagination hook
    const {
        currentPage,
        totalPages,
        currentItems: currentProducts,
        handlePageChange,
        handlePrevPage,
        handleNextPage,
        resetPage
    } = usePagination(sortedProducts, 9);

    // Handle search query from URL
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const searchQuery = searchParams.get('search');
        if (searchQuery) {
            setFilters(prev => ({ ...prev, search: searchQuery }));
        }
    }, [location.search]);

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

    const handleFilterChange = (filterType, value, isChecked) => {
        setFilters(prevFilters => {
            if (filterType === 'price') {
                return { ...prevFilters, ...value };
            }
            if (filterType === 'category') {
                const updatedCategories = isChecked
                    ? [...prevFilters.categories, value]
                    : prevFilters.categories.filter(cat => cat !== value);
                return { ...prevFilters, categories: updatedCategories };
            }
            return { ...prevFilters, [filterType]: value };
        });
        resetPage();
    };

    const handleResetFilters = () => {
        setFilters({
            categories: [],
            minPrice: null,
            maxPrice: null,
            search: ''
        });
        setSortBy('newest');
        resetPage();
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        resetPage();
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-green-50/15 to-emerald-50/20 dark:from-gray-950 dark:via-green-900/25 dark:to-emerald-900/20 overflow-hidden">
            {/* Futuristic background elements */}
            <div className="absolute inset-0 bg-dot-pattern opacity-[0.02] dark:opacity-[0.06] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-green-400/12 to-emerald-500/12 dark:from-green-500/20 dark:to-emerald-600/20 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-400/8 to-green-500/8 dark:from-emerald-600/15 dark:to-green-700/15 blur-3xl rounded-full" />
            
            <div className="relative container mx-auto py-10 px-6 flex">
                <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onResetFilters={handleResetFilters} />

                <main className="flex-1">
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/15 dark:to-emerald-500/15 border border-green-500/20 mb-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-medium text-green-700 dark:text-green-400">Sustainable Collection</span>
                            </div>
                            <h1 className="text-4xl font-extrabold">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 dark:from-white dark:via-green-400 dark:to-emerald-400">
                                    Shop Sustainable Fashion
                                </span>
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Discover unique, pre-loved pieces from our community.
                            </p>
                        </div>
                        <div className="relative">
                            <select 
                                value={sortBy}
                                onChange={handleSortChange}
                                className="appearance-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pl-4 pr-10 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm font-medium"
                            >
                                <option value="newest">Sort by: Newest</option>
                                <option value="price-low-high">Price: Low to High</option>
                                <option value="price-high-low">Price: High to Low</option>
                                <option value="rating">Rating: Highest First</option>
                                <option value="popular">Most Popular</option>
                            </select>
                            <ChevronDown className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="bg-gray-200/50 dark:bg-gray-800/50 h-80 w-full rounded-xl animate-pulse backdrop-blur-sm"></div>
                            ))
                        ) : (
                            currentProducts.length > 0 ? (
                                currentProducts.map(product => <ProductCard key={product._id} {...product} />)
                            ) : (
                                <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">No products found.</p>
                            )
                        )}
                        {error && <p className="col-span-full text-center text-red-500 dark:text-red-400">{error}</p>}
                    </div>

                    {/* Pagination */}
                    {!loading && products.length > 0 && (
                        <div className="mt-12 flex justify-center items-center space-x-2">
                            <button 
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg hover:bg-white/80 dark:hover:bg-gray-800/80 dark:text-white backdrop-blur-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNum = index + 1;
                                // Show first page, last page, current page, and pages around current
                                if (
                                    pageNum === 1 || 
                                    pageNum === totalPages || 
                                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`px-4 py-2 rounded-lg transition-all ${
                                                currentPage === pageNum
                                                    ? 'text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 backdrop-blur-sm'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                    return <span key={pageNum} className="text-gray-500 dark:text-gray-400">...</span>;
                                }
                                return null;
                            })}
                            
                            <button 
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg hover:bg-white/80 dark:hover:bg-gray-800/80 dark:text-white backdrop-blur-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default StorePage;