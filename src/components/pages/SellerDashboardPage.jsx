// src/components/pages/SellerDashboardPage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchSellerProfile, fetchSellerProducts, fetchSellerOrders } from '../../store/slices/sellerSlice';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const SellerDashboardPage = () => {
    const dispatch = useDispatch();
    const { 
        seller, 
        products, 
        orders, 
        productsLoading, 
        ordersLoading 
    } = useSelector((state) => state.seller);

    useEffect(() => {
        dispatch(fetchSellerProfile());
        dispatch(fetchSellerProducts());
        dispatch(fetchSellerOrders());
    }, [dispatch]);

    // Calculate statistics
    const safeOrders = Array.isArray(orders) ? orders : [];
    const safeProducts = Array.isArray(products) ? products : [];

    const totalProducts = safeProducts.length;
    const totalSales = safeOrders.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
    const totalOrdersCount = safeOrders.length || 0;
    const inStockProducts = safeProducts.filter(product => product.stock).length;

    const recentOrders = safeOrders.slice(0, 5);
    const recentProducts = safeProducts.slice(0, 5);

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        Welcome back, {seller?.name || 'Seller'}!
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Store: {seller?.storeName} | Email: {seller?.email}
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                                <p className="text-2xl font-bold text-foreground">{totalProducts}</p>
                            </div>
                            <div className="p-3 bg-blue-500/10 rounded-full">
                                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">In Stock</p>
                                <p className="text-2xl font-bold text-foreground">{inStockProducts}</p>
                            </div>
                            <div className="p-3 bg-green-500/10 rounded-full">
                                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                                <p className="text-2xl font-bold text-foreground">₹{totalSales.toFixed(2)}</p>
                            </div>
                            <div className="p-3 bg-yellow-500/10 rounded-full">
                                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                                <p className="text-2xl font-bold text-foreground">{totalOrdersCount}</p>
                            </div>
                            <div className="p-3 bg-purple-500/10 rounded-full">
                                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="p-6 mb-8">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/seller/products/create">
                            <Button variant="primary">
                                Add New Product
                            </Button>
                        </Link>
                        <Link to="/seller/products">
                            <Button variant="outline">
                                Manage Products
                            </Button>
                        </Link>
                        <Link to="/seller/orders">
                            <Button variant="outline">
                                View Orders
                            </Button>
                        </Link>
                        <Link to="/seller/profile">
                            <Button variant="outline">
                                Edit Profile
                            </Button>
                        </Link>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Products */}
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-foreground">Recent Products</h2>
                            <Link to="/seller/products">
                                <Button variant="outline" size="sm">View All</Button>
                            </Link>
                        </div>
                        {productsLoading ? (
                            <p className="text-muted-foreground">Loading products...</p>
                        ) : recentProducts.length === 0 ? (
                            <p className="text-muted-foreground">No products yet. Create your first product!</p>
                        ) : (
                            <div className="space-y-3">
                                {recentProducts.map((product) => (
                                    <div key={product._id} className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                                        {product.image && (
                                            <img 
                                                src={product.image} 
                                                alt={product.title}
                                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-foreground truncate">{product.title}</h3>
                                            <p className="text-sm text-muted-foreground">₹{product.price} • Qty: {product.quantity}</p>
                                        </div>
                                        <Badge variant={product.stock ? 'success' : 'destructive'} className="flex-shrink-0">
                                            {product.stock ? 'In Stock' : 'Out of Stock'}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Recent Sales */}
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
                            <Link to="/seller/orders">
                                <Button variant="outline" size="sm">View All</Button>
                            </Link>
                        </div>
                        {ordersLoading ? (
                            <p className="text-muted-foreground">Loading orders...</p>
                        ) : recentOrders.length === 0 ? (
                            <p className="text-muted-foreground">No orders yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {recentOrders.map((order) => (
                                    <div key={order.orderId} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-foreground">
                                                {order.items.length > 1 
                                                    ? `${order.items[0].title} +${order.items.length - 1} more` 
                                                    : order.items[0]?.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {order.buyer ? `${order.buyer.firstname} ${order.buyer.lastname}` : 'N/A'} • {new Date(order.orderDate).toLocaleDateString('en-IN')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-foreground">₹{order.totalAmount}</p>
                                            <Badge 
                                                variant={
                                                    order.status === 'Delivered' ? 'success' : 
                                                    order.status === 'Shipped' ? 'default' : 'secondary'
                                                }
                                            >
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};