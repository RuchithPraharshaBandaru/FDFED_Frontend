// src/components/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = useAuth();
    const navigate = useNavigate();

    // If user is already logged in, redirect them to homepage
    if (auth.isAuthenticated) {
        // FIX: Redirect to homepage
        return <Navigate to="/" replace />; 
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            await auth.login(email, password);
            // On successful login, navigate to homepage
            // FIX: Redirect to homepage
            navigate('/');
        } catch (err) {
            setError('Failed to log in. Please check your email and password.');
            console.error(err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50 py-12 px-6">
            <div className="bg-white max-w-md w-full p-8 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
                
                {error && (
                    <p className="text-red-600 text-center mb-4">{error}</p>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label 
                            htmlFor="email" 
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label 
                            htmlFor="password" 
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-green-600 text-white py-3 rounded-md text-sm font-semibold hover:bg-green-700 transition"
                    >
                        Log In
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600 mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;