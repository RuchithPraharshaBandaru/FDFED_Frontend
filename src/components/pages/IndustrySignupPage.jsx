import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { industrySignupThunk, selectIndustryIsAuthenticated } from '../../store/slices/industrySlice';

const IndustrySignupPage = () => {
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [justSignedUp, setJustSignedUp] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector(state => state.industry?.isLoading);
    const isAuthenticated = useSelector(selectIndustryIsAuthenticated);

    React.useEffect(() => {
        if (isAuthenticated && justSignedUp) {
            navigate('/industry');
        }
    }, [isAuthenticated, justSignedUp, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const result = await dispatch(industrySignupThunk({ companyName, email, password }));
            if (result.meta?.requestStatus === 'fulfilled') {
                setJustSignedUp(true);
            } else if (result.meta?.requestStatus === 'rejected') {
                setError(result.payload || 'Signup failed');
            }
        } catch (err) {
            console.error('Industry signup error:', err);
            setError(err.message || 'Signup failed');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Industry Signup</h2>
            {error && <div className="text-destructive mb-3">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-3">
                <Input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Company name" />
                <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</Button>
            </form>
        </div>
    );
};

export default IndustrySignupPage;
