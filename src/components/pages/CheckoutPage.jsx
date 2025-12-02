// src/components/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiGetCheckoutDetails, apiSubmitPayment } from '../../services/api';
import { clearCart, fetchCartItems, selectCartItems, selectCartTotalAmount } from '../../store/slices/cartSlice';
import { selectUser } from '../../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const CheckoutPage = () => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotalAmount);
    const currentUser = useSelector(selectUser);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                
                // 1. Refresh cart data to ensure prices/stock are current
                await dispatch(fetchCartItems());
                
                // 2. Fetch checkout details
                const data = await apiGetCheckoutDetails();
                console.log('Checkout details:', data);
                if (data.success) {
                    setDetails(data);
                }
            } catch (err) {
                console.log('Error fetching checkout details:', err);
                setError(err.message);
            }
            setLoading(false);
        };
        fetchDetails();
    }, [dispatch]);

    // Debug: log user data
    useEffect(() => {
        console.log('Current user from Redux:', currentUser);
        console.log('Details from backend:', details);
    }, [currentUser, details]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Check if cart is empty
        if (!cartItems || cartItems.length === 0) {
            setError('Your cart is empty. Please add items before checking out.');
            return;
        }
        
        // Get user address from details or currentUser
        const userAddress = details?.user?.Address || currentUser?.Address;
        
        // Check for address
        if (!userAddress || !userAddress.plotno) {
            setError('Please add an address to your account before checking out.');
            return;
        }

        try {
            // Send payment data - backend will use cart from user session/database
            const paymentData = {
                paymentMethod: paymentMethod,
                address: userAddress
            };
            
            console.log('Sending payment data:', paymentData);
            
            const data = await apiSubmitPayment(paymentData);
            
            if (data.success) {
                // Payment successful!
                dispatch(clearCart());
                // Redirect to order history to see the new order
                navigate('/account/orders'); 
            }
        } catch (err) {
            setError(err.message || 'Failed to place order.');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white">Loading checkout details...</div>;
    
    // Check if cart is empty
    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="relative min-h-screen bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 dark:from-gray-950 dark:via-green-900/25 dark:to-emerald-900/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none"></div>
                <div className="relative container mx-auto px-6 py-8">
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50 text-center max-w-md mx-auto mt-16">
                        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent">Your Cart is Empty</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Add some items to your cart before checking out.</p>
                        <Link to="/store" className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const { user, extra = 0 } = details || { user: currentUser, extra: 0 };
    const finalTotal = cartTotal - extra;

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 dark:from-gray-950 dark:via-green-900/25 dark:to-emerald-900/20">
            {/* Background patterns */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-[0.03] dark:opacity-[0.06] pointer-events-none"></div>
            
            {/* Floating orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/18 dark:bg-green-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/18 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative container mx-auto px-6 py-8">
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white bg-clip-text text-transparent">Checkout</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* --- Left Side: Details --- */}
                <div className="md:col-span-2 space-y-6">
                    {/* Shipping Address */}
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50">
                        <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent">Shipping Address</h2>
                        {user.Address && user.Address.plotno ? (
                            <div className="text-gray-700 dark:text-gray-300 space-y-1">
                                <p className="font-semibold">{user.firstname} {user.lastname}</p>
                                <p>{user.Address.plotno}, {user.Address.street}</p>
                                <p>{user.Address.city}, {user.Address.state} - {user.Address.pincode}</p>
                                <p>Phone: {user.Address.phone}</p>
                            </div>
                        ) : (
                            <p className="text-red-500 dark:text-red-400">
                                No address found. <Link to="/account/address" className="text-green-500 hover:underline font-semibold">Add an address</Link>
                            </p>
                        )}
                    </div>
                    
                    {/* Payment Method */}
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50">
                        <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent">Payment Method</h2>
                        <div className="space-y-2">
                            <label className="flex items-center p-4 border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl has-[:checked]:bg-green-500/10 dark:has-[:checked]:bg-green-500/20 has-[:checked]:border-green-500/50 backdrop-blur-sm transition-all cursor-pointer hover:border-green-500/30">
                                <input 
                                    type="radio" 
                                    name="paymentMethod" 
                                    value="cod" 
                                    checked={paymentMethod === 'cod'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="form-radio text-green-600 focus:ring-green-500/50"
                                />
                                <span className="ml-3 font-bold dark:text-white">Cash on Delivery (COD)</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* --- Right Side: Order Summary --- */}
                <div className="md:col-span-1">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-[2px] rounded-2xl">
                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl sticky top-24">
                            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent">Order Summary</h2>
                            
                            {error && <div className="mb-4 p-3 bg-red-500/10 dark:bg-red-500/20 backdrop-blur-sm border-2 border-red-500/30 text-red-700 dark:text-red-300 rounded-xl text-sm font-semibold">{error}</div>}
                            
                            <div className="space-y-3">
                                {cartItems.map(item => (
                                    <div key={item._id} className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-300">{item.title} (x{item.quantity})</span>
                                        <span className="font-semibold dark:text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <hr className="my-2 border-gray-200/50 dark:border-gray-700/50"/>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                                    <span className="font-semibold dark:text-white">₹{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">Donation Credit</span>
                                    <span className="font-semibold text-green-500">-₹{extra.toFixed(2)}</span>
                                </div>
                                <hr className="my-2 border-gray-200/50 dark:border-gray-700/50"/>
                                <div className="flex justify-between text-lg font-bold">
                                    <span className="dark:text-white">Total</span>
                                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">₹{finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 mt-6 transition-all">
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            </div>
        </div>
    );
};

export default CheckoutPage;