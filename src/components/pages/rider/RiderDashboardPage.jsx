// src/components/pages/rider/RiderDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import riderApi from '../../../services/riderApi';
import { selectRider, selectRiderStatus } from '../../../store/slices/riderSlice';
import { MapPin, Navigation, Package, DollarSign, Clock } from 'lucide-react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import Alert from '../../ui/Alert';

const RiderDashboardPage = () => {
    const dispatch = useDispatch();
    const rider = useSelector(selectRider);
    const isActive = useSelector(selectRiderStatus);
    const [pickups, setPickups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPickups = async () => {
        try {
            setLoading(true);
            const data = await riderApi.getAvailablePickups();
            setPickups(data.pickups || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch pickups');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isActive) {
            fetchPickups();
        } else {
            setPickups([]); // Clear pickups if offline
        }
    }, [isActive]);

    const handleClaim = async (pickupId) => {
        try {
            await riderApi.claimPickup(pickupId);
            // Refresh list
            fetchPickups();
            // TODO: Show toast success
        } catch (err) {
            // TODO: Show toast error
            alert(err.message);
        }
    };

    if (!isActive) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                    <Clock className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    You are currently Offline
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Go online to start receiving delivery requests and earning money. Use the toggle in the sidebar or header.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Available Pickups</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {pickups.length} jobs available in your area
                    </p>
                </div>
                <Button
                    onClick={fetchPickups}
                    variant="rider"
                    size="sm"
                >
                    Refresh
                </Button>
            </header>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <Alert type="error" message={error} />
            ) : pickups.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <Package className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No pickups available right now.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {pickups.map((pickup) => (
                        <Card key={pickup._id} className="hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                                    {pickup.pickupId}
                                </Badge>
                                <div className="flex items-center text-green-600 dark:text-green-400 font-bold">
                                    <DollarSign className="w-4 h-4 mr-1" />
                                    {pickup.deliveryFee}
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {pickup.address.street}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {pickup.address.city}, {pickup.address.pincode}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Package className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {pickup.items.length} Items • <span className="text-xs text-gray-400">Ready for pickup</span>
                                    </p>
                                </div>
                            </div>

                            <Button
                                onClick={() => handleClaim(pickup._id)}
                                variant="rider"
                                fullWidth
                                className="flex items-center gap-2"
                            >
                                <Navigation className="w-4 h-4" />
                                Accept Pickup
                            </Button>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RiderDashboardPage;
