// src/components/pages/rider/RiderHistoryPage.jsx
import React, { useEffect, useState } from 'react';
import riderApi from '../../../services/riderApi';
import { Package, MapPin, CheckCircle, Clock, Truck } from 'lucide-react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import Alert from '../../ui/Alert';

const RiderHistoryPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await riderApi.getMyPickups();
            setTasks(data.pickups || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleStatusUpdate = async (pickupId, newStatus) => {
        try {
            await riderApi.updatePickupStatus(pickupId, newStatus);
            fetchTasks(); // Refresh
        } catch (err) {
            alert(err.message);
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Completed': return 'default'; // Green
            case 'PickedUp': return 'secondary'; // Gray/Yellowish? Or just use secondary
            default: return 'rider'; // Blue
        }
    };

    // Helper for specific colors if variants aren't enough, but let's try variants first.
    // Actually, 'PickedUp' usually implies "In Progress". 'secondary' is gray.
    // 'default' is green. 'rider' is blue.
    // Let's stick to: Completed -> default (Green), PickedUp -> rider (Blue/Active), Assigned -> secondary (Gray/Pending)

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle className="w-4 h-4" />;
            case 'PickedUp': return <Truck className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h1>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <Alert type="error" message={error} />
            ) : tasks.length === 0 ? (
                <Card className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No tasks history yet.</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <Card key={task._id} padding="sm" className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {task.pickupId}
                                        </span>
                                        <Badge variant={task.status === 'Completed' ? 'default' : task.status === 'PickedUp' ? 'rider' : 'secondary'} className="gap-1.5">
                                            {getStatusIcon(task.status)}
                                            {task.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <MapPin className="w-4 h-4 mr-1.5" />
                                        {task.address.street}, {task.address.city}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            ₹{task.deliveryFee}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(task.createdAt || Date.now()).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {task.status === 'Assigned' && (
                                        <Button
                                            onClick={() => handleStatusUpdate(task._id, 'PickedUp')}
                                            variant="rider"
                                            size="sm"
                                        >
                                            Mark Picked Up
                                        </Button>
                                    )}

                                    {task.status === 'PickedUp' && (
                                        <Button
                                            onClick={() => handleStatusUpdate(task._id, 'Completed')}
                                            variant="default" // Green for completion
                                            size="sm"
                                        >
                                            Mark Delivered
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RiderHistoryPage;
