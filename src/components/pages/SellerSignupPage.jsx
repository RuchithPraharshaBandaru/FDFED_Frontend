// src/components/pages/SellerSignupPage.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signupSeller, clearError, clearSeller } from '../../store/slices/sellerSlice';
import { useToast } from '../../context/ToastContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Card } from '../ui/Card';

export const SellerSignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        gstn: '',
        phoneNumber: '',
        storeName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
    });

    const [files, setFiles] = useState({
        profileImage: null,
        aadhaarImage: null,
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated, seller } = useSelector((state) => state.seller);
    const { showSuccess, showError } = useToast();

    useEffect(() => {
        if (isAuthenticated && seller) {
            navigate('/seller/dashboard');
        } else if (isAuthenticated && !seller) {
            dispatch(clearSeller());
        }
    }, [isAuthenticated, seller, navigate, dispatch]);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    useEffect(() => {
        // Show error toast when signup fails
        if (error) {
            showError(error);
        }
    }, [error, showError]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setFiles({
            ...files,
            [e.target.name]: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!formData.name || !formData.email || !formData.password || !formData.gstn || 
            !formData.phoneNumber || !formData.storeName || !files.profileImage || !files.aadhaarImage) {
            const errorMsg = 'Please fill in all required fields and upload both images';
            showError(errorMsg);
            return;
        }

        // Create FormData
        const submitData = new FormData();
        
        // Add text fields
        Object.keys(formData).forEach(key => {
            if (formData[key]) {
                submitData.append(key, formData[key]);
            }
        });

        // Add files
        submitData.append('profileImage', files.profileImage);
        submitData.append('aadhaarImage', files.aadhaarImage);

        const result = await dispatch(signupSeller(submitData));
        if (signupSeller.fulfilled.match(result)) {
            showSuccess('Registration successful! Welcome to the seller portal.');
        }
    };

    return (
        <div className="min-h-screen bg-background py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                    Register as Seller
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link
                        to="/seller/login"
                        className="font-medium text-primary hover:text-primary/80"
                    >
                        Sign in here
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
                <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Required Fields */}
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Required Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Full Name *"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Email *"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Password *"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Store Name *"
                                    name="storeName"
                                    type="text"
                                    required
                                    value={formData.storeName}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="GSTN *"
                                    name="gstn"
                                    type="text"
                                    required
                                    value={formData.gstn}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Phone Number *"
                                    name="phoneNumber"
                                    type="tel"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Required Documents */}
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Required Documents</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Profile Image *
                                    </label>
                                    <input
                                        type="file"
                                        name="profileImage"
                                        accept="image/*"
                                        required
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Aadhaar Card Image *
                                    </label>
                                    <input
                                        type="file"
                                        name="aadhaarImage"
                                        accept="image/*"
                                        required
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bank Details (Optional) */}
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Details (Optional)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input
                                    label="Account Number"
                                    name="accountNumber"
                                    type="text"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="IFSC Code"
                                    name="ifscCode"
                                    type="text"
                                    value={formData.ifscCode}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Bank Name"
                                    name="bankName"
                                    type="text"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Address (Optional) */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Address (Optional)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Street"
                                    name="street"
                                    type="text"
                                    value={formData.street}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="City"
                                    name="city"
                                    type="text"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="State"
                                    name="state"
                                    type="text"
                                    value={formData.state}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="PIN Code"
                                    name="pincode"
                                    type="text"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Country"
                                    name="country"
                                    type="text"
                                    value={formData.country}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Creating Account...' : 'Create Seller Account'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};