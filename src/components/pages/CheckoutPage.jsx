// src/components/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { apiGetCheckoutDetails, apiSubmitPayment } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';

const CheckoutPage = () => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod'); // Default 'cod'
    
    const { clearCartCount } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const data = await apiGetCheckoutDetails();
                if (data.success) {
                    setDetails(data);
                }
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        };
        fetchDetails();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Check for address
        if (!details.user.Address || !details.user.Address.plotno) {
            setError('Please add an address to your account before checking out.');
            return;
        }

        try {
            const paymentData = {
                paymentMethod: paymentMethod,
                address: details.user.Address,
            };
            
            const data = await apiSubmitPayment(paymentData);
            
            if (data.success) {
                // Payment successful!
                clearCartCount(); // Update navbar count to 0
                // Redirect to order history to see the new order
                navigate('/account/orders'); 
            }
        } catch (err) {
            setError(err.message || 'Failed to place order.');
        }
    };

    if (loading) return <div>Loading checkout details...</div>;
    if (error) return <div className="text-red-600 mb-4">{error}</div>;
    if (!details) return <div>Could not load details.</div>;

    const { user, total, extra } = details;
    const finalTotal = total - extra;

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* --- Left Side: Details --- */}
                <div className="md:col-span-2 space-y-6">
                    {/* Shipping Address */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                        {user.Address && user.Address.plotno ? (
                            <div className="text-gray-700">
                                <p className="font-medium">{user.firstname} {user.lastname}</p>
                                <p>{user.Address.plotno}, {user.Address.street}</p>
                                <p>{user.Address.city}, {user.Address.state} - {user.Address.pincode}</p>
                                <p>Phone: {user.Address.phone}</p>
                            </div>
                        ) : (
                            <p className="text-red-500">
                                No address found. <Link to="/account/address" className="text-green-600 hover:underline">Add an address</Link>
                            </p>
                        )}
                    </div>
                    
                    {/* Payment Method */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                        <div className="space-y-2">
                            <label className="flex items-center p-3 border rounded-md has-[:checked]:bg-green-50 has-[:checked]:border-green-500">
                                <input 
                                    type="radio" 
                                    name="paymentMethod" 
                                    value="cod" 
                                    checked={paymentMethod === 'cod'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="form-radio text-green-600"
                                />
                                <span className="ml-3 font-medium">Cash on Delivery (COD)</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* --- Right Side: Order Summary --- */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            {user.cart.map(item => (
                                item.productId ? ( // Check if product exists
                                    <div key={item.productId._id} className="flex justify-between items-center">
                                        <span className="text-gray-600">{item.productId.title} (x{item.quantity})</span>
                                        <span className="font-medium">${(item.productId.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ) : (
                                    <div key={item._id} className="flex justify-between items-center">
                                        <span className="text-gray-600 italic">Item no longer available</span>
                                    </div>
                                )
                            ))}
                            <hr className="my-2"/>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Donation Credit</span>
                                <span className="font-medium text-green-600">-${extra.toFixed(2)}</span>
                            </div>
                            <hr className="my-2"/>
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white px-5 py-3 rounded-md font-medium hover:bg-green-700 mt-6">
                            Place Order
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;