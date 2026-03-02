// src/components/pages/rider/RiderSignupPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { riderRegister, selectRiderLoading, selectRiderError } from '../../../store/slices/riderSlice';
import { Bike } from 'lucide-react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import Select from '../../ui/Select';
import Alert from '../../ui/Alert';

const RiderSignupPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectRiderLoading);
    const error = useSelector(selectRiderError);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        vehicleType: 'Bike',
        vehicleNumber: '',
        street: '',
        city: '',
        pincode: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            vehicle: {
                type: formData.vehicleType,
                number: formData.vehicleNumber
            },
            address: {
                street: formData.street,
                city: formData.city,
                pincode: formData.pincode,
                isDefault: true
            }
        };

        const result = await dispatch(riderRegister(payload));
        if (riderRegister.fulfilled.match(result)) {
            navigate('/rider/login');
        }
    };

    const vehicleOptions = [
        { value: 'Bike', label: 'Bike' },
        { value: 'Scooter', label: 'Scooter' },
        { value: 'Car', label: 'Car' }
    ];

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-cyan-50/30 dark:from-gray-950 dark:via-blue-900/30 dark:to-cyan-900/25 flex items-center justify-center py-12 px-6 overflow-hidden">
            {/* Futuristic background elements */}
            <div className="absolute inset-0 bg-dot-pattern opacity-[0.03] dark:opacity-[0.08] pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/15 to-cyan-500/15 dark:from-blue-500/25 dark:to-cyan-600/25 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-cyan-400/10 to-blue-500/10 dark:from-cyan-600/20 dark:to-blue-700/20 blur-3xl rounded-full" />

            {/* Main Card */}
            <div className="relative max-w-2xl w-full">
                {/* Glassmorphism container */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/90 dark:to-gray-900/80 backdrop-blur-xl rounded-2xl" />
                <div className="relative bg-white/60 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-blue-500/30 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/20 p-8">

                    {/* Header with icon */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 mb-4 shadow-lg shadow-blue-500/30">
                            <Bike className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Register as Rider</h2>
                        <p className="text-gray-600 dark:text-gray-400">Join our fleet and start earning</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <Alert type="error" message={error} className="mb-4" />
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Info */}
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                            {/* Vehicle Info */}
                            <Select
                                label="Vehicle Type"
                                name="vehicleType"
                                value={formData.vehicleType}
                                onChange={handleChange}
                                options={vehicleOptions}
                                required
                            />
                            <Input
                                label="Vehicle Number"
                                name="vehicleNumber"
                                value={formData.vehicleNumber}
                                onChange={handleChange}
                                required
                            />

                            {/* Address Info */}
                            <div className="md:col-span-2">
                                <Input
                                    label="Street Address"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <Input
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Pincode"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Button
                                type="submit"
                                fullWidth
                                disabled={loading}
                                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-lg shadow-blue-500/30"
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </Button>
                        </div>
                    </form>

                    <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
                        Already have an account?{' '}
                        <Link to="/rider/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RiderSignupPage;
