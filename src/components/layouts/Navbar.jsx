import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext'; // Import the cart hook

const Navbar = () => {
    const { cartCount } = useCart(); // Get the number of items in the cart

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
                            <li><Link to="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Sell</Link></li>
                            <li><Link to="/about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">About</Link></li>
                        </ul>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                         <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="text" placeholder="Search items..." className="pl-10 pr-4 py-2 w-48 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"/>
                        </div>
                        
                        
                        {/* Updated Shopping Bag Link */}
                        <Link to="/cart" className="relative text-gray-600 hover:text-gray-900">
                            <ShoppingBag className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;