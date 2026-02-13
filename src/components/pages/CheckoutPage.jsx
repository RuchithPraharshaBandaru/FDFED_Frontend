// src/components/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGetCheckoutDetails, apiSubmitPayment } from '../../services/api';
import { CreditCard, Wallet, Truck, Coins } from 'lucide-react'; 
import { isValidPhone, isValidPincode } from '../../utils/validators';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [checkoutData, setCheckoutData] = useState(null);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    
    // Form States
    const [formData, setFormData] = useState({
        plotno: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        phone: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('stripe');
    
    // --- STATE FOR VIRTUAL COINS ---
    const [useCoins, setUseCoins] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await apiGetCheckoutDetails();
                setCheckoutData(data);
                if (data.user && data.user.Address) {
                    setFormData({
                        plotno: data.user.Address.plotno || '',
                        street: data.user.Address.street || '',
                        city: data.user.Address.city || '',
                        state: data.user.Address.state || '',
                        pincode: data.user.Address.pincode || '',
                        phone: data.user.Address.phone || ''
                    });
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        const newErrors = {};
        if (!formData.plotno || !formData.plotno.trim()) newErrors.plotno = 'Plot/House number is required';
        if (!formData.street || !formData.street.trim()) newErrors.street = 'Street/Area is required';
        if (!formData.city || !formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state || !formData.state.trim()) newErrors.state = 'State is required';
        if (!isValidPincode(String(formData.pincode))) newErrors.pincode = 'Please enter a valid 6-digit pincode';
        if (!isValidPhone(String(formData.phone))) newErrors.phone = 'Please enter a valid 10-digit phone number';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setSubmitting(false);
            return;
        }
        setErrors({});
        try {
            const response = await apiSubmitPayment({
                paymentMethod,
                address: formData,
                useCoins: useCoins // Pass the toggle state to backend
            });
            if (response?.checkoutUrl) {
                window.location.href = response.checkoutUrl;
                return;
            }
            // FIX: Redirect to the correct route defined in App.jsx
            navigate('/account/orders'); 
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-10 text-center dark:text-white dark:bg-gray-900 min-h-screen">Loading checkout details...</div>;
    if (error) return <div className="p-10 text-center text-red-500 dark:bg-gray-900 min-h-screen">{error}</div>;

    // --- CALCULATIONS ---
    const subtotal = checkoutData?.total || 0;
    const shipping = 5.00;
    const availableCoins = checkoutData?.user?.coins || 0;
    
    let coinDiscount = 0;
    let finalTotal = subtotal + shipping;

    if (useCoins && availableCoins > 0) {
        // You can't use more coins than the total bill
        coinDiscount = Math.min(finalTotal, availableCoins);
        finalTotal = finalTotal - coinDiscount;
    }
    // --------------------

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">Checkout</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* LEFT COLUMN: Shipping & Payment */}
                    <div className="space-y-8">
                        {/* Address Form */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl font-semibold mb-4 flex items-center dark:text-white">
                                <Truck className="mr-2 text-green-500" /> Shipping Address
                            </h2>
                            <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Plot No / Flat</label>
                                    <input required name="plotno" value={formData.plotno} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" />
                                    {errors.plotno && <p className="text-sm text-red-600 mt-1">{errors.plotno}</p>}
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Street Area</label>
                                    <input required name="street" value={formData.street} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" />
                                    {errors.street && <p className="text-sm text-red-600 mt-1">{errors.street}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                                    <input required name="city" value={formData.city} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" />
                                    {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
                                    <input required name="state" value={formData.state} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" />
                                    {errors.state && <p className="text-sm text-red-600 mt-1">{errors.state}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pincode</label>
                                    <input required name="pincode" type="number" value={formData.pincode} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" />
                                    {errors.pincode && <p className="text-sm text-red-600 mt-1">{errors.pincode}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                                    <input required name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border" />
                                    {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                                </div>
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl font-semibold mb-4 flex items-center dark:text-white">
                                <CreditCard className="mr-2 text-green-500" /> Payment Method
                            </h2>
                            <div className="space-y-3">
                                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'stripe' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-1 ring-green-500' : 'border-gray-200 dark:border-gray-600'} ${finalTotal === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="stripe" 
                                        checked={paymentMethod === 'stripe'} 
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="text-green-600 focus:ring-green-500"
                                        disabled={finalTotal === 0}
                                    />
                                    <span className="ml-3 font-medium dark:text-gray-200">
                                        Card (Stripe)
                                    </span>
                                </label>
                            </div>
                            {finalTotal === 0 && (
                                <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                                    Fully paid with Virtual Coins!
                                </p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Summary */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 sticky top-24">
                            <h2 className="text-xl font-semibold mb-6 dark:text-white">Order Summary</h2>
                            
                            {/* Product List */}
                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {checkoutData.user.cart.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 font-mono">x{item.quantity}</span>
                                            <div className="flex flex-col">
                                                <span className="text-gray-800 dark:text-gray-300 truncate max-w-[150px] font-medium">{item.productId.title}</span>
                                                {/* Show Size if available */}
                                                {item.size && <span className="text-xs text-gray-500 dark:text-gray-400">Size: {item.size}</span>}
                                            </div>
                                        </div>
                                        <span className="font-medium dark:text-gray-200">Rs.{item.productId.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 text-gray-600 dark:text-gray-400">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>Rs.{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>Rs.{shipping.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* --- VIRTUAL COINS SECTION --- */}
                            <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700/50">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Coins className="text-yellow-500" size={20} />
                                        <span className="font-bold text-gray-800 dark:text-yellow-100">Use Virtual Coins</span>
                                    </div>
                                    <span className="text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded border dark:border-gray-600 dark:text-white shadow-sm">
                                        Bal: {availableCoins}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between mt-3">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer"
                                            checked={useCoins}
                                            onChange={() => setUseCoins(!useCoins)}
                                            disabled={availableCoins <= 0}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                            {availableCoins > 0 ? "Apply Discount" : "No coins available"}
                                        </span>
                                    </label>
                                    
                                    {useCoins && (
                                        <span className="text-red-500 font-bold">- Rs.{coinDiscount.toFixed(2)}</span>
                                    )}
                                </div>
                            </div>
                            {/* --------------------------- */}

                            <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total to Pay</span>
                                    <span className="text-2xl font-extrabold text-green-600 dark:text-green-400">
                                        Rs.{Math.max(0, finalTotal).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={submitting}
                                className="w-full mt-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-[1.02] transition-all disabled:opacity-50 flex justify-center items-center"
                            >
                                {submitting ? 'Processing...' : (finalTotal === 0 ? 'Place Order (Paid with Coins)' : 'Pay & Place Order')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;