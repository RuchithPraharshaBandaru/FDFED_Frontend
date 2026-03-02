import React, { useEffect, useState, createContext, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Zap, Package, TrendingUp, ShoppingCart, 
  Loader2, Leaf, Sprout, ShieldCheck, Globe, 
  CheckCircle, AlertCircle, Info, XCircle, Minus, Plus, Layers, Hexagon
} from 'lucide-react';

// --- INTERNAL API SERVICES (For Preview Stability) ---
const INDUSTRY_BASE = import.meta.env.VITE_INDUSTRY_BASE;

const fetchIndustryHome = async () => {
    try {
        const res = await fetch(`${INDUSTRY_BASE}/home`, { credentials: 'include' });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to fetch industry home');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

const postIndustryCart = async (body) => {
    try {
        const res = await fetch(`${INDUSTRY_BASE}/cart`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(body), 
            credentials: 'include'
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.msg || data.message || 'Failed to add to cart');
        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

// --- LOCAL TOAST SYSTEM ---
const ToastContext = createContext(null);
const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) return { addToast: console.log };
    return context;
};

const Toast = ({ id, message, type, onClose }) => {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
        error: <XCircle className="w-5 h-5 text-red-500" />,
        warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />
    };
    
    return (
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 px-5 py-4 shadow-lg rounded-2xl min-w-[300px] animate-in slide-in-from-right-5 fade-in transition-all pointer-events-auto">
            <div className="relative">
                {icons[type] || icons.info}
            </div>
            <p className="text-sm font-medium tracking-wide flex-1">{message}</p>
            <button onClick={() => onClose(id)} className="text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors">
                <XCircle className="w-4 h-4" />
            </button>
        </div>
    );
};

// --- AESTHETIC UI COMPONENTS ---

const Badge = ({ children, className }) => (
  <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide rounded-full shadow-sm ${className}`}>
    {children}
  </span>
);

const AestheticButton = ({ children, variant = 'primary', className, ...props }) => {
  const base = "inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";
  
  const variants = {
    primary: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none focus:ring-emerald-500",
    secondary: "bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 focus:ring-emerald-500",
    outline: "bg-transparent border-2 border-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
    ghost: "text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white"
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- PRODUCT CARD COMPONENT (With Quantity Logic) ---
const HomeProductCard = ({ fabric, size, usageDuration, estimated_value, _id, quantity, combination_id }) => {
    const [selectedQty, setSelectedQty] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const { addToast } = useToast();
  
    const handleAddToCart = async () => {
      setIsAdding(true);
      try {
          const payload = {
              id: _id,
              combination_id: combination_id || _id,
              quantity: selectedQty,
              fabric,
              size,
              usageDuration,
              estimated_value,
              amount: estimated_value * selectedQty
          };
          await postIndustryCart(payload);
          addToast(`Added ${selectedQty}x ${fabric} to cart`, 'success');
          setSelectedQty(1);
      } catch (error) {
          console.error("Cart Error:", error);
          addToast("Failed to connect to cart API", 'error');
      } finally {
          setIsAdding(false);
      }
    };
  
    // Determine gradient theme
    const themeIndex = (fabric?.length || 0) % 4;
    const gradients = [
        "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
        "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20", 
        "from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20",
        "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
    ];
    const accentColor = ["text-emerald-600", "text-blue-600", "text-violet-600", "text-amber-600"][themeIndex];
    const darkAccent = ["dark:text-emerald-400", "dark:text-blue-400", "dark:text-violet-400", "dark:text-amber-400"][themeIndex];

    return (
      <div className="group relative bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
        
        {/* Card Header */}
        <div className={`h-40 p-6 relative overflow-hidden flex flex-col justify-between bg-gradient-to-br ${gradients[themeIndex]}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 dark:bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-125" />
          
          <div className="relative z-10 flex justify-between items-start">
             <span className="bg-white/60 dark:bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 shadow-sm border border-white/50 dark:border-white/10">
               {(_id || '000').substring(0,6)}
             </span>
             <span className={`bg-white dark:bg-zinc-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${accentColor} ${darkAccent}`}>
               {size}
             </span>
          </div>
  
          <h3 className="relative z-10 text-2xl font-black tracking-tight text-slate-800 dark:text-white truncate">
            {fabric}
          </h3>
        </div>
  
        {/* Card Content */}
        <div className="p-6 flex flex-col flex-grow justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm border-b border-slate-50 dark:border-zinc-800 pb-3">
               <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
                   <Leaf className="w-4 h-4" />
                   <span className="font-medium text-xs uppercase tracking-wide">Usage</span>
               </div>
               <span className="text-slate-700 dark:text-zinc-300 font-bold">{usageDuration === 6 ? '< 1 year' : '>= 1 year'}   </span>
            </div>
            <div className="flex items-center justify-between text-sm border-b border-slate-50 dark:border-zinc-800 pb-3">
               <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
                   <Package className="w-4 h-4" />
                   <span className="font-medium text-xs uppercase tracking-wide">Min Order</span>
               </div>
               <span className="text-slate-700 dark:text-zinc-300 font-bold">{quantity || 1} Units</span>
            </div>
          </div>
  
          <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                   <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">Total Price</span>
                   <span className={`text-xl font-bold ${accentColor} ${darkAccent}`}>₹{(estimated_value * selectedQty).toLocaleString()}</span>
              </div>
  
              <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-2 py-1">
                      <button 
                          onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                          className="p-2 hover:text-emerald-500 transition-colors"
                          disabled={selectedQty <= 1}
                      >
                          <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-slate-700 dark:text-zinc-300">{selectedQty}</span>
                      <button 
                          onClick={() => setSelectedQty(Math.min(quantity || 1, selectedQty + 1))}
                          className="p-2 hover:text-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={selectedQty >= (quantity || 1)}
                      >
                          <Plus className="w-3 h-3" />
                      </button>
                  </div>
  
                  <button 
                      onClick={handleAddToCart}
                      disabled={isAdding}
                      className="flex-1 h-11 rounded-xl flex items-center justify-center transition-all duration-200 bg-slate-900 dark:bg-white hover:bg-emerald-600 dark:hover:bg-emerald-400 text-white dark:text-black font-bold text-sm shadow-lg shadow-slate-200 dark:shadow-none"
                  >
                      {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> Add</div>}
                  </button>
              </div>
          </div>
        </div>
      </div>
    );
};

