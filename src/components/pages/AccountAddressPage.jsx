// src/components/pages/AccountAddressPage.jsx
import React, { useState, useEffect } from 'react';
import { apiGetAccountAddress, apiUpdateAccountAddress } from '../../services/api';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

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
                setFormData(data.address);
            }
        } catch (err) {
            setError(err.message || 'Failed to update address.');
        }
    };

    if (loading) return <div className="dark:text-white">Loading address...</div>;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">My Address</h2>
            
            <Alert type="success" message={message} className="mb-4" />
            <Alert type="error" message={error} className="mb-4" />
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Plot No. / House No."
                        name="plotno"
                        value={formData.plotno}
                        onChange={handleChange}
                    />
                    <Input
                        label="Street / Area"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                    />
                    <Input
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                    />
                    <Input
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                    />
                    <Input
                        label="Pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                    />
                    <Input
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                
                <Button type="submit" variant="primary">
                    Save Address
                </Button>
            </form>
        </div>
    );
};

export default AccountAddressPage;