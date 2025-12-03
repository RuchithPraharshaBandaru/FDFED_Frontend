import React, { useState, createContext, useContext, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
    Menu, X, ShoppingCart, BarChart3, Settings, LogOut, 
    Home, Package, Bell, User, Leaf, ChevronRight, 
    CheckCircle, AlertCircle, XCircle, Info, Sun, Moon 
} from 'lucide-react';

// --- Internal API Helper for Layout (Self-contained) ---
const industryLogout = async () => {
    try {
        const res = await fetch('http://localhost:8000/api/v1/industry/logout', { 
            credentials: 'include' 
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Logout failed');
        return data;
    } catch (err) {
        console.error('Logout error:', err);
        throw err;
    }
};

// --- Theme Context ---
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

// --- Toast Context ---
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
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 px-5 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-none rounded-2xl min-w-[300px] animate-in slide-in-from-right-5 fade-in transition-all">
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

const IndustryLayoutContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    
    const [isAuthenticated, setIsAuthenticated] = useState(true); 
    const [toasts, setToasts] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000);
    };
    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    const handleLogout = async () => {
        try {
            await industryLogout();
            setIsAuthenticated(false);
            setUserMenuOpen(false);
            addToast('Logged out successfully', 'success');
            navigate('/industry/login');
        } catch (error) {
            setIsAuthenticated(false); 
            navigate('/industry/login');
            addToast('Logged out (Session expired)', 'info');
        }
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { label: 'Hub', path: '/industry', icon: Home },
        { label: 'Inventory', path: '/industry/inventory', icon: Package },
        ...(isAuthenticated ? [
            { label: 'Cart', path: '/industry/cart', icon: ShoppingCart },
            { label: 'Dashboard', path: '/industry/dashboard', icon: BarChart3 },
        ] : []),
    ];

    return (
        <ToastContext.Provider value={{ addToast }}>
            <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 font-sans transition-colors duration-300 flex flex-col selection:bg-emerald-100 dark:selection:bg-emerald-900/30 selection:text-emerald-900 dark:selection:text-emerald-100">
                
                {/* --- Header --- */}
                <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-800 transition-colors duration-300">
                    <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                        
                        {/* Logo Area */}
                        <Link to="/industry" className="flex items-center gap-3 group">
                            <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20 transition-transform group-hover:scale-105">
                                <Leaf className="h-5 w-5 text-white" fill="white" />
                            </div>
                            <div className="flex flex-col justify-center h-full">
                                <span className="font-bold text-xl tracking-tight leading-none flex items-center gap-2 text-slate-900 dark:text-white">
                                    SwiftMart
                                </span>
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider leading-none mt-1">
                                    Industrial Partner
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1 bg-slate-100/50 dark:bg-zinc-800/50 p-1.5 rounded-full border border-slate-200/50 dark:border-zinc-700/50 backdrop-blur-md">
                            {navItems.map(({ label, path, icon: Icon }) => {
                                const active = isActive(path);
                                return (
                                    <Link
                                        key={path}
                                        to={path}
                                        className={`
                                            relative flex items-center gap-2 px-5 py-2 transition-all text-sm font-bold rounded-full
                                            ${active 
                                                ? 'bg-white dark:bg-zinc-700 text-emerald-700 dark:text-emerald-300 shadow-sm' 
                                                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-700/50'
                                            }
                                        `}
                                    >
                                        <Icon className={`h-4 w-4 ${active ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                                        {label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            
                            {/* Theme Toggle */}
                            <button 
                                onClick={toggleTheme}
                                className="p-2.5 rounded-full text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                aria-label="Toggle Theme"
                            >
                                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            </button>

                            {isAuthenticated ? (
                                <>
                                    <button className="hidden sm:flex relative group p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
                                        <Bell className="h-5 w-5 text-slate-500 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                                        <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                                    </button>

                                    <div className="relative">
                                        <button
                                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                                            className={`flex items-center gap-3 pl-1 pr-4 py-1 border rounded-full transition-all ${userMenuOpen ? 'bg-white dark:bg-zinc-800 border-emerald-200 dark:border-emerald-800 shadow-sm' : 'bg-transparent border-transparent hover:bg-white dark:hover:bg-zinc-800 hover:border-slate-200 dark:hover:border-zinc-700'}`}
                                        >
                                            <div className="w-8 h-8 bg-gradient-to-tr from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 rounded-full flex items-center justify-center border border-white dark:border-zinc-700 shadow-sm">
                                                <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div className="hidden lg:flex flex-col items-start">
                                                 <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase leading-none">Account</span>
                                                 <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 leading-none mt-0.5">Partner Inc.</span>
                                            </div>
                                        </button>

                                        {/* Dropdown Menu */}
                                        {userMenuOpen && (
                                            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-xl rounded-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
                                                <div className="px-4 py-3 border-b border-slate-50 dark:border-zinc-800 mb-2">
                                                    <p className="text-xs font-bold text-slate-500 dark:text-zinc-500 mb-1 uppercase tracking-wide">Signed in as</p>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-zinc-200 truncate">Industry Partner Inc.</p>
                                                </div>
                                                
                                                <Link
                                                    to="/industry/profile"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors"
                                                >
                                                    <Settings className="h-4 w-4" />
                                                    Settings
                                                </Link>
                                                
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-left"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="hidden sm:flex items-center gap-3">
                                    <Link to="/industry/login">
                                        <button className="px-6 py-2.5 text-slate-600 dark:text-zinc-300 font-bold text-sm hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Log In</button>
                                    </Link>
                                    <Link to="/industry/signup">
                                        <button className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 transition-all transform hover:-translate-y-0.5">
                                            Get Started
                                        </button>
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Overlay */}
                    {mobileMenuOpen && (
                        <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 dark:bg-zinc-900/95 border-b border-slate-200 dark:border-zinc-800 p-6 shadow-xl backdrop-blur-xl animate-in slide-in-from-top-5">
                            <div className="flex flex-col gap-2">
                                {navItems.map(({ label, path, icon: Icon }) => (
                                    <Link
                                        key={path}
                                        to={path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center justify-between p-4 rounded-2xl transition-all ${isActive(path) ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 font-medium'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <Icon className={`h-5 w-5 ${isActive(path) ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                                            <span className="text-sm">{label}</span>
                                        </div>
                                        <ChevronRight className={`h-4 w-4 ${isActive(path) ? 'text-emerald-400' : 'text-slate-300 dark:text-zinc-600'}`} />
                                    </Link>
                                ))}
                                
                                {!isAuthenticated && (
                                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-zinc-800">
                                        <Link to="/industry/login" onClick={() => setMobileMenuOpen(false)}>
                                            <button className="w-full py-3 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 font-bold text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800">Log In</button>
                                        </Link>
                                        <Link to="/industry/signup" onClick={() => setMobileMenuOpen(false)}>
                                            <button className="w-full py-3 bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30">Sign Up</button>
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
                <footer className="bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 pt-16 pb-12 mt-auto transition-colors duration-300">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                            <div className="col-span-1 md:col-span-1 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                        <Leaf className="h-5 w-5 text-white" fill="white" />
                                    </div>
                                    <span className="font-bold text-xl text-slate-900 dark:text-zinc-100 tracking-tight">SwiftMart</span>
                                </div>
                                <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed max-w-xs">
                                    Empowering the circular economy with sustainable industrial supply chain solutions.
                                </p>
                            </div>
                            
                            {/* Footer Links */}
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-zinc-200 mb-4 text-sm uppercase tracking-wide">Platform</h4>
                                <ul className="space-y-3 text-sm text-slate-500 dark:text-zinc-400 font-medium">
                                    <li><Link to="/industry/inventory" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Live Inventory</Link></li>
                                    <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Analytics</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-zinc-200 mb-4 text-sm uppercase tracking-wide">Company</h4>
                                <ul className="space-y-3 text-sm text-slate-500 dark:text-zinc-400 font-medium">
                                    <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">About</a></li>
                                    <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Partners</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-zinc-200 mb-4 text-sm uppercase tracking-wide">Support</h4>
                                <ul className="space-y-3 text-sm text-slate-500 dark:text-zinc-400 font-medium">
                                    <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Help Center</a></li>
                                    <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Contact</a></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="border-t border-slate-100 dark:border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-slate-400 dark:text-zinc-500 text-xs font-medium">&copy; 2025 SwiftMart Systems. All rights reserved.</p>
                            <div className="flex gap-6">
                                {['Twitter', 'LinkedIn', 'Instagram'].map(social => (
                                    <a key={social} href="#" className="text-slate-400 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-bold uppercase transition-colors">
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