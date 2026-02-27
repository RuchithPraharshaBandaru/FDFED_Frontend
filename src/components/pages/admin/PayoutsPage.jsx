// src/components/pages/admin/PayoutsPage.jsx
import React, { useEffect, useState } from 'react';
import adminApi from '../../../services/adminApi';
import { IndianRupee, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import AlertDialog from '../../ui/AlertDialog';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import toast from 'react-hot-toast';

const PayoutsPage = () => {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('Pending');

    // Dialog States
    const [approveDialog, setApproveDialog] = useState({ isOpen: false, payoutId: null });
    const [rejectDialog, setRejectDialog] = useState({ isOpen: false, payoutId: null });
    const [rejectNote, setRejectNote] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchPayouts = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getAdminPayouts(filterStatus);
            setPayouts(data.payouts || []);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch payouts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayouts();
    }, [filterStatus]);

    // Approve Logic
    const handleApproveClick = (payoutId) => {
        setApproveDialog({ isOpen: true, payoutId });
    };

    const confirmApprove = async () => {
        try {
            setActionLoading(true);
            await adminApi.processPayout(approveDialog.payoutId, 'Approved', 'Approved by Admin');
            toast.success('Payout approved successfully');
            fetchPayouts();
            setApproveDialog({ isOpen: false, payoutId: null });
        } catch (err) {
            toast.error(err.message || 'Approval failed');
        } finally {
            setActionLoading(false);
        }
    };

    // Reject Logic
    const handleRejectClick = (payoutId) => {
        setRejectNote('');
        setRejectDialog({ isOpen: true, payoutId });
    };

    const confirmReject = async (e) => {
        e.preventDefault();
        if (!rejectNote.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        try {
            setActionLoading(true);
            await adminApi.processPayout(rejectDialog.payoutId, 'Rejected', rejectNote);
            toast.success('Payout rejected successfully');
            fetchPayouts();
            setRejectDialog({ isOpen: false, payoutId: null });
        } catch (err) {
            toast.error(err.message || 'Rejection failed');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payout Requests</h1>
                <div className="flex items-center gap-2">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <button onClick={fetchPayouts} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                        <Loader2 className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rider</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {payouts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No payouts found.
                                    </td>
                                </tr>
                            ) : (
                                payouts.map((payout) => (
                                    <tr key={payout._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {payout.riderId?.name || 'Unknown Rider'}
                                                </span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {payout.riderId?.phone}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            ₹{payout.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(payout.requestedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payout.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                payout.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}>
                                                {payout.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {payout.status === 'Pending' && (
                                                <>
                                                    <button onClick={() => handleApproveClick(payout._id)} className="text-green-600 hover:text-green-900 dark:hover:text-green-400 mr-4">
                                                        Approve
                                                    </button>
                                                    <button onClick={() => handleRejectClick(payout._id)} className="text-red-600 hover:text-red-900 dark:hover:text-red-400">
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Approve Dialog */}
            <AlertDialog
                isOpen={approveDialog.isOpen}
                onClose={() => setApproveDialog({ isOpen: false, payoutId: null })}
                title="Approve Payout"
                description="Are you sure you want to approve this payout request? Funds will be transferred to the rider."
                actionLabel="Approve Payout"
                onAction={confirmApprove}
                variant="success"
                loading={actionLoading}
            />

            {/* Reject Modal */}
            <Modal
                isOpen={rejectDialog.isOpen}
                onClose={() => setRejectDialog({ isOpen: false, payoutId: null })}
                title="Reject Payout"
            >
                <form onSubmit={confirmReject} className="space-y-4">
                    <p className="text-gray-500 dark:text-gray-400">
                        Please provide a reason for rejecting this payout request.
                    </p>
                    <Input
                        label="Rejection Reason"
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                        placeholder="e.g. Invalid bank details..."
                        required
                        autoFocus
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setRejectDialog({ isOpen: false, payoutId: null })}
                            disabled={actionLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="danger"
                            disabled={actionLoading}
                        >
                            {actionLoading ? 'Rejecting...' : 'Reject Payout'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default PayoutsPage;
