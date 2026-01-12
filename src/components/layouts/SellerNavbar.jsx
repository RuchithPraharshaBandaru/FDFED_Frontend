// src/components/layouts/SellerNavbar.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutSeller } from '../../store/slices/sellerSlice';
import { selectTheme, toggleTheme } from '../../store/slices/themeSlice';
import { Moon, Sun, User, LayoutDashboard, Package, ShoppingCart, Store } from 'lucide-react';
import Button from '../ui/Button';

export const SellerNavbar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { seller } = useSelector((state) => state.seller);
    const theme = useSelector(selectTheme);

    const handleLogout = async () => {
        try {
            await dispatch(logoutSeller()).unwrap();
            navigate('/seller/login');
        } catch (error) {
            console.error('Logout failed:', error);
            navigate('/seller/login');
        }
    };

    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };

    const navigation = [
        { 
            name: 'Dashboard', 
            href: '/seller/dashboard', 
            icon: LayoutDashboard,
            current: location.pathname === '/seller/dashboard' 
        },
        { 
            name: 'Products', 
            href: '/seller/products', 
            icon: Package,
            current: location.pathname.startsWith('/seller/products') 
        },
        { 
            name: 'Orders', 
            href: '/seller/orders', 
            icon: ShoppingCart,
            current: location.pathname === '/seller/orders' 
        },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo & Links */}
                <div className="flex items-center space-x-8">
                    <Link to="/seller/dashboard" className="text-2xl font-bold text-primary tracking-tight flex items-center gap-2">
                        <Store className="h-6 w-6" />
                        <span>Seller Hub</span>
                    </Link>
                    <ul className="hidden md:flex space-x-6 items-center">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.name}>
                                    <Link
                                        to={item.href}
                                        className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                                            item.current
                                                ? 'text-primary'
                                                : 'text-muted-foreground'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                
                {/* Right Actions */}
                <div className="flex items-center space-x-4">
                    {/* Theme Toggle */}
                    <Button variant="ghost" size="icon" onClick={handleThemeToggle} aria-label="Toggle theme">
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                    
                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        >
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground text-sm font-bold">
                                    {seller?.name?.charAt(0).toUpperCase() || 'S'}
                                </span>
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium">{seller?.name}</p>
                                <p className="text-xs text-muted-foreground">{seller?.storeName}</p>
                            </div>
                        </button>
                        
                        {isProfileOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsProfileOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-popover border z-20">
                                    <div className="py-1">
                                        <div className="px-4 py-3 border-b">
                                            <p className="text-sm font-medium">{seller?.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{seller?.email}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{seller?.storeName}</p>
                                        </div>
                                        <Link
                                            to="/seller/profile"
                                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <User className="h-4 w-4" />
                                            Your Profile
                                        </Link>
                                        <Link
                                            to="/seller/dashboard"
                                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </Link>
                                        <div className="border-t">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>
            
            {/* Mobile Navigation */}
            <div className="md:hidden border-t">
                <div className="container mx-auto px-6 py-2 flex justify-around">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-md transition-colors ${
                                    item.current
                                        ? 'text-primary bg-accent'
                                        : 'text-muted-foreground hover:text-primary'
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="text-xs font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </header>
    );
};