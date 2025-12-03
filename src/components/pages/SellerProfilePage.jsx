// src/components/pages/SellerProfilePage.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerProfile, updateSellerProfile } from '../../store/slices/sellerSlice';
import { useToast } from '../../context/ToastContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Card } from '../ui/Card';

export const SellerProfilePage = () => {
    const dispatch = useDispatch();
    const { seller, loading } = useSelector((state) => state.seller);
    const { showSuccess, showError } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        gstn: '',
        storeName: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: '',
            country: '',
        },
    });

    const [errors, setErrors] = useState({});
    const [updateLoading, setUpdateLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        dispatch(fetchSellerProfile());
    }, [dispatch]);

    useEffect(() => {
        if (seller) {
            console.log('Seller data from backend:', seller);
            setFormData({
                name: seller.name || '',
                email: seller.email || '',
                gstn: seller.gstn || '',
                storeName: seller.storeName || '',
                address: {
                    street: seller.address?.street || '',
                    city: seller.address?.city || '',
                    state: seller.address?.state || '',
                    pincode: seller.address?.pincode || '',
                    country: seller.address?.country || '',
                },
            });
        }
    }, [seller]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Clear error for the field being edited
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
        
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value,
                },
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validate form
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        } else if (formData.name.trim().length > 50) {
            newErrors.name = 'Name must not exceed 50 characters';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Store name validation
        if (!formData.storeName.trim()) {
            newErrors.storeName = 'Store name is required';
        } else if (formData.storeName.trim().length < 2) {
            newErrors.storeName = 'Store name must be at least 2 characters';
        } else if (formData.storeName.trim().length > 100) {
            newErrors.storeName = 'Store name must not exceed 100 characters';
        }

        // GSTN validation (optional but validate format if provided)
        if (formData.gstn.trim()) {
            const gstnRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
            if (!gstnRegex.test(formData.gstn.trim())) {
                newErrors.gstn = 'Please enter a valid GSTN (e.g., 22AAAAA0000A1Z5)';
            }
        }

        // Address validations
        if (!formData.address.street.trim()) {
            newErrors['address.street'] = 'Street address is required';
        } else if (formData.address.street.trim().length < 5) {
            newErrors['address.street'] = 'Street address must be at least 5 characters';
        }

        if (!formData.address.city.trim()) {
            newErrors['address.city'] = 'City is required';
        } else if (formData.address.city.trim().length < 2) {
            newErrors['address.city'] = 'City must be at least 2 characters';
        }

        if (!formData.address.state.trim()) {
            newErrors['address.state'] = 'State is required';
        } else if (formData.address.state.trim().length < 2) {
            newErrors['address.state'] = 'State must be at least 2 characters';
        }

        if (!formData.address.pincode.trim()) {
            newErrors['address.pincode'] = 'PIN code is required';
        } else if (!/^\d{6}$/.test(formData.address.pincode.trim())) {
            newErrors['address.pincode'] = 'Please enter a valid 6-digit PIN code';
        }

        if (!formData.address.country.trim()) {
            newErrors['address.country'] = 'Country is required';
        } else if (formData.address.country.trim().length < 2) {
            newErrors['address.country'] = 'Country must be at least 2 characters';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            // Show the first specific error message in toast
            const firstError = Object.values(newErrors)[0];
            showError(firstError);
            return;
        }

        setUpdateLoading(true);

        try {
            // Transform data to match backend expectations
            const dataToSend = {
                name: formData.name,
                email: formData.email,
                gstn: formData.gstn,
                storeName: formData.storeName,
                address: formData.address
            };
            
            console.log('Sending data to backend:', dataToSend);
            const result = await dispatch(updateSellerProfile(dataToSend)).unwrap();
            console.log('Backend response:', result);
            
            // Refresh the profile to get updated data
            await dispatch(fetchSellerProfile());
            
            setSuccess(true);
            showSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            setError(error);
            showError(error || 'Failed to update profile');
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading && !seller) {
        return (
            <div className="min-h-screen bg-background py-8">
                <div className="container max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center h-64">
                        <p className="text-muted-foreground">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Seller Profile</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your seller account information
                    </p>
                </div>

                <Card className="p-8">
                    {success && (
                        <Alert variant="success" className="mb-6">
                            Profile updated successfully!
                        </Alert>
                    )}

                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="border-b border-border pb-6">
                            <h3 className="text-lg font-medium text-foreground mb-4">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Full Name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={errors.name}
                                    required
                                />
                                <Input
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={errors.email}
                                    required
                                />
                                <Input
                                    label="Store Name"
                                    name="storeName"
                                    type="text"
                                    value={formData.storeName}
                                    onChange={handleChange}
                                    error={errors.storeName}
                                    required
                                />
                            </div>
                        </div>

                        {/* Business Information */}
                        <div className="border-b border-border pb-6">
                            <h3 className="text-lg font-medium text-foreground mb-4">Business Information</h3>
                            <Input
                                label="GSTN (Optional)"
                                name="gstn"
                                type="text"
                                value={formData.gstn}
                                onChange={handleChange}
                                error={errors.gstn}
                                placeholder="22AAAAA0000A1Z5"
                            />
                        </div>

                        {/* Address Information */}
                        <div>
                            <h3 className="text-lg font-medium text-foreground mb-4">Address</h3>
                            <div className="space-y-4">
                                <Input
                                    label="Street Address"
                                    name="address.street"
                                    type="text"
                                    value={formData.address.street}
                                    onChange={handleChange}
                                    error={errors['address.street']}
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="City"
                                        name="address.city"
                                        type="text"
                                        value={formData.address.city}
                                        onChange={handleChange}
                                        error={errors['address.city']}
                                        required
                                    />
                                    <Input
                                        label="State"
                                        name="address.state"
                                        type="text"
                                        value={formData.address.state}
                                        onChange={handleChange}
                                        error={errors['address.state']}
                                        required
                                    />
                                    <Input
                                        label="PIN Code"
                                        name="address.pincode"
                                        type="text"
                                        value={formData.address.pincode}
                                        onChange={handleChange}
                                        error={errors['address.pincode']}
                                        placeholder="6-digit PIN code"
                                        maxLength="6"
                                        required
                                    />
                                    <Input
                                        label="Country"
                                        name="address.country"
                                        type="text"
                                        value={formData.address.country}
                                        onChange={handleChange}
                                        error={errors['address.country']}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={updateLoading}
                                className="w-full md:w-auto"
                            >
                                {updateLoading ? 'Updating...' : 'Update Profile'}
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* Additional Information Card */}
                {seller && (
                    <Card className="p-6 mt-6">
                        <h3 className="text-lg font-medium text-foreground mb-4">Account Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">Account ID:</span>
                                <span className="ml-2 font-mono text-foreground">{seller._id}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Member Since:</span>
                                <span className="ml-2 text-foreground">
                                    {seller.createdAt ? new Date(seller.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-md">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                <strong>Note:</strong> Some information like GSTN and registered documents cannot be changed here. 
                                Contact support if you need to update critical business information.
                            </p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};