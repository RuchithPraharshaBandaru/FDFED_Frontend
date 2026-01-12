// src/components/pages/AccountAddressPage.jsx
import React, { useState, useEffect } from 'react';
import { apiGetAccountAddress, apiUpdateAccountAddress } from '../../services/api';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { useFormState } from '../../hooks';
import { isValidPhone, isValidPincode } from '../../utils/validators';

const AccountAddressPage = () => {
    const { formData, setFormData, handleChange } = useFormState({
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
    const [errors, setErrors] = useState({});

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
    }, [setFormData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        const newErrors = {};
        if (!formData.plotno || !formData.plotno.trim()) newErrors.plotno = 'Plot/House number is required';
        if (!formData.street || !formData.street.trim()) newErrors.street = 'Street/Area is required';
        if (!formData.city || !formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state || !formData.state.trim()) newErrors.state = 'State is required';
        if (!isValidPincode(formData.pincode)) newErrors.pincode = 'Please enter a valid 6-digit pincode';
        if (!isValidPhone(formData.phone)) newErrors.phone = 'Please enter a valid 10-digit phone number';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
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

    if (loading) return <div className="text-center py-12 text-gray-700 dark:text-gray-300 font-semibold">Loading address...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white bg-clip-text text-transparent">My Address</h2>
            
            {message && <Alert type="success" message={message} className="mb-4" />}
            {error && <Alert type="error" message={error} className="mb-4" />}
            
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Plot No. / House No."
                            name="plotno"
                            value={formData.plotno}
                            onChange={handleChange}
                        />
                        {errors.plotno && <p className="text-sm text-red-600 mt-1">{errors.plotno}</p>}
                        <Input
                            label="Street / Area"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                        />
                        {errors.street && <p className="text-sm text-red-600 mt-1">{errors.street}</p>}
                        <Input
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                        />
                        {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
                        <Input
                            label="State"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                        />
                        {errors.state && <p className="text-sm text-red-600 mt-1">{errors.state}</p>}
                        <Input
                            label="Pincode"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                        />
                        {errors.pincode && <p className="text-sm text-red-600 mt-1">{errors.pincode}</p>}
                        <Input
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                    </div>
                    
                    <Button type="submit" variant="primary" fullWidth>
                        Save Address
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AccountAddressPage;