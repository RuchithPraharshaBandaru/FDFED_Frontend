// src/components/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate, Link, useSearchParams } from 'react-router-dom';
import { loginUser, selectIsAuthenticated, selectAuthLoading, selectAuthError } from '../../store/slices/authSlice';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [searchParams] = useSearchParams();
    const isSeller = searchParams.get('seller') === 'true';
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    // If user is already logged in, redirect them to homepage
    if (isAuthenticated) {
        if (isSeller) {
            return <Navigate to="/sell" replace />;
        }
        return <Navigate to="/" replace />; 
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const credentials = { email, password };
        if (isSeller) {
            credentials.role = 'seller';
        }

        const result = await dispatch(loginUser(credentials));
        if (result.type === 'auth/login/fulfilled') {
            if (isSeller) {
                navigate('/sell');
            } else {
                navigate('/');
            }
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30 dark:from-gray-950 dark:via-green-900/30 dark:to-emerald-900/25 flex items-center justify-center py-12 px-6 overflow-hidden">
            {/* Futuristic background elements */}
            <div className="absolute inset-0 bg-dot-pattern opacity-[0.03] dark:opacity-[0.08] pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-green-400/15 to-emerald-500/15 dark:from-green-500/25 dark:to-emerald-600/25 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-emerald-400/10 to-green-500/10 dark:from-emerald-600/20 dark:to-green-700/20 blur-3xl rounded-full" />
            
            {/* Main Card */}
            <div className="relative max-w-md w-full">
                {/* Glassmorphism container */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/90 dark:to-gray-900/80 backdrop-blur-xl rounded-2xl" />
                <div className="relative bg-white/60 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-green-500/30 shadow-2xl shadow-green-500/10 dark:shadow-green-500/20 p-8">
                    {/* Header with icon */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-4 shadow-lg shadow-green-500/30">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-600 dark:text-gray-400">Sign in to continue your sustainable journey</p>
                    </div>
                
                <Alert type="error" message={error} className="mb-4" />
                
                <form onSubmit={handleSubmit} className="space-y-5">
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
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/30"
                    >
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </Button>
                </form>

                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors">
                        Sign up
                    </Link>
                </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;