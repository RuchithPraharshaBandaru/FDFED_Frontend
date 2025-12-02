import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, ShoppingBag, User, Moon, Sun, X } from 'lucide-react';
import { selectCartTotalQuantity } from '../../store/slices/cartSlice';
import { selectIsAuthenticated, logoutUser } from '../../store/slices/authSlice';
import { selectTheme, toggleTheme } from '../../store/slices/themeSlice';
import Button from '../ui/Button';
import { searchProducts } from '../../services/api';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    
    const cartCount = useSelector(selectCartTotalQuantity);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const theme = useSelector(selectTheme);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/');
    };
    
    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowResults(false);
            navigate(`/store?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setSearchResults([]);
        }
    };

    const handleProductClick = () => {
        setShowResults(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowResults(false);
    };

    // Live search as user types
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchQuery.trim().length >= 2) {
                setIsSearching(true);
                try {
                    const results = await searchProducts(searchQuery);
                    setSearchResults(results.slice(0, 6)); // Limit to 6 results
                    setShowResults(true);
                } catch (error) {
                    console.error('Search error:', error);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    // Click outside to close search results
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo & Links */}
                <div className="flex items-center space-x-8">
                     <Link to="/" className="text-2xl font-bold text-primary tracking-tight">
                        SwiftMart
                    </Link>
                    <ul className="hidden md:flex space-x-6 items-center">
                        <li><Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Home</Link></li>
                        <li><Link to="/store" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Shop</Link></li>
                        <li><Link to="/sell" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Sell</Link></li>
                        <li><Link to="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">About</Link></li>
                    </ul>
                </div>
                
                {/* Right Actions */}
                <div className="flex items-center space-x-4">
                     {/* Search Input with Dropdown */}
                     <div ref={searchRef} className="relative hidden sm:block">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <input 
                                type="text" 
                                placeholder="Search items..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.trim().length >= 2 && searchResults.length > 0 && setShowResults(true)}
                                className="h-9 w-64 rounded-md border border-input bg-background px-3 py-1 pl-9 pr-8 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                                >
                                    <X className="h-3 w-3 text-muted-foreground" />
                                </button>
                            )}
                        </form>
                        
                        {/* Search Results Dropdown */}
                        {showResults && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 mt-2 bg-background border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl overflow-hidden z-[100] w-[600px]">
                                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                        Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    <div className="p-3 space-y-2">
                                        {searchResults.map((product) => (
                                            <Link
                                                key={product._id}
                                                to={`/product/${product._id}`}
                                                onClick={handleProductClick}
                                                className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors group"
                                            >
                                                {product.imageSrc ? (
                                                    <img
                                                        src={product.imageSrc}
                                                        alt={product.title}
                                                        className="w-24 h-24 object-cover rounded-md border border-gray-200 dark:border-gray-700 flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center flex-shrink-0">
                                                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-base font-semibold text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 truncate">
                                                        {product.title}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground truncate mt-1">
                                                        {product.fabric} • {product.size} • {product.gender}
                                                    </p>
                                                    <p className="text-base font-bold text-green-600 dark:text-green-400 mt-2">
                                                        ${product.price}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
                                    <button
                                        onClick={handleSearchSubmit}
                                        className="w-full text-xs text-center py-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                                    >
                                        See all results for "{searchQuery}"
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* Loading State */}
                        {isSearching && showResults && (
                            <div className="absolute top-full left-0 mt-2 bg-background border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-[100] w-[600px]">
                                <p className="text-sm text-muted-foreground text-center">Searching...</p>
                            </div>
                        )}
                        
                        {/* No Results */}
                        {showResults && !isSearching && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                            <div className="absolute top-full left-0 mt-2 bg-background border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-[100] w-[600px]">
                                <p className="text-sm text-muted-foreground text-center">No products found for "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Theme Toggle */}
                    <Button variant="ghost" size="icon" onClick={handleThemeToggle} aria-label="Toggle theme">
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                    
                    {/* Cart */}
                    <Link to="/cart" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ShoppingBag className="h-5 w-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Auth Buttons */}
                    {isAuthenticated ? (
                        <>
                            <Link to="/account" className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                                <User className="h-5 w-5" />
                            </Link>
                            <Button onClick={handleLogout} variant="destructive" size="sm">
                                Logout
                            </Button>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login">
                                <Button variant="ghost" size="sm">Login</Button>
                            </Link>
                            <Link to="/signup">
                                <Button variant="default" size="sm">Sign Up</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;