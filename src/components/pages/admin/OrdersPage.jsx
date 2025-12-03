import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersThunk, updateOrderStatusThunk, selectAdminOrders } from '../../../store/slices/adminSlice';
import Select from '../../ui/Select';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, XCircle, Clock, RefreshCw, User, MapPin, CreditCard, ShoppingBag, ChevronDown, ChevronUp, Search } from 'lucide-react';

const statuses = ['Pending','Processing','Shipped','Delivered','Cancelled','Returned'];

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(selectAdminOrders);
  const [expandedUser, setExpandedUser] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => { dispatch(fetchOrdersThunk({})); }, [dispatch]);

  const updateStatus = async (orderId, orderStatus) => {
    const res = await dispatch(updateOrderStatusThunk({ orderId, orderStatus }));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Status updated');
    else toast.error(res.payload || 'Failed to update');
  };

  const toggleUser = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'Returned': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Processing': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Delivered': return <CheckCircle size={14} />;
      case 'Cancelled': return <XCircle size={14} />;
      case 'Returned': return <RefreshCw size={14} />;
      case 'Shipped': return <Truck size={14} />;
      case 'Processing': return <Package size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const filteredItems = (items || []).filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    const name = (u.name || `${u.firstname || ''} ${u.lastname || ''}`).toLowerCase();
    const email = (u.email || '').toLowerCase();
    const orderIds = (u.orders || []).map(o => o._id).join(' ');
    return name.includes(q) || email.includes(q) || orderIds.includes(q);
  });

  return (
    <div className="space-y-6 p-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage customer orders and shipments</p>
        </div>
      </div>

      <Card className="border-none shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by user, email or order ID..." 
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading orders...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredItems.map(u => {
              const orderCount = (u.orders || []).length;
              const isExpanded = expandedUser === u._id;
              
              return (
                <div key={u._id} className="bg-white dark:bg-gray-900">
                  <div 
                    className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${isExpanded ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}
                    onClick={() => toggleUser(u._id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                        {(u.firstname || u.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{u.name || `${u.firstname || ''} ${u.lastname || ''}`.trim() || 'User'}</div>
                        <div className="text-sm text-gray-500">{u.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium text-gray-900 dark:text-white">{orderCount}</span> Orders
                      </div>
                      {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 space-y-4">
                      <div className="flex justify-end">
                        <Link to={`/admin/orders/user/${u._id}`}>
                          <Button variant="outline" size="sm" className="text-xs">View User History</Button>
                        </Link>
                      </div>
                      
                      {(u.orders || []).map(o => (
                        <Card key={o._id} className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                          <div className="p-4 grid md:grid-cols-12 gap-6">
                            {/* Order Info */}
                            <div className="md:col-span-3 space-y-3">
                              <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Order ID</div>
                                <div className="font-mono text-sm font-medium text-gray-900 dark:text-white truncate" title={o._id}>{o._id}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Amount</div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white">₹{o.totalAmount}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Payment</div>
                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                  <CreditCard size={14} />
                                  <span className="capitalize">{o.paymentMethod}</span>
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${o.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {o.paymentStatus}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Products */}
                            <div className="md:col-span-5">
                              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Items</div>
                              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                {(o.products || []).map((p, idx) => (
                                  <div key={p._id || idx} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                                    <img
                                      src={p.productId?.image || 'https://via.placeholder.com/64x64?text=No+Image'}
                                      alt={p.productId?.title || 'Product'}
                                      className="h-10 w-10 rounded object-cover bg-white"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{p.productId?.title || 'Product'}</div>
                                      <div className="text-xs text-gray-500">Qty: {p.quantity} × ₹{p.price}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping & Status */}
                            <div className="md:col-span-4 space-y-4 flex flex-col justify-between">
                              <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Shipping Address</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                                  <div className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                    <User size={12} /> {o.shippingAddress?.fullname}
                                  </div>
                                  <div className="mt-1 flex items-start gap-1">
                                    <MapPin size={12} className="mt-0.5 shrink-0" />
                                    <div>
                                      <div>{o.shippingAddress?.street}</div>
                                      <div>{o.shippingAddress?.city}, {o.shippingAddress?.state} {o.shippingAddress?.pincode}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Order Status</div>
                                <div className="flex gap-2">
                                  <div className="flex-1">
                                    <Select
                                      name={`status-${o._id}`}
                                      value={o.orderStatus}
                                      onChange={(e) => updateStatus(o._id, e.target.value)}
                                      options={statuses.map(s => ({ label: s, value: s }))}
                                      className="w-full"
                                    />
                                  </div>
                                  <div className={`flex items-center justify-center w-10 rounded-lg border ${getStatusColor(o.orderStatus)}`}>
                                    {getStatusIcon(o.orderStatus)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {filteredItems.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No orders found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default OrdersPage;
