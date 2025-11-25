// src/components/pages/AccountPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiUpdateAccountDetails } from '../../services/api';

const AccountPage = () => {
    const { user, setUser } = useAuth(); // Get user and setUser from context
    
    const [formData, setFormData] = useState({
        firstname: user?.firstname || '',
        lastname: user?.lastname || '',
        email: user?.email || '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const data = await apiUpdateAccountDetails(formData);
            if (data.success) {
                setUser(data.user); // <-- This updates the global context!
                setMessage('Profile updated successfully!');
            }
        } catch (err) {
            setError(err.message || 'Failed to update profile.');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">Profile Details</h2>
            {message && <p className="text-green-600 dark:text-green-400 mb-4">{message}</p>}
            {error && <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                    <input
                        type="text"
                        name="firstname"
                        id="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                    <input
                        type="text"
                        name="lastname"
                        id="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    />
                </div>
                <div>
                    <button type="submit" className="w-full sm:w-auto bg-green-500 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-green-600">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AccountPage;