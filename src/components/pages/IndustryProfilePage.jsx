import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import { getIndustryProfile, postIndustryProfileEdit } from '../../services/api';
import { User, Mail, MapPin, Save, X } from 'lucide-react';

const IndustryProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        address: ''
    });

    const load = async () => {
        setLoading(true);
        try {
            const data = await getIndustryProfile();
            setProfile(data);
            setFormData({
                companyName: data?.companyName || data?.industryName || '',
                email: data?.email || '',
                address: data?.address || ''
            });
        } catch (err) {
            setError(err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!formData.companyName || !formData.email) {
            setError('Company name and email are required');
            return;
        }

        setSaving(true);
        setError(null);
        try {
            const res = await postIndustryProfileEdit(formData);
            setProfile(res.industry || res);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setSuccess(null), 3000);
            await load();
        } catch (err) {
            setError(err.message || 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError(null);
        setFormData({
            companyName: profile?.companyName || profile?.industryName || '',
            email: profile?.email || '',
            address: profile?.address || ''
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background py-12">
                <div className="container mx-auto px-4">
                    <div className="animate-pulse space-y-4">
                        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                        <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/10 to-cyan-50/10 dark:from-gray-950 dark:via-blue-950/10 dark:to-cyan-950/10 py-12">
            <div className="container mx-auto px-4 md:px-6 max-w-2xl">
                {/* Header */}
                <div className="mb-8">
                    <Badge className="mb-2 bg-blue-500 hover:bg-blue-600 border-none text-white">Company Profile</Badge>
                    <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
                    <p className="text-muted-foreground">Manage your company information</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
                        {success}
                    </div>
                )}

                {profile && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-border p-8 shadow-sm">
                        {!isEditing ? (
                            <div className="space-y-6">
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Company Name</p>
                                            <p className="text-xl font-bold">{profile.companyName || profile.industryName}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 rounded-lg border border-cyan-200 dark:border-cyan-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Mail className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                                            <span className="text-sm text-muted-foreground">Email</span>
                                        </div>
                                        <p className="text-lg font-medium">{profile.email}</p>
                                    </div>

                                    <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-sm text-muted-foreground">Address</span>
                                        </div>
                                        <p className="text-lg font-medium">{profile.address || 'Not provided'}</p>
                                    </div>
                                </div>

                                <Button onClick={() => setIsEditing(true)} className="w-full" size="lg">
                                    Edit Profile
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium text-foreground">Company Name</label>
                                    <Input
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        placeholder="Your company name"
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-foreground">Email</label>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-foreground">Address</label>
                                    <Input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Company address"
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex-1 bg-gradient-to-r from-green-600 to-green-500"
                                        size="lg"
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                    <Button
                                        onClick={handleCancel}
                                        disabled={saving}
                                        variant="outline"
                                        className="flex-1"
                                        size="lg"
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default IndustryProfilePage;
