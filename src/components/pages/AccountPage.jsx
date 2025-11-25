// src/components/pages/AccountPage.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, updateUser } from '../../store/slices/authSlice';
import { apiUpdateAccountDetails } from '../../services/api';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

const AccountPage = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Update form when user data loads
    React.useEffect(() => {
        if (user) {
            setFormData({
                firstname: user.firstname || '',
                lastname: user.lastname || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">Profile Details</h2>
            
            <Alert type="success" message={message} className="mb-4" />
            <Alert type="error" message={error} className="mb-4" />
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
                
                <Button type="submit" variant="primary">
                    Save Changes
                </Button>
            </form>
        </div>
    );
};

export default AccountPage;