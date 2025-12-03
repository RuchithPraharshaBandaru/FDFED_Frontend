// src/components/pages/SellerLoginPage.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSeller, clearError } from '../../store/slices/sellerSlice';
import { useToast } from '../../context/ToastContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Card } from '../ui/Card';

export const SellerLoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.seller);
    const { showSuccess, showError } = useToast();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/seller/dashboard');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        // Clear any previous errors when component mounts
        dispatch(clearError());
    }, [dispatch]);

    useEffect(() => {
        // Show error toast when login fails
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.email && formData.password) {
            const result = await dispatch(loginSeller(formData));
            if (loginSeller.fulfilled.match(result)) {
                showSuccess('Login successful!');
            }
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                    Seller Login
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    Or{' '}
                    <Link
                        to="/seller/signup"
                        className="font-medium text-primary hover:text-primary/80"
                    >
                        register as a new seller
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email"
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />

                        <Input
                            label="Password"
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-card text-muted-foreground">
                                    Not a seller yet?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                to="/seller/signup"
                                className="w-full flex justify-center py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-primary bg-accent hover:bg-accent/80"
                            >
                                Register as Seller
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};