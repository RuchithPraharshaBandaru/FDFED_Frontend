// src/components/pages/CartPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Leaf, Plus, Minus } from 'lucide-react';

// Updated component for individual cart items
// No changes needed in this sub-component, but the props passed to it are now correct.
const CartItem = ({ item, onAdd, onDecrease, onRemove }) => (
    <div className="flex gap-4 p-4 border-b dark:border-gray-700">
        {/* 1. FIX: Use item.productId.image */}
        <img src={item.productId.image} alt={item.productId.title} className="w-24 h-19 object-cover rounded-md" />
        <div className="flex-grow flex flex-col">
            <div>
                {/* 2. FIX: Use item.productId.title */}
                <h3 className="font-semibold text-gray-800 dark:text-white">{item.productId.title}</h3>
            </div>
            <div className="mt-auto flex justify-between items-center">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 border dark:border-gray-600 rounded-md">
                    {/* 3. FIX: Pass item.productId._id */}
                    <button onClick={() => onDecrease(item.productId._id)} className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-md">
                        <Minus size={16} />
                    </button>
                    <span className="px-3 font-semibold dark:text-white">{item.quantity}</span>
                    {/* 4. FIX: Pass item.productId */}
                    <button onClick={() => onAdd(item.productId)} className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-md">
                        <Plus size={16} />
                    </button>
                </div>
                {/* 5. FIX: Pass item.productId._id */}
                <button onClick={() => onRemove(item.productId._id)} className="text-sm text-gray-500 dark:text-gray-400 hover:underline">Remove</button>
            </div>
        </div>
        {/* 6. FIX: Use item.productId.price */}
        <p className="text-lg font-bold text-gray-800 dark:text-white">Rs.{(item.productId.price * item.quantity).toFixed(2)}</p>
    </div>
);


const CartPage = () => {
    // These values (cartItems, cartCount, cartTotal) now come correctly from the CartContext
    const { cartItems, cartCount, cartTotal, addToCart, decreaseQuantity, removeFromCart } = useCart();
    const estimatedShipping = cartCount > 0 ? 5.00 : 0.00;
    const finalTotal = cartTotal + estimatedShipping;

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
            <div className="container mx-auto px-6 grid lg:grid-cols-3 gap-12">
                
                {/* Left Side: Cart Items */}
                <div className="lg:col-span-2">
                    <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6">My Bag ({cartCount} items)</h1>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        {cartCount > 0 ? (
                            cartItems.map(item => (
                                <CartItem 
                                    key={item.productId._id} // Use productId as key
                                    item={item} 
                                    onAdd={addToCart}
                                    onDecrease={decreaseQuantity}
                                    onRemove={removeFromCart} 
                                />
                            ))
                        ) : (
                            <p className="p-8 text-center text-gray-500 dark:text-gray-400">Your bag is empty.</p>
                        )}
                    </div>
                </div>

                {/* Right Side: Order Summary */}
                <div className="lg:col-span-1">
                     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-28">
                        <h2 className="text-xl font-bold border-b dark:border-gray-700 pb-4 dark:text-white">Order Summary</h2>
                        <div className="space-y-4 py-4 text-gray-600 dark:text-gray-300">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>Rs.{cartTotal.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Estimated Shipping</span>
                                <span>Rs.{estimatedShipping.toFixed(2)}</span>
                            </div>
                           
                        </div>
                        <div className="border-t dark:border-gray-700 pt-4 flex justify-between font-bold text-lg dark:text-white">
                            <span>Total</span>
                            <span>Rs.{finalTotal.toFixed(2)}</span>
                        </div>
                        
                        {/* 7. FIX: Changed <button> to <Link> */}
                        <Link 
                            to="/checkout" 
                            className={`w-full block text-center mt-6 bg-green-500 text-white py-3 rounded-lg text-lg hover:bg-green-600 font-semibold transition ${cartCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            // Prevent click if cart is empty
                            onClick={(e) => cartCount === 0 && e.preventDefault()}
                        >
                            Proceed to Checkout
                        </Link>
                        
                        <Link to="/store" className="block text-center mt-4 text-green-600 hover:underline">
                            Continue Shopping
                        </Link>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;