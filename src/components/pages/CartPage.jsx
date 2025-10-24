import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Leaf, Plus, Minus } from 'lucide-react';

// Updated component for individual cart items
const CartItem = ({ item, onAdd, onDecrease, onRemove }) => (
    <div className="flex gap-4 p-4 border-b">
        <img src={item.image} alt={item.title} className="w-24 h-19 object-cover rounded-md" />
        <div className="flex-grow flex flex-col">
            <div>
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
               
            </div>
            <div className="mt-auto flex justify-between items-center">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 border rounded-md">
                    <button onClick={() => onDecrease(item._id)} className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md">
                        <Minus size={16} />
                    </button>
                    <span className="px-3 font-semibold">{item.quantity}</span>
                    <button onClick={() => onAdd(item)} className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md">
                        <Plus size={16} />
                    </button>
                </div>
                <button onClick={() => onRemove(item._id)} className="text-sm text-gray-500 hover:underline">Remove</button>
            </div>
        </div>
        <p className="text-lg font-bold text-gray-800">Rs.{(item.price * item.quantity).toFixed(2)}</p>
    </div>
);


const CartPage = () => {
    const { cartItems, cartCount, cartTotal, addToCart, decreaseQuantity, removeFromCart } = useCart();
    const estimatedShipping = cartCount > 0 ? 5.00 : 0.00;
    const finalTotal = cartTotal + estimatedShipping;

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-6 grid lg:grid-cols-3 gap-12">
                
                {/* Left Side: Cart Items */}
                <div className="lg:col-span-2">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-6">My Bag ({cartCount} items)</h1>
                    <div className="bg-white rounded-lg shadow-sm">
                        {cartCount > 0 ? (
                            cartItems.map(item => (
                                <CartItem 
                                    key={item._id} 
                                    item={item} 
                                    onAdd={addToCart}
                                    onDecrease={decreaseQuantity}
                                    onRemove={removeFromCart} 
                                />
                            ))
                        ) : (
                            <p className="p-8 text-center text-gray-500">Your bag is empty.</p>
                        )}
                    </div>
                </div>

                {/* Right Side: Order Summary */}
                <div className="lg:col-span-1">
                     <div className="bg-white rounded-lg shadow-sm p-6 sticky top-28">
                        <h2 className="text-xl font-bold border-b pb-4">Order Summary</h2>
                        <div className="space-y-4 py-4 text-gray-600">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>Rs.{cartTotal.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Estimated Shipping</span>
                                <span>Rs.{estimatedShipping.toFixed(2)}</span>
                            </div>
                           
                        </div>
                        <div className="border-t pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>Rs.{finalTotal.toFixed(2)}</span>
                        </div>
                        <button disabled={cartCount === 0} className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg text-lg hover:bg-green-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed">
                            Proceed to Checkout
                        </button>
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