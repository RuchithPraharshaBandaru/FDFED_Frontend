import React, { useState, createContext, useContext, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIndustryIsAuthenticated, industryLogoutThunk } from '../../store/slices/industrySlice';
import { 
    Menu, X, ShoppingBag, BarChart3, LogOut, 
    Home, Package, Bell, User, Leaf, ChevronRight, 
    CheckCircle, AlertCircle, XCircle, Info, Sun, Moon 
} from 'lucide-react';

// --- Theme Context (Unchanged) ---
const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// --- Toast Context (Unchanged) ---
const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

const Toast = ({ id, message, type, onClose }) => {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
        error: <XCircle className="w-5 h-5 text-red-500" />,
        warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />
    };
    
    return (
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 px-5 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-none rounded-xl min-w-[300px] animate-in slide-in-from-right-5 fade-in transition-all">
            <div className="relative">
                {icons[type] || icons.info}
            </div>
            <p className="text-sm font-medium tracking-wide flex-1">{message}</p>
            <button onClick={() => onClose(id)} className="text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

// --- Main Layout Content ---
const IndustryLayoutContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const dispatch = useDispatch();
    
    const isAuthenticated = useSelector(selectIndustryIsAuthenticated); 
    const [toasts, setToasts] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000);
    };
    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    const handleLogout = async () => {
        try {
            await dispatch(industryLogoutThunk()).unwrap();
            addToast('Logged out successfully', 'success');
            navigate('/industry/login');
        } catch (error) {
            navigate('/industry/login');
            addToast('Logged out (Session expired)', 'info');
        }
    };

    const isActive = (path) => location.pathname === path;

    // Text links for the main navbar
    const navItems = [
        { label: 'Hub', path: '/industry', icon: Home },
        { label: 'Inventory', path: '/industry/inventory', icon: Package },
        ...(isAuthenticated ? [
            { label: 'Dashboard', path: '/industry/dashboard', icon: BarChart3 },
        ] : []),
    ];

    // Helper component for buttons (matches your Home UI components)
    const NavButton = ({ children, variant = "ghost", onClick, className = "" }) => {
        const baseStyle = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-9 px-4 py-2";
        const variants = {
            default: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
            destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm", // Red for Logout
            outline: "border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-900 dark:text-zinc-100",
            ghost: "hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100",
        };
        return (
            <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
                {children}
            </button>
        );
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 font-sans transition-colors duration-300 flex flex-col">
                
                {/* --- Header --- */}
                <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                    <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
                        
                        {/* Left Side: Logo & Main Nav */}
                        <div className="flex items-center space-x-8">
                            <Link to="/industry" className="flex items-center gap-2 group">
                                <span className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-500">
                                    SwiftMart
                                </span>
                            </Link>

                            {/* Desktop Text Links */}
                            <ul className="hidden md:flex items-center space-x-6">
                                {navItems.map(({ label, path }) => {
                                    const active = isActive(path);
                                    return (
                                        <li key={path}>
                                            <Link 
                                                to={path} 
                                                className={`text-sm font-medium transition-colors ${
                                                    active 
                                                    ? 'text-emerald-600 dark:text-emerald-400' 
                                                    : 'text-slate-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                                                }`}
                                            >
                                                {label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Right Side: Actions & Auth */}
                        <div className="flex items-center space-x-2">
                            
                            {/* Theme Toggle */}
                            <NavButton variant="ghost" className="px-2" onClick={toggleTheme} aria-label="Toggle Theme">
                                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            </NavButton>

                            {isAuthenticated ? (
                                <>
                                    {/* Cart Link (UPDATED: ShoppingBag Icon) */}
                                    <Link to="/industry/cart">
                                        <NavButton variant="ghost" className="px-2">
                                            <ShoppingBag className="h-5 w-5" />
                                        </NavButton>
                                    </Link>

                                    {/* Profile Link (Direct Link, no Dropdown) */}
                                    <Link to="/industry/profile">
                                        <NavButton variant="ghost" className="px-2">
                                            <User className="h-5 w-5" />
                                        </NavButton>
                                    </Link>

                                    {/* Logout Button (Directly in Navbar) */}
                                    <NavButton onClick={handleLogout} variant="destructive">
                                        Logout
                                    </NavButton>
                                </>
                            ) : (
                                <div className="hidden sm:flex items-center gap-2">
                                    <Link to="/industry/login">
                                        <NavButton variant="ghost">Log In</NavButton>
                                    </Link>
                                    <Link to="/industry/signup">
                                        <NavButton variant="default">Get Started</NavButton>
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </nav>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-lg">
                            <div className="flex flex-col space-y-3">
                                {navItems.map(({ label, path, icon: Icon }) => (
                                    <Link
                                        key={path}
                                        to={path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                                            isActive(path) 
                                            ? 'bg-slate-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-medium' 
                                            : 'text-slate-600 dark:text-zinc-400'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="h-4 w-4" />
                                            <span className="text-sm">{label}</span>
                                        </div>
                                        {isActive(path) && <ChevronRight className="h-4 w-4" />}
                                    </Link>
                                ))}
                                
                                {isAuthenticated ? (
                                    <>
                                        {/* Mobile Cart Link (UPDATED: ShoppingBag Icon) */}
                                        <Link 
                                            to="/industry/cart"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 p-2 text-slate-600 dark:text-zinc-400"
                                        >
                                            <ShoppingBag className="h-4 w-4" />
                                            <span className="text-sm">Cart</span>
                                        </Link>
                                        <Link 
                                            to="/industry/profile"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 p-2 text-slate-600 dark:text-zinc-400"
                                        >
                                            <User className="h-4 w-4" />
                                            <span className="text-sm">Profile</span>
                                        </Link>
                                        <div className="pt-2">
                                            <NavButton onClick={handleLogout} variant="destructive" className="w-full justify-start">
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Logout
                                            </NavButton>
                                        </div>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                                        <Link to="/industry/login" onClick={() => setMobileMenuOpen(false)}>
                                            <NavButton variant="outline" className="w-full">Log In</NavButton>
                                        </Link>
                                        <Link to="/industry/signup" onClick={() => setMobileMenuOpen(false)}>
                                            <NavButton variant="default" className="w-full">Sign Up</NavButton>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </header>

                {/* --- Toast Container --- */}
                <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                    {toasts.map((toast) => (
                        <div key={toast.id} className="pointer-events-auto">
                            <Toast
                                id={toast.id}
                                message={toast.message}
                                type={toast.type}
                                onClose={removeToast}
                            />
                        </div>
                    ))}
                </div>

                {/* --- Main Content --- */}
                <main className="flex-1 relative">
                    <Outlet />
                </main>

                {/* --- Footer --- */}
                <footer className="bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 py-12 mt-auto">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                            <div className="col-span-1">
                                <div className="flex items-center gap-2 mb-4">
                                    <Leaf className="h-5 w-5 text-emerald-600" />
                                    <span className="font-bold text-lg text-emerald-600 dark:text-emerald-500">SwiftMart</span>
                                </div>
                                <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">
                                    Empowering the circular economy with sustainable industrial supply chain solutions.
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="font-medium text-slate-900 dark:text-zinc-200 mb-4 text-sm">Platform</h4>
                                <ul className="space-y-2 text-sm text-slate-500 dark:text-zinc-400">
                                    <li><Link to="/industry/inventory" className="hover:text-emerald-600 transition-colors">Inventory</Link></li>
                                    <li><a href="#" className="hover:text-emerald-600 transition-colors">Analytics</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-medium text-slate-900 dark:text-zinc-200 mb-4 text-sm">Company</h4>
                                <ul className="space-y-2 text-sm text-slate-500 dark:text-zinc-400">
                                    <li><a href="#" className="hover:text-emerald-600 transition-colors">About</a></li>
                                    <li><a href="#" className="hover:text-emerald-600 transition-colors">Partners</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-medium text-slate-900 dark:text-zinc-200 mb-4 text-sm">Support</h4>
                                <ul className="space-y-2 text-sm text-slate-500 dark:text-zinc-400">
                                    <li><a href="#" className="hover:text-emerald-600 transition-colors">Help Center</a></li>
                                    <li><a href="#" className="hover:text-emerald-600 transition-colors">Contact</a></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="border-t border-slate-100 dark:border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-slate-400 dark:text-zinc-500 text-xs">&copy; 2025 SwiftMart Systems. All rights reserved.</p>
                            <div className="flex gap-4">
                                {['Twitter', 'LinkedIn', 'Instagram'].map(social => (
                                    <a key={social} href="#" className="text-slate-400 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-medium uppercase transition-colors">
                                        {social}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </ToastContext.Provider>
    );
};

const IndustryLayout = ({ children }) => (
    <ThemeProvider>
        <IndustryLayoutContent>{children}</IndustryLayoutContent>
    </ThemeProvider>
);

export default IndustryLayout;