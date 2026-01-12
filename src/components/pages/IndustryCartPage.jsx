import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Trash2, ShoppingCart, ArrowRight, Loader2, Package, ShieldCheck, 
    AlertCircle, CreditCard, Lock, Leaf
} from 'lucide-react';

import { getIndustryCart, postIndustryCartDelete } from '../../services/api';

// --- AESTHETIC COMPONENTS ---

const AestheticButton = ({ children, variant = 'primary', className, ...props }) => {
  const base = "inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";
  
  const variants = {
    primary: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none focus:ring-emerald-500",
    danger: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800",
    secondary: "bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 focus:ring-emerald-500",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const IndustryCartPage = () => {
    const navigate = useNavigate();
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const loadCart = useCallback(async () => {
        setLoading(true);
        try {
            console.log('loadCart: Fetching cart data...'); // New log
            const data = await getIndustryCart();
            console.log('loadCart: Received cart data:', data); // New log
            setCartData(data);
        } catch (err) {
            setError(err.message || 'Failed to load cart');
            console.error('loadCart: Error fetching cart data:', err); // New log
        } finally {
            setLoading(false);
        }
    }, [setCartData, setLoading, setError]);

    useEffect(() => { loadCart(); }, []);

    const handleDelete = async (item) => {
        // The backend uses the 'id' field (UUID) to identify cart items for deletion.
        // We must prioritize item.id over item._id.
        const cartItemId = item.id;
        
        if (!cartItemId) {
            console.error("Cannot delete item: Missing 'id' property (UUID). Item:", item);
            return;
        }
        
        setDeletingId(cartItemId);
        try {
            await postIndustryCartDelete({ id: cartItemId });
            await loadCart();
        } catch (err) {
            console.error("Delete error:", err);
        } finally {
            setDeletingId(null);
        }
    };

    const cartItems = cartData?.cart || cartData?.items || (Array.isArray(cartData) ? cartData : []) || [];
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.amount || (item.estimated_value * item.quantity) || 0), 0);
    const totalQty = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center font-sans">
                <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
                <p className="text-slate-500 dark:text-zinc-400 font-medium animate-pulse">Syncing Cart Data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans text-slate-900 dark:text-zinc-100 transition-colors duration-300 py-10">
            
            {/* Header Section */}
            <div className="container mx-auto px-6 mb-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-xs font-bold uppercase tracking-wide mb-3 border border-emerald-200 dark:border-emerald-800">
                            <ShoppingCart className="w-3 h-3" /> Cart Review
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                            Your Order <span className="text-slate-400 dark:text-zinc-600">({totalQty} items)</span>
                        </h1>
                    </div>
                    <Link to="/industry/inventory" className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors">
                        <ArrowRight className="w-4 h-4 rotate-180" /> Continue Sourcing
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-6">
                
                {error && (
                    <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-bold text-sm">{error}</span>
                    </div>
                )}

                {cartItems.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-zinc-900 border border-dashed border-slate-200 dark:border-zinc-800 rounded-[2rem] shadow-sm max-w-3xl mx-auto">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="h-10 w-10 text-slate-300 dark:text-zinc-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</h3>
                        <p className="text-slate-500 dark:text-zinc-400 mb-8 max-w-sm mx-auto text-lg">
                            Head back to the inventory hub to add verified fabric combinations.
                        </p>
                        <Link to="/industry/inventory">
                            <AestheticButton variant="primary">
                                Browse Inventory <ArrowRight className="ml-2 w-4 h-4" />
                            </AestheticButton>
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div 
                                    key={item._id || item.id} 
                                    className="group bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-xl dark:hover:shadow-emerald-900/10 transition-all relative overflow-hidden"
                                >
                                    {/* Background decorative blob */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6 relative z-10">
                                        <div className="flex items-start gap-5">
                                            {/* Icon Box */}
                                            <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-100 dark:border-zinc-700">
                                                <Package className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            
                                            {/* Item Details */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                                                        Ref: {(item.combination_id || item.id).substring(0,6)}
                                                    </span>
                                                </div>
                                                <h3 className="font-black text-xl text-slate-900 dark:text-white leading-tight mb-2">
                                                    {item.fabric || 'Unknown Fabric'}
                                                </h3>
                                                
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-xs font-bold text-slate-600 dark:text-zinc-300">
                                                        Size: {item.size || 'N/A'}
                                                    </span>
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                                                        <Leaf className="w-3 h-3 mr-1" />
                                                        {item.usageDuration} Months
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions & Price */}
                                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 w-full sm:w-auto justify-between sm:justify-start mt-2 sm:mt-0">
                                            <div className="text-right">
                                                <p className="text-xs text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wide">Estimate</p>
                                                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                                    ₹{(item.amount || (item.estimated_value * item.quantity)).toLocaleString()}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="text-sm font-bold text-slate-500 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700">
                                                    Qty: {item.quantity}
                                                </div>
                                                <button 
                                                    onClick={() => handleDelete(item)} 
                                                    disabled={deletingId === item.id}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Remove Item"
                                                >
                                                    {deletingId === item.id ? (
                                                        <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                                                    ) : (
                                                        <Trash2 className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-slate-200 dark:border-zinc-800 sticky top-24 shadow-xl shadow-slate-200/50 dark:shadow-none">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Order Summary</h3>
                                </div>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 dark:text-zinc-400 font-medium">Subtotal ({totalQty} items)</span>
                                        <span className="font-bold text-slate-900 dark:text-white">₹{totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 dark:text-zinc-400 font-medium">Platform Fee</span>
                                        <span className="font-bold text-emerald-600 dark:text-emerald-400">Waived</span>
                                    </div>
                                </div>

                                <div className="border-t border-dashed border-slate-200 dark:border-zinc-800 pt-6 mb-8">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wide">Total Payable</span>
                                        <span className="text-3xl font-black text-slate-900 dark:text-white">₹{(totalAmount).toLocaleString()}</span>
                                    </div>
                                </div>

                                <Link to="/industry/checkout" className="block w-full">
                                    <AestheticButton className="w-full py-4 text-base rounded-2xl shadow-xl shadow-emerald-200 dark:shadow-none hover:shadow-2xl hover:shadow-emerald-300 transition-all transform hover:-translate-y-1">
                                        Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
                                    </AestheticButton>
                                </Link>

                                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                    <span>Verified Secure Transaction</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IndustryCartPage;