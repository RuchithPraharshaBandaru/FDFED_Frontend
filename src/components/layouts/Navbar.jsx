import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User } from 'lucide-react'; // 1. Import User icon
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; // 2. Import useAuth hook

const Navbar = () => {
    const { cartCount } = useCart();
    const { isAuthenticated, user, logout } = useAuth(); // 3. Get auth state and functions
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/'); // Redirect to homepage after logout
    };

    return (
        <header className="bg-white sticky top-0 z-50 border-b border-gray-200">
            <nav className="container mx-auto px-6">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-8">
                         <Link to="/" className="text-2xl font-bold text-green-700">
                        SwiftMart
                        </Link>
                        <ul className="hidden md:flex space-x-8 items-center">
                            <li><Link to="/store" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Shop</Link></li>
                            <li><Link to="/sell" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Sell</Link></li>
                            <li><Link to="/about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">About</Link></li>
                        </ul>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                         <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="text" placeholder="Search items..." className="pl-10 pr-4 py-2 w-48 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"/>
                        </div>
                        
                        
                        <Link to="/cart" className="relative text-gray-600 hover:text-gray-900">
                            <ShoppingBag className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* --- 4. Add Conditional Auth Links --- */}
                        {isAuthenticated ? (
                            // --- Show if Logged In ---
                            <>
                                <Link to="/account" className="text-gray-600 hover:text-gray-900">
                                    <User className="h-6 w-6" />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            // --- Show if Logged Out ---
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                        {/* --- End Auth Links --- */}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;