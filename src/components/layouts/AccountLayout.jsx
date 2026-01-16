// src/components/layouts/AccountLayout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';

const AccountLayout = () => {
    const user = useSelector(selectUser);

    const activeStyle = {
        backgroundColor: '#f3f4f6', // gray-100
        color: '#1f2937', // gray-800
        fontWeight: '600'
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 dark:from-gray-950 dark:via-green-900/25 dark:to-emerald-900/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none"></div>
            <div className="relative container mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white bg-clip-text text-transparent">My Account</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Welcome, {user?.firstname}!</p>
            
                <div className="flex flex-col md:flex-row gap-8">
                    {/* --- Sidebar Navigation --- */}
                    <aside className="w-full md:w-1/4">
                        <nav className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-2xl shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-green-500/30 transition-all flex flex-col space-y-2">
                        
                        {/* --- NEW LINKS ADDED HERE --- */}
                        <NavLink
                            to="/account/orders"
                            style={({ isActive }) => isActive ? activeStyle : undefined}
                            className="px-4 py-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Order History
                        </NavLink>
                        <NavLink
                            to="/account/donations"
                            style={({ isActive }) => isActive ? activeStyle : undefined}
                            className="px-4 py-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Sold Products
                        </NavLink>
                        {/* --- END OF NEW LINKS --- */}

                        <NavLink
                            to="/account"
                            end 
                            style={({ isActive }) => isActive ? activeStyle : undefined}
                            className="px-4 py-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Profile Details
                        </NavLink>
                        <NavLink
                            to="/account/address"
                            style={({ isActive }) => isActive ? activeStyle : undefined}
                            className="px-4 py-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Address
                        </NavLink>
                        </nav>
                    </aside>

                    {/* --- Page Content (Profile, Address, Orders, etc.) --- */}
                    <main className="w-full md:w-3/4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <Outlet /> 
                    </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AccountLayout;