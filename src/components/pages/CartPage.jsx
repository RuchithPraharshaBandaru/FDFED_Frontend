// src/components/pages/CartPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
    selectCartItems, 
    selectCartTotalQuantity, 
    selectCartTotalAmount,
    addToCartAsync,
    decrementQuantityAsync,
    removeFromCartAsync 
} from '../../store/slices/cartSlice';
import { Leaf, Plus, Minus } from 'lucide-react';

// --- UPDATED: CartItem now accepts and uses size ---
const CartItem = ({ item, onAdd, onDecrease, onRemove }) => (
    <div className="flex gap-4 p-4 border-b dark:border-gray-700">
        <img src={item.image || item.productId?.image} alt={item.title || item.productId?.title} className="w-24 h-19 object-cover rounded-md" />
        <div className="flex-grow flex flex-col">
            <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">{item.title || item.productId?.title}</h3>
                {/* --- NEW: Display Size --- */}
                {item.size && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Size: <span className="font-medium text-gray-700 dark:text-gray-300">{item.size}</span>
                    </p>
                )}
            </div>
            <div className="mt-auto flex justify-between items-center">
                <div className="flex items-center gap-2 border dark:border-gray-600 rounded-md">
                    {/* --- UPDATED: Pass size to handlers --- */}
                    <button onClick={() => onDecrease(item._id || item.productId?._id, item.size)} className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-md">
                        <Minus size={16} />
                    </button>
                    <span className="px-3 font-semibold dark:text-white">{item.quantity}</span>
                    <button onClick={() => onAdd(item._id || item.productId?._id, item.size)} className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-md">
                        <Plus size={16} />
                    </button>
                </div>
                <button onClick={() => onRemove(item._id || item.productId?._id, item.size)} className="text-sm text-gray-500 dark:text-gray-400 hover:underline">Remove</button>
            </div>
        </div>
        <p className="text-lg font-bold text-gray-800 dark:text-white">Rs.{((item.price || item.productId?.price) * item.quantity).toFixed(2)}</p>
    </div>
);

const CartPage = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const cartCount = useSelector(selectCartTotalQuantity);
    const cartTotal = useSelector(selectCartTotalAmount);
    
    const estimatedShipping = cartCount > 0 ? 5.00 : 0.00;
    const finalTotal = cartTotal + estimatedShipping;
    
    // --- UPDATED: Handle Size Logic ---
    const handleAddToCart = (id, size) => {
        // Find specific item by ID AND Size
        const item = cartItems.find(i => i._id === id && i.size === size);
        if (item) {
            // Pass size explicitly to the slice
            dispatch(addToCartAsync({ product: item, size: size }));
        }
    };
    
    const handleDecreaseQuantity = (id, size) => {
        // Assuming your slice has been updated to accept { id, size }
        // If not, it will only remove by ID (might affect wrong size if ID is not unique)
        dispatch(decrementQuantityAsync({ id, size }));
    };
    
    const handleRemoveFromCart = (id, size) => {
        dispatch(removeFromCartAsync({ id, size }));
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-green-50/15 to-emerald-50/20 dark:from-gray-950 dark:via-green-900/25 dark:to-emerald-900/20 py-12 overflow-hidden">
            <div className="absolute inset-0 bg-dot-pattern opacity-[0.02] dark:opacity-[0.06] pointer-events-none" />
            <div className="absolute top-0 right-1/3 w-96 h-96 bg-gradient-to-br from-green-400/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-600/20 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-tr from-emerald-400/8 to-green-500/8 dark:from-emerald-600/15 dark:to-green-700/15 blur-3xl rounded-full" />
            
            <div className="relative container mx-auto px-6 grid lg:grid-cols-3 gap-12">
                
                <div className="lg:col-span-2">
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/15 dark:to-emerald-500/15 border border-green-500/20 mb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-medium text-green-700 dark:text-green-400">Shopping Cart</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">My Bag <span className="text-green-600 dark:text-green-400">({cartCount} items)</span></h1>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-white/40 dark:from-gray-800/80 dark:to-gray-900/70 backdrop-blur-xl rounded-2xl" />
                        <div className="relative bg-white/50 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-green-500/25 shadow-xl dark:shadow-green-500/15 overflow-hidden">
                        {cartCount > 0 ? (
                            cartItems.map((item, index) => (
                                <CartItem 
                                    // Use index as fallback for key if multiple items have same ID but diff size
                                    key={`${item._id || item.productId?._id}-${item.size}-${index}`}
                                    item={item} 
                                    onAdd={handleAddToCart}
                                    onDecrease={handleDecreaseQuantity}
                                    onRemove={handleRemoveFromCart} 
                                />
                            ))
                        ) : (
                            <p className="p-12 text-center text-gray-500 dark:text-gray-400">Your bag is empty.</p>
                        )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-28">
                        <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-500 dark:to-emerald-600 p-[2px] rounded-2xl shadow-2xl shadow-green-500/20 dark:shadow-green-500/40">
                            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-6 rounded-2xl">
                                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</h2>
                                </div>
                        <div className="space-y-4 py-4 text-gray-600 dark:text-gray-300">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-semibold">Rs.{cartTotal.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Estimated Shipping</span>
                                <span className="font-semibold">Rs.{estimatedShipping.toFixed(2)}</span>
                            </div>
                           
                        </div>
                        <div className="border-t dark:border-gray-700 pt-4 flex justify-between font-bold text-xl text-gray-900 dark:text-white mb-6">
                            <span>Total</span>
                            <span className="text-green-600 dark:text-green-400">Rs.{finalTotal.toFixed(2)}</span>
                        </div>
                        
                        <Link 
                            to="/checkout" 
                            className={`w-full block text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3.5 rounded-xl text-base font-bold hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/30 transition-all ${cartCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={(e) => cartCount === 0 && e.preventDefault()}
                        >
                            Proceed to Checkout
                        </Link>
                        
                        <Link to="/store" className="block text-center mt-4 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium">
                            Continue Shopping
                        </Link>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;