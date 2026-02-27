// src/components/pages/rider/RiderProfilePage.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { selectRider } from '../../../store/slices/riderSlice';
import { User, Phone, Mail, MapPin, Bike, ShieldCheck } from 'lucide-react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';

const RiderProfilePage = () => {
    const rider = useSelector(selectRider);

    if (!rider) return null;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>

            <Card padding="none" className="overflow-hidden">
                <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {rider.name?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{rider.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Rider ID: {rider._id}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <Badge variant={
                                    rider.verificationStatus === 'Verified' ? 'default' :
                                        rider.verificationStatus === 'Suspended' ? 'destructive' : 'secondary'
                                } className="gap-1">
                                    <ShieldCheck className="w-3 h-3" />
                                    {rider.verificationStatus}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6 divide-y divide-gray-200 dark:divide-gray-700">
                    <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                                <p className="text-base text-gray-900 dark:text-white">{rider.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                                <p className="text-base text-gray-900 dark:text-white">{rider.phone || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="py-4">
                        <div className="flex items-start gap-3">
                            <Bike className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Vehicle Details</p>
                                {rider.vehicle ? (
                                    <p className="text-base text-gray-900 dark:text-white">
                                        {rider.vehicle.type} - {rider.vehicle.number}
                                    </p>
                                ) : (
                                    <p className="text-base text-gray-500 italic">No vehicle details provided</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="py-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                                {rider.address ? (
                                    <p className="text-base text-gray-900 dark:text-white">
                                        {rider.address.street}, {rider.address.city}, {rider.address.pincode}
                                    </p>
                                ) : (
                                    <p className="text-base text-gray-500 italic">No address provided</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default RiderProfilePage;
