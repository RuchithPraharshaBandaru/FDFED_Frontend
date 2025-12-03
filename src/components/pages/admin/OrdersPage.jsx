import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrdersThunk, updateOrderStatusThunk, selectAdminOrders } from '../../../store/slices/adminSlice';
import Select from '../../ui/Select';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const statuses = ['Pending','Processing','Shipped','Delivered','Cancelled','Returned'];

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(selectAdminOrders);

  useEffect(() => { dispatch(fetchOrdersThunk({})); }, [dispatch]);

  const updateStatus = async (orderId, orderStatus) => {
    const res = await dispatch(updateOrderStatusThunk({ orderId, orderStatus }));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Status updated');
    else toast.error(res.payload || 'Failed to update');
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Orders (by User)</h1>
      {loading ? 'Loading…' : (
        <div className="rounded-2xl border shadow-sm overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900/40 backdrop-blur supports-backdrop-filter:bg-gray-50/80 dark:supports-backdrop-filter:bg-gray-900/40">
              <tr className="text-left text-gray-600 dark:text-gray-300">
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide">User</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide">Orders</th>
              </tr>
            </thead>
            <tbody>
              {(items || []).map(u => (
                <tr key={u._id} className="border-t align-top">
                  <td className="py-3 px-4">
                    <div className="font-medium">{u.name || `${u.firstname || ''} ${u.lastname || ''}`.trim() || 'User'}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                    <Link to={`/admin/orders/user/${u._id}`} className="text-green-700 text-xs">View all</Link>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-3">
                      {(u.orders || []).map(o => (
                        <div key={o._id} className="border rounded-xl p-3">
                          <div className="grid md:grid-cols-4 gap-3">
                            <div>
                              <div className="font-medium">Order: {o._id}</div>
                              <div className="text-xs text-gray-500">Total: ₹{o.totalAmount}</div>
                              <div className="text-xs text-gray-500">Payment: {o.paymentStatus} • {o.paymentMethod}</div>
                            </div>
                            <div className="md:col-span-2">
                              <div className="flex flex-wrap gap-3">
                                {(o.products || []).map((p, idx) => (
                                  <div key={p._id || idx} className="flex items-center gap-2">
                                    <img
                                      src={p.productId?.image || 'https://via.placeholder.com/64x64?text=No+Image'}
                                      alt={p.productId?.title || 'Product'}
                                      className="h-12 w-12 rounded-md border object-cover"
                                    />
                                    <div>
                                      <div className="font-medium text-xs">{p.productId?.title || 'Product'}</div>
                                      <div className="text-[11px] text-gray-500">Qty: {p.quantity} • ₹{p.price}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Ship to</div>
                              <div className="text-xs">
                                {o.shippingAddress?.fullname}
                                <div className="text-gray-500">{o.shippingAddress?.street}</div>
                                <div className="text-gray-500">{o.shippingAddress?.city}, {o.shippingAddress?.state} {o.shippingAddress?.pincode}</div>
                                <div className="text-gray-500">{o.shippingAddress?.phone}</div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 max-w-xs">
                            <Select
                              name={`status-${o._id}`}
                              value={o.orderStatus}
                              onChange={(e) => updateStatus(o._id, e.target.value)}
                              options={statuses.map(s => ({ label: s, value: s }))}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!items || items.length === 0) && (
            <div className="p-6 text-sm text-center text-muted-foreground">No orders found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
