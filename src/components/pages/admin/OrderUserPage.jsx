import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchOrdersByUserThunk, selectAdminUserOrders, updateOrderStatusThunk } from '../../../store/slices/adminSlice';
import Select from '../../ui/Select';
import { toast } from 'react-hot-toast';

const statuses = ['Pending','Processing','Shipped','Delivered','Cancelled','Returned'];

const OrderUserPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const data = useSelector((s) => selectAdminUserOrders(s, userId));

  useEffect(() => { if (userId) dispatch(fetchOrdersByUserThunk({ userId })); }, [dispatch, userId]);

  const updateStatus = async (orderId, orderStatus) => {
    const res = await dispatch(updateOrderStatusThunk({ orderId, orderStatus }));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Status updated');
    else toast.error(res.payload || 'Failed to update');
  };

  if (!data) return <div>Loading…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">User Orders</h1>
      <div className="space-y-3">
        {(data.items || []).map(o => (
          <div key={o._id} className="border rounded-xl p-4 grid sm:grid-cols-5 gap-2">
            <div className="sm:col-span-2">
              <div className="font-medium">Order: {o._id}</div>
              <div className="text-xs text-muted-foreground">Total: ₹{o.totalAmount}</div>
            </div>
            <div className="sm:col-span-2 text-xs text-muted-foreground">
              Payment: {o.paymentStatus}
            </div>
            <div>
              <Select name={`status-${o._id}`} value={o.orderStatus} onChange={(e) => updateStatus(o._id, e.target.value)} options={statuses.map(s => ({ label: s, value: s }))} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderUserPage;
