// src/components/pages/admin/RidersPage.jsx
import React, { useEffect, useState } from 'react';
import adminApi from '../../../services/adminApi';
import { Search, Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import AlertDialog from '../../ui/AlertDialog';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import toast from 'react-hot-toast';

const RidersPage = () => {
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');

    // Dialog States
    const [verifyDialog, setVerifyDialog] = useState({ isOpen: false, riderId: null });
    const [suspendDialog, setSuspendDialog] = useState({ isOpen: false, riderId: null });
    const [suspendReason, setSuspendReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchRiders = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAdminRiders(filterStatus);
            setRiders(data.riders || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch riders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRiders();
    }, [filterStatus]);

    // Verify System
    const handleVerifyClick = (riderId) => {
        setVerifyDialog({ isOpen: true, riderId });
    };

    const confirmVerify = async () => {
        try {
            setActionLoading(true);
            await adminApi.verifyRider(verifyDialog.riderId);
            toast.success('Rider verified successfully');
            fetchRiders();
            setVerifyDialog({ isOpen: false, riderId: null });
        } catch (err) {
            toast.error(err.message || 'Verification failed');
        } finally {
            setActionLoading(false);
        }
    };

    // Suspend System
    const handleSuspendClick = (riderId) => {
        setSuspendReason('');
        setSuspendDialog({ isOpen: true, riderId });
    };

    const confirmSuspend = async (e) => {
        e.preventDefault();
        if (!suspendReason.trim()) {
            toast.error('Please provide a reason for suspension');
            return;
        }

        try {
            setActionLoading(true);
            await adminApi.suspendRider(suspendDialog.riderId, suspendReason);
            toast.success('Rider suspended successfully');
            fetchRiders();
            setSuspendDialog({ isOpen: false, riderId: null });
        } catch (err) {
            toast.error(err.message || 'Suspension failed');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rider Management</h1>
                <div className="flex items-center gap-2">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Verified">Verified</option>
                        <option value="Suspended">Suspended</option>
                    </select>
                    <button onClick={fetchRiders} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                        <Loader2 className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name/Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vehicle</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {riders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No riders found.
                                    </td>
                                </tr>
                            ) : (
                                riders.map((rider) => (
                                    <tr key={rider._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                                    {rider.name?.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{rider.name}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">{rider.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {rider.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {rider.vehicle?.type} - {rider.vehicle?.number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rider.verificationStatus === 'Verified' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                rider.verificationStatus === 'Suspended' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}>
                                                {rider.verificationStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {/* Verify Button */}
                                            {(rider.verificationStatus === 'Pending' || rider.verificationStatus === 'Suspended') && (
                                                <button
                                                    onClick={() => handleVerifyClick(rider._id)}
                                                    className={`text-green-600 hover:text-green-900 dark:hover:text-green-400 mr-4 ${rider.verificationStatus === 'Suspended' ? 'text-blue-600 hover:text-blue-900 dark:hover:text-blue-400' : ''}`}
                                                >
                                                    {rider.verificationStatus === 'Suspended' ? 'Re-activate' : 'Verify'}
                                                </button>
                                            )}

                                            {/* Suspend Button */}
                                            {rider.verificationStatus !== 'Suspended' && (
                                                <button onClick={() => handleSuspendClick(rider._id)} className="text-red-600 hover:text-red-900 dark:hover:text-red-400">
                                                    Suspend
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Verification Alert Dialog */}
            <AlertDialog
                isOpen={verifyDialog.isOpen}
                onClose={() => setVerifyDialog({ isOpen: false, riderId: null })}
                title="Verify Rider"
                description="Are you sure you want to verify this rider? This will allow them to start receiving pickup tasks."
                actionLabel="Verify Rider"
                onAction={confirmVerify}
                variant="success"
                loading={actionLoading}
            />

            {/* Suspension Modal */}
            <Modal
                isOpen={suspendDialog.isOpen}
                onClose={() => setSuspendDialog({ isOpen: false, riderId: null })}
                title="Suspend Rider"
            >
                <form onSubmit={confirmSuspend} className="space-y-4">
                    <p className="text-gray-500 dark:text-gray-400">
                        Please provide a reason for suspending this rider. They will not be able to receive new tasks.
                    </p>
                    <Input
                        label="Suspension Reason"
                        value={suspendReason}
                        onChange={(e) => setSuspendReason(e.target.value)}
                        placeholder="e.g. Violation of terms, repeated complaints..."
                        required
                        autoFocus
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setSuspendDialog({ isOpen: false, riderId: null })}
                            disabled={actionLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="danger"
                            disabled={actionLoading}
                        >
                            {actionLoading ? 'Suspending...' : 'Suspend Rider'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default RidersPage;
