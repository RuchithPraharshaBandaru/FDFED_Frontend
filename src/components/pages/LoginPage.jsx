// src/components/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { loginUser, selectIsAuthenticated, selectAuthLoading, selectAuthError } from '../../store/slices/authSlice';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    // If user is already logged in, redirect them to homepage
    if (isAuthenticated) {
        return <Navigate to="/" replace />; 
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const result = await dispatch(loginUser({ email, password }));
        if (result.type === 'auth/login/fulfilled') {
            navigate('/');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50 dark:bg-gray-900 py-12 px-6">
            <div className="bg-white dark:bg-gray-800 max-w-md w-full p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Login</h2>
                
                <Alert type="error" message={error} className="mb-4" />
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                    <Input
                        label="Password"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    
                    <Button 
                        type="submit" 
                        variant="primary"
                        size="lg"
                        fullWidth
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </Button>
                </form>

                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-green-500 hover:text-green-600">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;