// --- PAGE CONTENT ---

const HomePageContent = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try {
                const response = await fetchIndustryHome();
                if (mounted) setData(response);
            } catch (err) {
                if (mounted) setError(err.message || 'Failed to load');
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, []);

    const getProducts = () => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.products)) return data.products;
        if (Array.isArray(data.combinations)) return data.combinations;
        if (Array.isArray(data.items)) return data.items;
        if (data.data && Array.isArray(data.data.products)) return data.data.products;
        return [];
    };

    const products = getProducts();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans text-slate-900 dark:text-zinc-100 transition-colors duration-300">
            
            {/* --- Hero Section --- */}
            <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden bg-white dark:bg-zinc-950">
                {/* Soft Gradient Orbs */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-50/50 dark:bg-emerald-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/50 dark:bg-blue-900/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
                
                {/* Dot Pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.4] dark:opacity-[0.1]" 
                     style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 mb-8 inline-flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
                        <Sprout className="w-3 h-3 fill-emerald-600 dark:fill-emerald-400 text-emerald-600 dark:text-emerald-400" /> 
                        Sustainable Supply Chain
                    </Badge>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white leading-[1.1]">
                        Source smarter. <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400">
                            Scale faster.
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-slate-500 dark:text-zinc-400 text-lg md:text-xl mb-10 leading-relaxed font-medium">
                        The modern marketplace for industrial fabric sourcing. 
                        Connect directly with verified manufacturers and optimize your inventory with AI-driven insights.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/industry/cart">
                            <AestheticButton variant="primary" className="shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50">
                                Start Ordering <ArrowRight className="ml-2 w-4 h-4" />
                            </AestheticButton>
                        </Link>
                        <Link to="/industry/inventory">
                            <AestheticButton variant="secondary">
                                Browse Catalog
                            </AestheticButton>
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- Features Section --- */}
            <section className="py-24 bg-slate-50 dark:bg-zinc-900 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why SwiftMart?</h2>
                        <p className="text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto">We've reimagined the wholesale experience to be transparent, efficient, and sustainable.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Globe className="w-7 h-7 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Global Network</h3>
                            <p className="text-slate-500 dark:text-zinc-400 leading-relaxed text-sm">Access a verified network of suppliers across 50+ regions instantly.</p>
                        </div>

                        <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-7 h-7 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Dynamic Pricing</h3>
                            <p className="text-slate-500 dark:text-zinc-400 leading-relaxed text-sm">Real-time market rates ensure you never overpay for bulk orders.</p>
                        </div>

                        <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-zinc-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-violet-50 dark:bg-violet-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-7 h-7 text-violet-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Quality Assured</h3>
                            <p className="text-slate-500 dark:text-zinc-400 leading-relaxed text-sm">Every batch undergoes rigorous 3-step quality verification before shipment.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Products Section --- */}
            <section className="py-24 bg-white dark:bg-zinc-950 relative">
                 <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-zinc-800 to-transparent" />
                 
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-wide mb-4">
                                <Leaf className="w-3 h-3" /> Live Inventory
                            </div>
                            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Available Combinations</h2>
                        </div>
                        <Link to="/industry/inventory" className="text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-2 transition-colors">
                            View Full Catalog <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-32 bg-slate-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800">
                            <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mb-4" />
                            <p className="font-medium text-slate-400 dark:text-zinc-500">Syncing with Warehouse...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 p-8 rounded-3xl text-center">
                            <p className="text-red-600 dark:text-red-400 font-bold mb-2">Connection Interrupted</p>
                            <p className="text-slate-500 dark:text-zinc-400 text-sm">{error}</p>
                        </div>
                    )}

                    {!loading && !error && products.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.slice(0, 12).map((product, idx) => (
                                <HomeProductCard 
                                    key={product._id || product.id || idx} 
                                    {...product} 
                                />
                            ))}
                        </div>
                    )}
                     
                     {!loading && products.length === 0 && (
                         <div className="text-center py-32 bg-slate-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800">
                             <Package className="h-12 w-12 text-slate-300 dark:text-zinc-600 mx-auto mb-4" />
                             <p className="text-slate-500 dark:text-zinc-400 font-medium">No inventory currently available.</p>
                         </div>
                     )}
                </div>
            </section>

            {/* --- CTA Footer --- */}
            <section className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="bg-slate-900 dark:bg-zinc-900 rounded-[2.5rem] p-12 md:p-24 text-center overflow-hidden relative shadow-2xl border border-slate-800 dark:border-zinc-800">
                         {/* Abstract background shapes inside card */}
                         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
                        
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
                                Ready to optimize your supply chain?
                            </h2>
                            <p className="text-slate-400 text-lg mb-10">
                                Join over 2,000 businesses using SwiftMart to source ethically and efficiently.
                            </p>
                            <Link to="/industry/cart">
                                <button className="bg-emerald-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-emerald-400 hover:scale-105 transition-all shadow-lg shadow-emerald-900/50">
                                    Get Started Free
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// --- WRAPPER FOR PREVIEW ---
const IndustryHomePage = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            <div className="relative">
                <HomePageContent />
                
                {/* Toast Container */}
                <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            id={toast.id}
                            message={toast.message}
                            type={toast.type}
                            onClose={(id) => setToasts(prev => prev.filter(t => t.id !== id))}
                        />
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
};

export default IndustryHomePage;