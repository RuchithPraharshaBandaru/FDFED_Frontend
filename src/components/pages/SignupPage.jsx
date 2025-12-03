// src/components/pages/SignupPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate, Link, useSearchParams } from 'react-router-dom';
import { signupUser, selectIsAuthenticated, selectAuthLoading, selectAuthError } from '../../store/slices/authSlice';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

function SignupPage() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [searchParams] = useSearchParams();
    const isSeller = searchParams.get('seller') === 'true';
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    // If user is already logged in, redirect them
    if (isAuthenticated) {
        if (isSeller) {
            return <Navigate to="/sell" replace />;
        }
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const userData = { firstname, lastname, email, password };
        if (isSeller) {
            userData.role = 'seller';
        }
        
        const result = await dispatch(signupUser(userData));
        if (result.type === 'auth/signup/fulfilled') {
            navigate('/');
        }
    };

    return (
        <div className="relative min-h-screen bg-linear-to-br from-slate-50 via-emerald-50/20 to-green-50/30 dark:from-gray-950 dark:via-emerald-900/30 dark:to-green-900/25 flex items-center justify-center py-12 px-6 overflow-hidden">
            {/* Futuristic background elements */}
            <div className="absolute inset-0 bg-dot-pattern opacity-[0.03] dark:opacity-[0.08] pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-linear-to-br from-emerald-400/15 to-green-500/15 dark:from-emerald-500/25 dark:to-green-600/25 blur-3xl rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-linear-to-tr from-green-400/10 to-emerald-500/10 dark:from-green-600/20 dark:to-emerald-700/20 blur-3xl rounded-full" />
            
            {/* Main Card */}
            <div className="relative max-w-md w-full">
                {/* Glassmorphism container */}
                <div className="absolute inset-0 bg-linear-to-br from-white/80 to-white/40 dark:from-gray-800/90 dark:to-gray-900/80 backdrop-blur-xl rounded-2xl" />
                <div className="relative bg-white/60 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-emerald-500/30 shadow-2xl shadow-emerald-500/10 dark:shadow-emerald-500/20 p-8">
                    {/* Header with icon */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-500 to-green-600 mb-4 shadow-lg shadow-emerald-500/30">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Create Account</h2>
                        <p className="text-gray-600 dark:text-gray-400">Join our sustainable fashion community</p>
                    </div>
                
                {error && <Alert type="error">{error}</Alert>}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            type="text"
                            id="firstname"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                        />
                        <Input
                            label="Last Name"
                            type="text"
                            id="lastname"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            required
                        />
                    </div>

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
                        className="w-full bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/30"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing up...' : 'Sign Up'}
                    </Button>
                </form>
                
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                        Log in
                    </Link>
                </p>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;