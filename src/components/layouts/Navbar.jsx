import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, ShoppingBag, User, Moon, Sun } from 'lucide-react';
import { selectCartTotalQuantity } from '../../store/slices/cartSlice';
import { selectIsAuthenticated, logoutUser } from '../../store/slices/authSlice';
import { selectTheme, toggleTheme } from '../../store/slices/themeSlice';
import Button from '../ui/Button';
import { fetchFilteredProducts } from '../../services/api';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const cartCount = useSelector(selectCartTotalQuantity);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const theme = useSelector(selectTheme);

    // Search States
    const [searchTerm, setSearchTerm] = useState('');
    const [allProducts, setAllProducts] = useState([]); 
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    // Fetch all products once on mount
    useEffect(() => {
        const loadSearchData = async () => {
            try {
                const data = await fetchFilteredProducts({});
                setAllProducts(data);
            } catch (err) {
                console.error("Failed to load products for search:", err);
            }
        };
        loadSearchData();
    }, []);

    // Filter products instantly as user types
    useEffect(() => {
        const term = searchTerm.toLowerCase().trim();

        if (term.length > 1) { 
            const results = allProducts.filter(product => 
                product.title.toLowerCase().includes(term) ||
                product.category.toLowerCase().includes(term)
            );
            setSearchResults(results.slice(0, 5)); 
            setShowDropdown(true);
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    }, [searchTerm, allProducts]);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/');
    };
    
    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            setShowDropdown(false); 
            navigate(`/store?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleResultClick = () => {
        setShowDropdown(false);
        setSearchTerm('');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
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
                     {/* Search Input Container */}
                     <div className="relative hidden sm:block">
                        {/* CHANGE 1: Made icon slightly larger (w-5 h-5) and adjusted position (left-3.5) */}
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        
                        {/* CHANGE 2: Increased width to w-80 (medium screens) and w-96 (large screens) */}
                        {/* CHANGE 3: Increased height to h-10 (was h-9) and padding to pl-10 */}
                        <input 
                            type="text" 
                            placeholder="Search items..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                            onFocus={() => searchTerm.length > 1 && setShowDropdown(true)}
                            className="h-10 w-80 lg:w-96 rounded-lg border border-input bg-transparent px-3 py-1 pl-10 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                        />

                        {/* Instant Search Results Dropdown */}
                        {showDropdown && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                                {searchResults.map((product) => (
                                    <Link 
                                        key={product._id} 
                                        to={`/product/${product._id}`}
                                        onClick={handleResultClick}
                                        className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b last:border-0 border-gray-100 dark:border-gray-700/50"
                                    >
                                        {/* CHANGE 4: Slightly larger image in dropdown (w-12 h-12) */}
                                        <img 
                                            src={product.image} 
                                            alt={product.title} 
                                            className="w-12 h-12 rounded-lg object-cover bg-gray-100" 
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{product.title}</h4>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-sm text-green-600 dark:text-green-400 font-bold">₹{product.price}</span>
                                                <span className="text-[10px] text-gray-400 uppercase tracking-wide px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">{product.category}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                <div 
                                    onClick={() => {
                                        navigate(`/store?search=${encodeURIComponent(searchTerm)}`);
                                        setShowDropdown(false);
                                    }}
                                    className="p-3 text-center text-sm font-medium text-primary cursor-pointer bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    View all matching results
                                </div>
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
                            <Link to="/auth">
                                <Button variant="outline" size="sm">Choose Role</Button>
                            </Link>
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