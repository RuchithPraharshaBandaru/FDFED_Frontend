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
            <div className="container mx-auto px-6 py-8 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border dark:border-gray-700 text-center">
                    <h2 className="text-2xl font-bold mb-4 dark:text-white">Your Cart is Empty</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Add some items to your cart before checking out.</p>
                    <Link to="/store" className="inline-block bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const { user, extra = 0 } = details || { user: currentUser, extra: 0 };
    const finalTotal = cartTotal - extra;

    return (
        <div className="container mx-auto px-6 py-8 dark:bg-gray-900">
            <h1 className="text-3xl font-bold mb-6 dark:text-white">Checkout</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* --- Left Side: Details --- */}
                <div className="md:col-span-2 space-y-6">
                    {/* Shipping Address */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 dark:text-white">Shipping Address</h2>
                        {user.Address && user.Address.plotno ? (
                            <div className="text-gray-700 dark:text-gray-300">
                                <p className="font-medium">{user.firstname} {user.lastname}</p>
                                <p>{user.Address.plotno}, {user.Address.street}</p>
                                <p>{user.Address.city}, {user.Address.state} - {user.Address.pincode}</p>
                                <p>Phone: {user.Address.phone}</p>
                            </div>
                        ) : (
                            <p className="text-red-500 dark:text-red-400">
                                No address found. <Link to="/account/address" className="text-green-500 hover:underline">Add an address</Link>
                            </p>
                        )}
                    </div>
                    
                    {/* Payment Method */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 dark:text-white">Payment Method</h2>
                        <div className="space-y-2">
                            <label className="flex items-center p-3 border dark:border-gray-600 rounded-md has-[:checked]:bg-green-50 dark:has-[:checked]:bg-gray-700 has-[:checked]:border-green-500">
                                <input 
                                    type="radio" 
                                    name="paymentMethod" 
                                    value="cod" 
                                    checked={paymentMethod === 'cod'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="form-radio text-green-600"
                                />
                                <span className="ml-3 font-medium dark:text-white">Cash on Delivery (COD)</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* --- Right Side: Order Summary --- */}
                <div className="md:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 sticky top-24">
                        <h2 className="text-xl font-semibold mb-4 dark:text-white">Order Summary</h2>
                        
                        {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md text-sm">{error}</div>}
                        
                        <div className="space-y-3">
                            {cartItems.map(item => (
                                <div key={item._id} className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">{item.title} (x{item.quantity})</span>
                                    <span className="font-medium dark:text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <hr className="my-2 dark:border-gray-600"/>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                                <span className="font-medium dark:text-white">₹{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Donation Credit</span>
                                <span className="font-medium text-green-500">-₹{extra.toFixed(2)}</span>
                            </div>
                            <hr className="my-2 dark:border-gray-600"/>
                            <div className="flex justify-between text-lg font-bold">
                                <span className="dark:text-white">Total</span>
                                <span className="dark:text-white">₹{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-green-500 text-white px-5 py-3 rounded-md font-medium hover:bg-green-600 mt-6">
                            Place Order
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;