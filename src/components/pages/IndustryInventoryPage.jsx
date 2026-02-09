import React, { useEffect, useState, useMemo } from 'react';
import { 
  Search, Filter, X, Leaf, Package, ShoppingCart, 
  Loader2, ChevronDown, Minus, Plus, AlertCircle 
} from 'lucide-react';

// --- API HELPERS (Internal for stability) ---
// const INDUSTRY_BASE = 'http://localhost:8000/api/v1/industry';
const INDUSTRY_BASE = import.meta.env.VITE_INDUSTRY_BASE;


const fetchIndustryHome = async () => {
    try {
        const res = await fetch(`${INDUSTRY_BASE}/home`, { credentials: 'include' });
        const responseText = await res.text();

        if (!res.ok) {
            console.error("API Error: Non-OK response.", { status: res.status, body: responseText });
            throw new Error(`Failed to fetch inventory. Status: ${res.status}`);
        }

        try {
            return JSON.parse(responseText);
        } catch (e) {
            console.error("API Error: Failed to parse JSON.", { body: responseText });
            throw new Error(`Invalid JSON response. The server returned HTML or another non-JSON format.`);
        }
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
        const responseText = await res.text();

        if (!res.ok) {
            console.error("Cart API Error: Non-OK response.", { status: res.status, body: responseText });
            throw new Error(`Failed to add to cart. Status: ${res.status}`);
        }

        try {
            return JSON.parse(responseText);
        } catch (e) {
            console.error("Cart API Error: Failed to parse JSON.", { body: responseText });
            throw new Error(`Invalid JSON response. The server returned HTML or another non-JSON format.`);
        }
    } catch (error) {
        console.error("Cart Error:", error);
        throw error;
    }
};

// --- AESTHETIC UI COMPONENTS ---

const AestheticButton = ({ children, variant = 'primary', className, ...props }) => {
  const base = "inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none",
    secondary: "bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400",
    outline: "bg-transparent border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800",
    ghost: "text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white"
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const AestheticInput = ({ icon: Icon, ...props }) => (
  <div className="relative group">
    {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />}
    <input 
      className={`w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl py-2.5 ${Icon ? 'pl-10' : 'pl-4'} pr-4 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400 text-sm`}
      {...props}
    />
  </div>
);

const AestheticSelect = ({ label, value, onChange, options, suffix = "" }) => (
  <div className="space-y-1.5">
    {label && <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider ml-1">{label}</label>}
    <div className="relative">
      <select 
        value={value} 
        onChange={onChange}
        className="w-full appearance-none bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 rounded-xl py-2.5 pl-4 pr-10 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-medium cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-800"
      >
        <option value="">All {label}s</option>
        {options.map((opt) => {
          const optionValue = typeof opt === 'object' ? opt.value : opt;
          const optionLabel = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}{suffix}
            </option>
          );
        })}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
    </div>
  </div>
);

// --- PRODUCT CARD COMPONENT ---
const InventoryCard = ({ fabric, size, usageDuration, estimated_value, _id, quantity, combination_id }) => {
    const [selectedQty, setSelectedQty] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
  
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
          alert(`Added ${selectedQty}x ${fabric} to cart`); // Replace with toast if available
          setSelectedQty(1);
      } catch (error) {
          console.error("Cart Error:", error);
          alert("Failed to add to cart");
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
        <div className={`h-36 p-5 relative overflow-hidden flex flex-col justify-between bg-gradient-to-br ${gradients[themeIndex]}`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 dark:bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-125" />
          
          <div className="relative z-10 flex justify-between items-start">
             <span className="bg-white/60 dark:bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-300 shadow-sm border border-white/50 dark:border-white/10">
               {(_id || '000').substring(0,6)}
             </span>
             <span className={`bg-white dark:bg-zinc-800 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${accentColor} ${darkAccent}`}>
               {size}
             </span>
          </div>
  
          <h3 className="relative z-10 text-xl font-black tracking-tight text-slate-800 dark:text-white truncate">
            {fabric}
          </h3>
        </div>
  
        {/* Card Content */}
        <div className="p-5 flex flex-col flex-grow justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm border-b border-slate-50 dark:border-zinc-800 pb-2">
               <span className="text-slate-400 dark:text-zinc-500 font-medium text-xs uppercase tracking-wide">Usage</span>
               <span className="text-slate-700 dark:text-zinc-300 font-bold">{usageDuration === 6 ? '< 1 year' : '>= 1 year'}</span>
            </div>
            <div className="flex items-center justify-between text-sm border-b border-slate-50 dark:border-zinc-800 pb-2">
               <span className="text-slate-400 dark:text-zinc-500 font-medium text-xs uppercase tracking-wide">MOQ</span>
               <span className="text-slate-700 dark:text-zinc-300 font-bold">{quantity || 1} Units</span>
            </div>
          </div>
  
          <div className="mt-5 pt-2">
              <div className="flex items-center justify-between mb-3">
                   <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wide">Price</span>
                   <span className={`text-lg font-bold ${accentColor} ${darkAccent}`}>₹{(estimated_value * selectedQty).toLocaleString()}</span>
              </div>
  
              <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-1">
                      <button 
                          onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                          className="p-2 hover:text-emerald-500 transition-colors"
                          disabled={selectedQty <= 1}
                      >
                          <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-slate-700 dark:text-zinc-300">{selectedQty}</span>
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
                      className="flex-1 h-10 rounded-xl flex items-center justify-center transition-all duration-200 bg-slate-900 dark:bg-white hover:bg-emerald-600 dark:hover:bg-emerald-400 text-white dark:text-black font-bold text-sm shadow-md"
                  >
                      {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> Add</div>}
                  </button>
              </div>
          </div>
        </div>
      </div>
    );
};

// --- MAIN PAGE COMPONENT ---

const IndustryInventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [fabricFilter, setFabricFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [priceSort, setPriceSort] = useState('asc');
  const [showFilters, setShowFilters] = useState(true);

  // Load products
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchIndustryHome();
        if (!mounted) return;
        const items = Array.isArray(response) ? response : response.products || response.data || [];
        setProducts(items);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load inventory');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Get unique filter options
  const uniqueFabrics = useMemo(() => {
    const fabrics = new Set(products.map(p => p.fabric).filter(Boolean));
    return Array.from(fabrics).sort();
  }, [products]);

  const uniqueSizes = useMemo(() => {
    const sizes = new Set(products.map(p => p.size).filter(Boolean));
    return Array.from(sizes).sort();
  }, [products]);

  const uniqueDurations = useMemo(() => {
    const durations = new Set(products.map(p => p.usageDuration).filter(Boolean));
    return Array.from(durations).sort((a, b) => a - b);
  }, [products]);

  const durationOptions = useMemo(() => (
    uniqueDurations.map((duration) => ({
      value: duration,
      label: Number(duration) === 6 ? '< 1 year' : '>= 1 year'
    }))
  ), [uniqueDurations]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = searchTerm === '' || 
        (p.fabric && p.fabric.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.size && p.size.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFabric = fabricFilter === '' || p.fabric === fabricFilter;
      const matchesSize = sizeFilter === '' || p.size === sizeFilter;
      const matchesDuration = durationFilter === '' || p.usageDuration === Number(durationFilter);

      return matchesSearch && matchesFabric && matchesSize && matchesDuration;
    });

    // Sort by price
    result.sort((a, b) => {
      const priceA = Number(a.estimated_value) || 0;
      const priceB = Number(b.estimated_value) || 0;
      return priceSort === 'asc' ? priceA - priceB : priceB - priceA;
    });

    return result;
  }, [products, searchTerm, fabricFilter, sizeFilter, durationFilter, priceSort]);

  const clearFilters = () => {
    setSearchTerm('');
    setFabricFilter('');
    setSizeFilter('');
    setDurationFilter('');
    setPriceSort('asc');
  };

  const hasActiveFilters = searchTerm || fabricFilter || sizeFilter || durationFilter || priceSort !== 'asc';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans transition-colors duration-300">
      
      {/* Header */}
      <section className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 pt-10 pb-12 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50/50 dark:bg-emerald-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wide mb-4">
                <Leaf className="w-3 h-3" /> Live Inventory
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                Fabric <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Catalog</span>
              </h1>
              <p className="text-slate-500 dark:text-zinc-400 max-w-xl text-lg">
                Browse our real-time collection of industrial-grade fabrics available for immediate bulk dispatch.
              </p>
            </div>
            
            {/* Stats */}
            <div className="flex gap-8 border-l border-slate-200 dark:border-zinc-800 pl-8">
                <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{products.length}</p>
                    <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Total Items</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{uniqueFabrics.length}</p>
                    <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Varieties</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="flex-1 container mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className={`lg:w-72 flex-shrink-0 transition-all duration-300 ${showFilters ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100 hidden lg:block'}`}>
            <div className="sticky top-24 space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Filter className="w-4 h-4 text-emerald-500" /> Filters
                </h3>
                {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-wide">
                        Reset
                    </button>
                )}
              </div>

              {/* Search */}
              <AestheticInput 
                icon={Search}
                type="text"
                placeholder="Search fabric..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <hr className="border-slate-100 dark:border-zinc-800" />

              {/* Filter Groups */}
              <div className="space-y-5">
                <AestheticSelect 
                    label="Fabric"
                    value={fabricFilter}
                    onChange={(e) => setFabricFilter(e.target.value)}
                    options={uniqueFabrics}
                />

                <AestheticSelect 
                    label="Size"
                    value={sizeFilter}
                    onChange={(e) => setSizeFilter(e.target.value)}
                    options={uniqueSizes}
                />

                <AestheticSelect 
                  label="Duration"
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value)}
                  options={durationOptions}
                  // suffix=" months"
                />

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider ml-1">Price Sort</label>
                    <div className="flex bg-slate-50 dark:bg-zinc-800/50 p-1 rounded-xl">
                        <button 
                            onClick={() => setPriceSort('asc')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${priceSort === 'asc' ? 'bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700'}`}
                        >
                            Low - High
                        </button>
                        <button 
                            onClick={() => setPriceSort('desc')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${priceSort === 'desc' ? 'bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700'}`}
                        >
                            High - Low
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filter Toggle & Results Count */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                    Showing <span className="font-bold text-slate-900 dark:text-white">{filteredProducts.length}</span> results
                </p>
                <div className="lg:hidden">
                    <AestheticButton 
                        variant="secondary"
                        onClick={() => setShowFilters(!showFilters)}
                        className="!py-2 !px-3"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        {showFilters ? 'Hide' : 'Filter'}
                    </AestheticButton>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-96 rounded-3xl bg-slate-100 dark:bg-zinc-900 animate-pulse border border-slate-200 dark:border-zinc-800" />
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-3xl p-10 text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-red-600 dark:text-red-400 font-bold mb-2">System Error</p>
                <p className="text-slate-500 dark:text-zinc-400 text-sm">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="bg-white dark:bg-zinc-900 border border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl p-16 text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-slate-300 dark:text-zinc-600" />
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">No products found</p>
                <p className="text-slate-500 dark:text-zinc-400 text-sm mb-6">Try adjusting your filters or search terms.</p>
                <AestheticButton variant="secondary" onClick={clearFilters}>Clear All Filters</AestheticButton>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {filteredProducts.map((product, idx) => (
                  <InventoryCard 
                    key={product._id || product.id || idx} 
                    {...product} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryInventoryPage;