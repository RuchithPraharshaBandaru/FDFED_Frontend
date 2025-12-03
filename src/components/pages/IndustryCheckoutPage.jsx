import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useNavigate, Link } from 'react-router-dom';
import { getIndustryCheckout, postIndustryCheckout } from '../../services/api';
import { CheckCircle, Package, Mail, MapPin, Loader } from 'lucide-react';

const IndustryCheckoutPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try {
                const res = await getIndustryCheckout();
                if (!mounted) return;
                setData(res || null);
            } catch (err) {
                if (mounted) setError(err.message || 'Failed to load checkout');
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false };
    }, []);

    const handleCheckout = async () => {
        setProcessing(true);
        setError(null);
        try {
            const res = await postIndustryCheckout();
            setSuccess(true);
            setTimeout(() => navigate('/industry/dashboard'), 2000);
        } catch (err) {
            setError(err.message || 'Checkout failed');
            setProcessing(false);
        }
    };

    const cartItems = data?.cart || [];
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.amount || 0), 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-background py-12">
                <div className="container mx-auto px-4">
                    <div className="animate-pulse space-y-4">
                        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                        <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 flex items-center justify-center py-12">
                <div className="container mx-auto px-4 max-w-2xl text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-xl">
                        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6 animate-pulse" />
                        <h1 className="text-4xl font-bold mb-4 text-green-600">Order Placed Successfully!</h1>
                        <p className="text-lg text-muted-foreground mb-8">Your bulk order has been confirmed. You will be redirected to your dashboard shortly.</p>
                        <Link to="/industry/dashboard">
                            <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-500">
                                View Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/10 to-cyan-50/10 dark:from-gray-950 dark:via-blue-950/10 dark:to-cyan-950/10 py-12">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <Badge className="mb-2 bg-blue-500 hover:bg-blue-600 border-none text-white">Checkout</Badge>
                    <h1 className="text-4xl font-bold mb-2">Review Your Order</h1>
                    <p className="text-muted-foreground">Confirm details before placing your bulk order</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                        <p className="font-semibold">{error}</p>
                    </div>
                )}

                {data && (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Delivery Address */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-border">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="font-bold text-lg">Delivery Address</h3>
                                </div>
                                <div className="ml-13 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <p className="font-medium">{data.address || 'Address not provided'}</p>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-border">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                                    </div>
                                    <h3 className="font-bold text-lg">Contact Information</h3>
                                </div>
                                <div className="ml-13 p-4 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                                    <p className="font-medium">{data.email || 'Email not provided'}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-border">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                                        <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="font-bold text-lg">Order Items ({cartItems.length})</h3>
                                </div>
                                <div className="space-y-3">
                                    {cartItems.map((item, idx) => (
                                        <div key={item.id || item._id || idx} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">{item.fabric || 'Fabric'}</p>
                                                <p className="text-sm text-muted-foreground">Size: {item.size || 'N/A'} | Qty: {item.quantity || 1}</p>
                                            </div>
                                            <p className="font-bold text-lg">₹{(item.amount || 0).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800 sticky top-20">
                                <h3 className="text-lg font-bold mb-6">Order Summary</h3>
                                
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-medium">₹{totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Delivery</span>
                                        <span className="font-medium text-green-600">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">GST & Taxes</span>
                                        <span className="font-medium">Calculated</span>
                                    </div>
                                </div>
                                
                                <div className="border-t border-blue-300 dark:border-blue-700 pt-4 mb-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="font-bold">Total</span>
                                        <span className="text-2xl font-bold text-blue-600">₹{totalAmount.toLocaleString()}</span>
                                    </div>
                                    
                                    <Button
                                        onClick={handleCheckout}
                                        disabled={processing}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50"
                                        size="lg"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Place Order'
                                        )}
                                    </Button>
                                </div>

                                <Link to="/industry/cart" className="w-full">
                                    <Button variant="outline" className="w-full" disabled={processing}>
                                        Back to Cart
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IndustryCheckoutPage;
