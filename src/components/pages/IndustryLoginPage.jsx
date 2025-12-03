import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { industryLoginThunk, selectIndustryIsAuthenticated } from '../../store/slices/industrySlice';

const IndustryLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [justLoggedIn, setJustLoggedIn] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector(state => state.industry?.isLoading);
    const isAuthenticated = useSelector(selectIndustryIsAuthenticated);

    // Only redirect if user just completed login, not on mount
    React.useEffect(() => {
        if (isAuthenticated && justLoggedIn) {
            navigate('/industry');
        }
    }, [isAuthenticated, justLoggedIn, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const result = await dispatch(industryLoginThunk({ email, password }));
            if (result.meta?.requestStatus === 'fulfilled') {
                setJustLoggedIn(true);
            } else if (result.meta?.requestStatus === 'rejected') {
                setError(result.payload || 'Login failed');
            }
        } catch (err) {
            console.error('Industry login error:', err);
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Industry Login</h2>
            {error && <div className="text-destructive mb-3">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-3">
                <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                <Button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
            </form>
        </div>
    );
};

export default IndustryLoginPage;
