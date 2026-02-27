// src/components/pages/rider/RiderEarningsPage.jsx
import React, { useEffect, useState } from 'react';
import riderApi from '../../../services/riderApi';
import { IndianRupee, TrendingUp } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Badge from '../../ui/Badge';
import Alert from '../../ui/Alert';

const RiderEarningsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requestAmount, setRequestAmount] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await riderApi.getRiderEarnings();
            setData(res);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch earnings data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePayout = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await riderApi.requestPayout(Number(requestAmount));
            setRequestAmount('');
            fetchData(); // Refresh
            alert('Payout requested successfully');
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Earnings & Payouts</h1>

            {error && <Alert type="error" message={error} />}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                            <IndianRupee className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Wallet Balance</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        ₹{data?.walletBalance || 0}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Available for withdrawal
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Earnings</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        ₹{data?.totalEarnings || 0}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Lifetime earnings
                    </div>
                </Card>

                <Card>
                    <form onSubmit={handlePayout} className="h-full flex flex-col justify-between space-y-4">
                        <div>
                            <Input
                                label="Request Payout (₹)"
                                type="number"
                                min="1"
                                max={data?.walletBalance}
                                required
                                value={requestAmount}
                                onChange={(e) => setRequestAmount(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="rider"
                            fullWidth
                            disabled={submitting || !data?.walletBalance || data.walletBalance <= 0}
                        >
                            {submitting ? 'Processing...' : 'Withdraw Funds'}
                        </Button>
                    </form>
                </Card>
            </div>

            {/* Payout History */}
            <Card padding="none" className="overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payout History</h3>
                </div>
                {!data?.payoutRequests?.length ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        No payout requests found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {data.payoutRequests.map((payout, idx) => (
                                    <tr key={idx}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(payout.requestedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            ₹{payout.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={
                                                payout.status === 'Approved' ? 'default' :
                                                    payout.status === 'Rejected' ? 'destructive' : 'secondary'
                                            }>
                                                {payout.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default RiderEarningsPage;
