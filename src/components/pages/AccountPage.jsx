// src/components/pages/AccountPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, updateUser } from '../../store/slices/authSlice';
import { apiUpdateAccountDetails } from '../../services/api';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { useFormState } from '../../hooks';

const AccountPage = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const [loading, setLoading] = useState(true);
    
    const { formData, setFormData, handleChange } = useFormState({
        firstname: '',
        lastname: '',
        email: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Update form when user data loads
    useEffect(() => {
        if (user) {
            setFormData({
                firstname: user.firstname || '',
                lastname: user.lastname || '',
                email: user.email || '',
            });
            setLoading(false);
        }
    }, [user, setFormData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const data = await apiUpdateAccountDetails(formData);
            if (data.success) {
                dispatch(updateUser(data.user));
                setMessage('Profile updated successfully!');
            }
        } catch (err) {
            setError(err.message || 'Failed to update profile.');
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white bg-clip-text text-transparent">Profile Details</h2>
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50">
                    <div className="space-y-6 animate-pulse">
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white bg-clip-text text-transparent">Profile Details</h2>
            
            {message && <Alert type="success" message={message} className="mb-4" />}
            {error && <Alert type="error" message={error} className="mb-4" />}
            
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="First Name"
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                    />
                    
                    <Input
                        label="Last Name"
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                    />
                    
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    
                    <Button type="submit" variant="primary" fullWidth>
                        Save Changes
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AccountPage;