// src/components/pages/SellerProductsPage.jsx
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { fetchSellerProducts, removeProduct } from '../../store/slices/sellerSlice';
import { apiDeleteProduct } from '../../services/sellerApi';
import { useToast } from '../../context/ToastContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Alert } from '../ui/Alert';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ProductsPageShimmer } from '../ui/Shimmer';

export const SellerProductsPage = () => {
    const dispatch = useDispatch();
    const { products, productsLoading } = useSelector((state) => state.seller);
    const [deleteError, setDeleteError] = useState(null);
    const [deletingIds, setDeletingIds] = useState(new Set());
    const { showSuccess, showError } = useToast();

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [stockFilter, setStockFilter] = useState('all');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        dispatch(fetchSellerProducts());
    }, [dispatch]);

    // Get unique categories from products
    const categories = useMemo(() => {
        const cats = [...new Set(products.map(p => p.category))].filter(Boolean);
        return cats.sort();
    }, [products]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.title?.toLowerCase().includes(query) ||
                product.description?.toLowerCase().includes(query) ||
                product.category?.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (selectedCategory) {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Stock filter
        if (stockFilter === 'in-stock') {
            filtered = filtered.filter(product => product.stock === true);
        } else if (stockFilter === 'out-of-stock') {
            filtered = filtered.filter(product => product.stock === false);
        }

        // Price range filter
        if (priceRange.min !== '') {
            filtered = filtered.filter(product => product.price >= parseFloat(priceRange.min));
        }
        if (priceRange.max !== '') {
            filtered = filtered.filter(product => product.price <= parseFloat(priceRange.max));
        }

        // Sort products
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'stock':
                filtered.sort((a, b) => b.quantity - a.quantity);
                break;
            case 'newest':
            default:
                // Keep original order (newest first from API)
                break;
        }

        return filtered;
    }, [products, searchQuery, selectedCategory, stockFilter, priceRange, sortBy]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setStockFilter('all');
        setPriceRange({ min: '', max: '' });
        setSortBy('newest');
    };

    const hasActiveFilters = searchQuery || selectedCategory || stockFilter !== 'all' || 
                            priceRange.min || priceRange.max || sortBy !== 'newest';


    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setDeletingIds(prev => new Set(prev).add(productId));
            setDeleteError(null);
            
            try {
                await apiDeleteProduct(productId);
                dispatch(removeProduct(productId));
                showSuccess('Product deleted successfully!');
            } catch (error) {
                const errorMsg = `Failed to delete product: ${error.message}`;
                setDeleteError(errorMsg);
                showError(errorMsg);
            } finally {
                setDeletingIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(productId);
                    return newSet;
                });
            }
        }
    };

    if (productsLoading) {
        return <ProductsPageShimmer />;
    }

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">My Products</h1>
                        <p className="text-muted-foreground mt-2">
                            {filteredProducts.length} of {products.length} products
                        </p>
                    </div>
                    <Link to="/seller/products/create">
                        <Button variant="primary">
                            Add New Product
                        </Button>
                    </Link>
                </div>

                {/* Search and Filter Bar */}
                <Card className="p-4 mb-6">
                    <div className="space-y-4">
                        {/* Search and Filter Toggle */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search products by name, description, or category..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2"
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                                {hasActiveFilters && (
                                    <Badge variant="primary" className="ml-1">
                                        Active
                                    </Badge>
                                )}
                            </Button>
                        </div>

                        {/* Expandable Filters */}
                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border">
                                {/* Category Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">All Categories</option>
                                        <option value="Cotton">Cotton</option>
                                        <option value="Silk">Silk</option>
                                        <option value="Leather">Leather</option>
                                        <option value="Cashmere">Cashmere</option>
                                        <option value="Synthetic">Synthetic</option>
                                        <option value="Denim">Denim</option>
                                        <option value="Polyester">Polyester</option>
                                        {categories.filter(cat => !['Cotton', 'Silk', 'Leather', 'Cashmere', 'Synthetic', 'Denim', 'Polyester'].includes(cat)).map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Stock Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Stock Status
                                    </label>
                                    <select
                                        value={stockFilter}
                                        onChange={(e) => setStockFilter(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="all">All Products</option>
                                        <option value="in-stock">In Stock</option>
                                        <option value="out-of-stock">Out of Stock</option>
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Price Range
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                            className="w-1/2 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                            className="w-1/2 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                {/* Sort By */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Sort By
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="name-asc">Name (A-Z)</option>
                                        <option value="name-desc">Name (Z-A)</option>
                                        <option value="price-low">Price (Low to High)</option>
                                        <option value="price-high">Price (High to Low)</option>
                                        <option value="stock">Stock (High to Low)</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Active Filters Summary */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border">
                                <span className="text-sm text-muted-foreground">Active filters:</span>
                                {searchQuery && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        Search: {searchQuery}
                                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                                    </Badge>
                                )}
                                {selectedCategory && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        Category: {selectedCategory}
                                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
                                    </Badge>
                                )}
                                {stockFilter !== 'all' && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        {stockFilter === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                                        <X className="h-3 w-3 cursor-pointer" onClick={() => setStockFilter('all')} />
                                    </Badge>
                                )}
                                {(priceRange.min || priceRange.max) && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        Price: ₹{priceRange.min || '0'} - ₹{priceRange.max || '∞'}
                                        <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange({ min: '', max: '' })} />
                                    </Badge>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="text-sm"
                                >
                                    Clear All
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {deleteError && (
                    <Alert variant="destructive" className="mb-6">
                        {deleteError}
                    </Alert>
                )}

                {/* Products Grid */}
                {products.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <h3 className="text-lg font-medium text-foreground mb-2">No products yet</h3>
                            <p className="text-muted-foreground mb-6">
                                Start selling by adding your first product to the store.
                            </p>
                            <Link to="/seller/products/create">
                                <Button variant="primary">
                                    Create Your First Product
                                </Button>
                            </Link>
                        </div>
                    </Card>
                ) : filteredProducts.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
                            <p className="text-muted-foreground mb-6">
                                Try adjusting your filters or search query.
                            </p>
                            <Button variant="outline" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                            <Card key={product._id} className="overflow-hidden">
                                {product.image && (
                                    <div className="aspect-w-16 aspect-h-9">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                                            {product.title}
                                        </h3>
                                        <Badge variant={product.stock ? 'success' : 'destructive'}>
                                            {product.stock ? 'In Stock' : 'Out of Stock'}
                                        </Badge>
                                    </div>
                                    
                                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                        {product.description}
                                    </p>
                                    
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Price:</span>
                                            <span className="font-medium text-foreground">₹{product.price}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Quantity:</span>
                                            <span className="font-medium text-foreground">{product.quantity}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Category:</span>
                                            <span className="font-medium text-foreground">{product.category}</span>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <Link to={`/seller/products/edit/${product._id}`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full">
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteProduct(product._id)}
                                            disabled={deletingIds.has(product._id)}
                                            className="flex-1"
                                        >
                                            {deletingIds.has(product._id) ? 'Deleting...' : 'Delete'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};