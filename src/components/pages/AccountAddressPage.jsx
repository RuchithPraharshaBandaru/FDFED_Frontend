// src/components/pages/AccountAddressPage.jsx
import React, { useState, useEffect } from 'react';
import { apiGetAccountAddress, apiUpdateAccountAddress } from '../../services/api';

const AccountAddressPage = () => {
    const [formData, setFormData] = useState({
        plotno: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch the address when the component loads
    useEffect(() => {
        const fetchAddress = async () => {
            setLoading(true);
            try {
                const data = await apiGetAccountAddress();
                if (data.success) {
                    setFormData(data.address);
                }
            } catch (err) {
                setError('Failed to load address.');
            }
            setLoading(false);
        };
        fetchAddress();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const data = await apiUpdateAccountAddress(formData);
            if (data.success) {
                setMessage('Address updated successfully!');
                setFormData(data.address); // Update form with any returned data
            }
        } catch (err) {
            setError(err.message || 'Failed to update address.');
        }
    };

    if (loading) return <div>Loading address...</div>;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">My Address</h2>
            {message && <p className="text-green-600 mb-4">{message}</p>}
            {error && <p className="text-red-600 mb-4">{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="plotno" className="block text-sm font-medium text-gray-700">Plot No. / House No.</label>
                        <input type="text" name="plotno" id="plotno" value={formData.plotno} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street / Area</label>
                        <input type="text" name="street" id="street" value={formData.street} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                        <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                        <input type="text" name="state" id="state" value={formData.state} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                        <input type="text" name="pincode" id="pincode" value={formData.pincode} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="text" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                </div>
                <div>
                    <button type="submit" className="w-full sm:w-auto bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                        Save Address
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AccountAddressPage;