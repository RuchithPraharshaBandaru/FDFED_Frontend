import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, ShoppingBag, User, Moon, Sun } from 'lucide-react';
import { selectCartTotalQuantity } from '../../store/slices/cartSlice';
import { selectIsAuthenticated, logoutUser } from '../../store/slices/authSlice';
import { selectTheme, toggleTheme } from '../../store/slices/themeSlice';
import Button from '../ui/Button';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
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

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo & Links */}
                <div className="flex items-center space-x-8">
                     <Link to="/" className="text-2xl font-bold text-primary tracking-tight">
                        SwiftMart
                    </Link>
                    <ul className="hidden md:flex space-x-6 items-center">
                        <li><Link to="/store" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Shop</Link></li>
                        <li><Link to="/sell" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Sell</Link></li>
                        <li><Link to="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">About</Link></li>
                    </ul>
                </div>
                
                {/* Right Actions */}
                <div className="flex items-center space-x-4">
                     {/* Search Input */}
                     <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="Search items..." 
                            className="h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
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