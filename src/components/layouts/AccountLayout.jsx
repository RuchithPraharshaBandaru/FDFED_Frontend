// src/components/layouts/AccountLayout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AccountLayout = () => {
    const { user } = useAuth();

    const activeStyle = {
        backgroundColor: '#f3f4f6', // gray-100
        color: '#1f2937', // gray-800
        fontWeight: '600'
    };

    return (
        <div className="container mx-auto px-6 py-8 dark:bg-gray-900">
            <h1 className="text-3xl font-bold mb-2 dark:text-white">My Account</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Welcome, {user?.firstname}!</p>
            
            <div className="flex flex-col md:flex-row gap-8">
                {/* --- Sidebar Navigation --- */}
                <aside className="w-full md:w-1/4">
                    <nav className="flex flex-col space-y-2">
                        
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
                            My Donations
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
    );
};

export default AccountLayout;