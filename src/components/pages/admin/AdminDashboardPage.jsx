import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard, selectAdminDashboard } from '../../../store/slices/adminSlice';
import { BarChart3, Users, Package, ShoppingCart, TrendingUp, ArrowUpRight } from 'lucide-react';
import Graph from '../../ui/Graph';
import Card from '../../ui/Card';
import { fetchAllCharts } from '../../../services/chartsLocal';

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
  <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
    <div className={`absolute top-0 right-0 p-4 opacity-10 ${color.replace('bg-', 'text-')}`}>
      <Icon size={64} />
    </div>
    <div className="relative z-10">
      <div className={`p-3 rounded-xl w-fit mb-4 ${color} bg-opacity-10 text-white`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{value ?? 0}</div>
      {trend && (
        <div className="flex items-center gap-1 mt-2 text-xs font-medium text-green-600">
          <TrendingUp size={14} />
          <span>{trend}</span>
        </div>
      )}
    </div>
  </Card>
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
    <div className="space-y-8 p-2">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's what's happening with your store today.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          label="Total Users" 
          value={metrics?.users} 
          color="bg-blue-500"
          trend="+12% from last month"
        />
        <StatCard 
          icon={Package} 
          label="Total Products" 
          value={metrics?.products} 
          color="bg-purple-500"
          trend="+5% new items"
        />
        <StatCard 
          icon={ShoppingCart} 
          label="Total Orders" 
          value={metrics?.orders} 
          color="bg-orange-500"
          trend="+18% conversion rate"
        />
        <StatCard 
          icon={BarChart3} 
          label="Total Revenue" 
          value={metrics?.totalRevenue} 
          color="bg-green-500"
          trend="+24% revenue growth"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Graph title="User Growth" series={localCharts.usersCreated} color="#3b82f6" />
          <Graph title="Product Inventory" series={localCharts.productsAdded} color="#a855f7" />
        </div>
        <div className="space-y-8">
          <Graph title="Order Volume" series={localCharts.ordersCount} color="#f97316" />
          <Graph title="Revenue Trends" series={localCharts.revenue} formatValue={(v) => `₹${Number(v || 0).toFixed(0)}`} color="#22c55e" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="overflow-hidden border-none shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Sellers</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ArrowUpRight size={16} />
            </button>
          </div>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-4 rounded-l-lg">Seller</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4 rounded-r-lg">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {(top?.sellers || []).slice(0, 5).map(s => (
                    <tr key={s._id || s.email} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent((s.firstname||'') + ' ' + (s.lastname||''))}&background=random`}
                            alt={s.firstname}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-900 shadow-sm"
                          />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{s.firstname} {s.lastname}</div>
                            <div className="text-xs text-gray-500">ID: {(s._id||'').slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{s.email}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!top?.sellers || top.sellers.length === 0) && (
                <div className="p-8 text-center text-gray-500">No sellers found.</div>
              )}
            </div>
          )}
        </Card>

        <Card className="overflow-hidden border-none shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Products</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ArrowUpRight size={16} />
            </button>
          </div>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-4 rounded-l-lg">Product</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 rounded-r-lg">Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {(top?.products || []).slice(0, 5).map(p => (
                    <tr key={p._id || p.title} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img
                              src={p.image || 'https://via.placeholder.com/64x64?text=No+Image'}
                              alt={p.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white line-clamp-1">{p.title}</div>
                            <div className="text-xs text-gray-500">{p._id ? `ID: ${p._id.slice(-6)}` : ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">₹{p.price}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          {p.category || '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!top?.products || top.products.length === 0) && (
                <div className="p-8 text-center text-gray-500">No products found.</div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
