import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard, selectAdminDashboard } from '../../../store/slices/adminSlice';
import { BarChart3, Users, Package, ShoppingCart } from 'lucide-react';
import Graph from '../../ui/Graph';
import { fetchAllCharts } from '../../../services/chartsLocal';

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl border p-4 bg-white/60 dark:bg-gray-900/40 backdrop-blur">
    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Icon size={16} /> {label}</div>
    <div className="text-2xl font-bold mt-2">{value ?? 0}</div>
  </div>
);

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { metrics, top, loading } = useSelector(selectAdminDashboard);
  const [localCharts, setLocalCharts] = useState({
    usersCreated: [],
    productsAdded: [],
    ordersCount: [],
    revenue: [],
  });

  useEffect(() => {
    // Fetch backend dashboard for summary and top lists
    dispatch(fetchDashboard({ days: 30, tz: 'UTC' }));
    // Load local chart JSONs for chart rendering
    fetchAllCharts()
      .then(setLocalCharts)
      .catch(() => setLocalCharts({ usersCreated: [], productsAdded: [], ordersCount: [], revenue: [] }));
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Users" value={metrics?.users} />
        <StatCard icon={Package} label="Products" value={metrics?.products} />
        <StatCard icon={ShoppingCart} label="Orders" value={metrics?.orders} />
        <StatCard icon={BarChart3} label="Revenue" value={metrics?.totalRevenue} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Charts grid */}
        <div className="space-y-6">
          <Graph title="Users Created" series={localCharts.usersCreated} />
          <Graph title="Products Added" series={localCharts.productsAdded} />
        </div>
        <div className="space-y-6">
          <Graph title="Orders Count" series={localCharts.ordersCount} />
          <Graph title="Revenue" series={localCharts.revenue} formatValue={(v) => `₹${Number(v || 0).toFixed(0)}`} />
        </div>
        <div className="rounded-2xl border p-4">
          <h2 className="font-semibold mb-3">Top Sellers</h2>
          {loading ? 'Loading…' : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-900/40">
                  <tr className="text-left text-gray-600 dark:text-gray-300">
                    <th className="py-2 px-3">Seller</th>
                    <th>Email</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {(top?.sellers || []).slice(0,5).map(s => (
                    <tr key={s._id || s.email} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent((s.firstname||'') + ' ' + (s.lastname||''))}&background=E5E7EB&color=111827&size=96`}
                            alt={s.firstname}
                            className="h-9 w-9 rounded-full object-cover border"
                          />
                          <div>
                            <div className="font-medium">{s.firstname} {s.lastname}</div>
                            <div className="text-xs text-gray-500">ID: {(s._id||'').slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td>{s.email}</td>
                      <td>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!top?.sellers || top.sellers.length === 0) && (
                <div className="p-6 text-sm text-center text-muted-foreground">No sellers found.</div>
              )}
            </div>
          )}
        </div>
        <div className="rounded-2xl border p-4">
          <h2 className="font-semibold mb-3">Top Products</h2>
          {loading ? 'Loading…' : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-900/40">
                  <tr className="text-left text-gray-600 dark:text-gray-300">
                    <th className="py-2 px-3">Product</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {(top?.products || []).slice(0,5).map(p => (
                    <tr key={p._id || p.title} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image || 'https://via.placeholder.com/64x64?text=No+Image'}
                            alt={p.title}
                            className="h-10 w-10 rounded-md border object-cover"
                          />
                          <div>
                            <div className="font-medium">{p.title}</div>
                            <div className="text-xs text-gray-500">{p._id ? `ID: ${p._id.slice(-6)}` : ''}</div>
                          </div>
                        </div>
                      </td>
                      <td>₹{p.price}</td>
                      <td>
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border bg-green-50 text-green-700 border-green-200">
                          {p.category || '—'}
                        </span>
                      </td>
                      <td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!top?.products || top.products.length === 0) && (
                <div className="p-6 text-sm text-center text-muted-foreground">No products found.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
