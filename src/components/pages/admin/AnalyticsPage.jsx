import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalyticsThunk, selectAdminAnalytics } from '../../../store/slices/adminSlice';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const analytics = useSelector(selectAdminAnalytics);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const run = () => {
    dispatch(fetchAnalyticsThunk({ from, to }));
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="grid sm:grid-cols-4 gap-3 max-w-3xl">
        <Input label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Input label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <div className="flex items-end"><Button onClick={run}>Fetch</Button></div>
      </div>

      {analytics.loading ? 'Loading…' : analytics.summary && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border rounded-xl p-4">
            <div className="font-semibold mb-2">Users</div>
            <div className="text-2xl font-bold">{analytics.summary.users?.total ?? 0}</div>
          </div>
          <div className="border rounded-xl p-4">
            <div className="font-semibold mb-2">Sellers</div>
            <div className="text-2xl font-bold">{analytics.summary.sellers?.total ?? 0}</div>
          </div>
          <div className="border rounded-xl p-4">
            <div className="font-semibold mb-2">Products</div>
            <div className="text-2xl font-bold">{analytics.summary.products?.total ?? 0}</div>
            <div className="text-xs text-muted-foreground">Verified: {analytics.summary.products?.verified ?? 0}</div>
          </div>
          <div className="border rounded-xl p-4 md:col-span-2 lg:col-span-3">
            <div className="font-semibold mb-2">Orders: {analytics.total}</div>
            <div className="text-sm text-muted-foreground">Delivered: {analytics.summary.orders?.statusBreakdown?.Delivered ?? 0}</div>
          </div>
        </div>
      )}

      {analytics.items?.length > 0 && (
        <div className="rounded-xl border overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-2 px-3">Order</th>
                <th>Status</th>
                <th>Total</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {analytics.items.map(i => (
                <tr key={i._id} className="border-t">
                  <td className="py-2 px-3">{i._id}</td>
                  <td>{i.orderStatus}</td>
                  <td>₹{i.totalAmount}</td>
                  <td>{new Date(i.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
