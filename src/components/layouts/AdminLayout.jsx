import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleTheme, selectTheme } from '../../store/slices/themeSlice';
import { adminLogout } from '../../store/slices/adminAuthSlice';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { ClipboardList, Home, NotebookPen, Package, ShieldCheck, ShoppingCart, Store, Users, Sun, Moon, Building2, BarChart3, Trophy } from 'lucide-react';

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
  >
    <Icon size={18} />
    {label}
  </NavLink>
);

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mode = useSelector(selectTheme);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = async () => {
    await dispatch(adminLogout());
    navigate('/auth');
  };

  return (
    <div className="min-h-screen grid grid-cols-12 bg-background text-foreground">
      <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Link to="/admin/dashboard" className="text-2xl font-bold text-primary">Admin</Link>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
        <button
          onClick={handleToggle}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100"
          aria-label="Toggle theme"
        >
          {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <nav className="space-y-1">
          <NavItem to="/admin/dashboard" icon={Home} label="Dashboard" />
          <NavItem to="/admin/product-analytics" icon={BarChart3} label="Product Analytics" />
          <NavItem to="/admin/user-analytics" icon={Users} label="User Analytics" />
          <NavItem to="/admin/performance-rankings" icon={Trophy} label="Rankings" />
          <NavItem to="/admin/blogs" icon={NotebookPen} label="Blogs" />
          <NavItem to="/admin/customers" icon={Users} label="Customers" />
          <NavItem to="/admin/products" icon={Package} label="Products" />
          <NavItem to="/admin/sellers" icon={Store} label="Sellers" />
          <NavItem to="/admin/vendors" icon={ShieldCheck} label="Vendors" />
          <NavItem to="/admin/industries" icon={Building2} label="Industries" />
          <NavItem to="/admin/orders" icon={ShoppingCart} label="Orders" />
          <NavItem to="/admin/sell-products" icon={ClipboardList} label="Second-hand" />
        </nav>
      </aside>
      <main className="col-span-12 md:col-span-9 lg:col-span-10 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
