import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIndustriesThunk, deleteIndustryThunk, selectAdminIndustries } from '../../../store/slices/adminSlice';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import { Building2, Trash2, ArrowUp, ArrowDown, ArrowUpDown, Search, Mail, MapPin, Calendar, Eye, ShoppingCart, LayoutDashboard } from 'lucide-react';
import { toast } from 'react-hot-toast';

const IndustriesPage = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector(selectAdminIndustries) || { items: [], loading: false };

    // table state
    const [viewIndustry, setViewIndustry] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortKey, setSortKey] = useState(null); // 'company'|'email'|'created'|'cartItems'|'dashboardItems'
    const [sortDir, setSortDir] = useState('asc');

    useEffect(() => { dispatch(fetchIndustriesThunk({})); }, [dispatch]);

    const onDeleteConfirm = async (id) => {
        const res = await dispatch(deleteIndustryThunk(id));
        if (res.meta.requestStatus === 'fulfilled') toast.success('Industry deleted successfully');
        else toast.error(res.payload || 'Delete failed');
        setConfirmDelete(null);
    };

    // derive data
    const filtered = useMemo(() => {
        const list = (items || []).filter(ind => {
            if (!search) return true;
            const q = search.toLowerCase();
            const company = (ind.companyName || '').toLowerCase();
            const email = (ind.email || '').toLowerCase();
            return company.includes(q) || email.includes(q);
        });
        return list;
    }, [items, search]);

    const sorted = useMemo(() => {
        if (!sortKey) return filtered;
        const val = (ind) => {
            switch (sortKey) {
                case 'company': return (ind.companyName || '').toLowerCase();
                case 'email': return (ind.email || '').toLowerCase();
                case 'cartItems': return (ind.cart || []).length;
                case 'dashboardItems': return (ind.dashboard || []).length;
                case 'created': return new Date(ind.createdAt || 0).getTime();
                default: return '';
            }
        };
        const arr = [...filtered].sort((a, b) => {
            const va = val(a); const vb = val(b);
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
        return arr;
    }, [filtered, sortKey, sortDir]);

    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const displayItems = sorted.slice(start, end);

    useEffect(() => { setPage(1); }, [search, pageSize]);

    const toggleSort = (key) => {
        if (sortKey === key) setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
        else { setSortKey(key); setSortDir('asc'); }
    };

    const SortIcon = ({ col }) => {
        if (sortKey !== col) return <ArrowUpDown className="inline h-3.5 w-3.5 text-gray-400" />;
        return sortDir === 'asc' ? <ArrowUp className="inline h-3.5 w-3.5 text-blue-600" /> : <ArrowDown className="inline h-3.5 w-3.5 text-blue-600" />;
    };

    return (
        <div className="space-y-6 p-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Industries</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage industry accounts and orders</p>
                </div>
            </div>

            <Card className="border-none shadow-lg overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col lg:flex-row gap-4 justify-between items-center">
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search company or email..."
                                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                        <span className="text-sm text-gray-500">Rows per page:</span>
                        <select
                            className="h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                            {[10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-500">Loading industries...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => toggleSort('company')}>
                                        <div className="flex items-center gap-1">Company <SortIcon col="company" /></div>
                                    </th>
                                    <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => toggleSort('email')}>
                                        <div className="flex items-center gap-1">Email <SortIcon col="email" /></div>
                                    </th>
                                    <th className="py-3 px-4">Address</th>
                                    <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => toggleSort('cartItems')}>
                                        <div className="flex items-center gap-1">Cart Items <SortIcon col="cartItems" /></div>
                                    </th>
                                    <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => toggleSort('dashboardItems')}>
                                        <div className="flex items-center gap-1">Dashboard Items <SortIcon col="dashboardItems" /></div>
                                    </th>
                                    <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => toggleSort('created')}>
                                        <div className="flex items-center gap-1">Created <SortIcon col="created" /></div>
                                    </th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {displayItems.map(ind => (
                                    <tr key={ind._id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                    <Building2 size={20} className="text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">{ind.companyName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{ind.email}</td>
                                        <td className="py-3 px-4">
                                            {ind.Address ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                    <MapPin size={12} /> {ind.Address.split(',')[0]}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center font-medium text-gray-900 dark:text-white">{(ind.cart || []).length}</td>
                                        <td className="py-3 px-4 text-center font-medium text-gray-900 dark:text-white">{(ind.dashboard || []).length}</td>
                                        <td className="py-3 px-4 text-gray-500">{new Date(ind.createdAt).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="sm" onClick={() => setViewIndustry(ind)} title="View Details">
                                                    <Eye size={16} className="text-blue-600" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(ind)} title="Delete">
                                                    <Trash2 size={16} className="text-red-600" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {total === 0 && (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Building2 size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No industries found</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {!loading && total > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-medium">{start + 1}</span> to <span className="font-medium">{Math.min(end, total)}</span> of <span className="font-medium">{total}</span> results
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="disabled:opacity-50"
                            >
                                Previous
                            </Button>
                            <div className="text-sm font-medium px-2">Page {currentPage} of {totalPages}</div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="disabled:opacity-50"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* View Industry Modal */}
            <Modal
                isOpen={!!viewIndustry}
                onClose={() => setViewIndustry(null)}
                title="Industry Details"
            >
                {viewIndustry && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Building2 size={32} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{viewIndustry.companyName}</h3>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
                                    <Mail size={14} />
                                    <span>{viewIndustry.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <MapPin size={18} className="text-blue-500" /> Address
                                </h4>
                                <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                                    {viewIndustry.Address ? (
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{viewIndustry.Address}</p>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No address provided</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Calendar size={18} className="text-purple-500" /> Account Info
                                </h4>
                                <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                        <div className="flex justify-between">
                                            <span>Created:</span>
                                            <span className="font-medium">{new Date(viewIndustry.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Updated:</span>
                                            <span className="font-medium">{new Date(viewIndustry.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <ShoppingCart size={18} className="text-green-500" /> Cart Items ({(viewIndustry.cart || []).length})
                            </h4>
                            <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
                                {(viewIndustry.cart || []).length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                                <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
                                                    <th className="py-2 px-3">Fabric</th>
                                                    <th className="py-2 px-3">Size</th>
                                                    <th className="py-2 px-3">Quantity</th>
                                                    <th className="py-2 px-3">Duration (months)</th>
                                                    <th className="py-2 px-3">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                {viewIndustry.cart.map((item, idx) => (
                                                    <tr key={idx} className="text-gray-600 dark:text-gray-300">
                                                        <td className="py-2 px-3 font-medium">{item.fabric}</td>
                                                        <td className="py-2 px-3">{item.size}</td>
                                                        <td className="py-2 px-3">{item.quantity}</td>
                                                        <td className="py-2 px-3">{item.usageDuration}</td>
                                                        <td className="py-2 px-3 font-semibold">₹{item.amount}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic p-4">No items in cart</p>
                                )}
                            </div>
                        </div>

                        {/* Dashboard Items */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <LayoutDashboard size={18} className="text-orange-500" /> Dashboard Items ({(viewIndustry.dashboard || []).length})
                            </h4>
                            <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
                                {(viewIndustry.dashboard || []).length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                                <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
                                                    <th className="py-2 px-3">Fabric</th>
                                                    <th className="py-2 px-3">Size</th>
                                                    <th className="py-2 px-3">Quantity</th>
                                                    <th className="py-2 px-3">Duration (months)</th>
                                                    <th className="py-2 px-3">Amount</th>
                                                    <th className="py-2 px-3">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                {viewIndustry.dashboard.map((item, idx) => (
                                                    <tr key={idx} className="text-gray-600 dark:text-gray-300">
                                                        <td className="py-2 px-3 font-medium">{item.fabric}</td>
                                                        <td className="py-2 px-3">{item.size}</td>
                                                        <td className="py-2 px-3">{item.quantity}</td>
                                                        <td className="py-2 px-3">{item.usageDuration}</td>
                                                        <td className="py-2 px-3 font-semibold">₹{item.amount}</td>
                                                        <td className="py-2 px-3">{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic p-4">No items in dashboard</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Confirm Delete Modal */}
            <Modal
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                title="Delete Industry"
                className="max-w-sm"
            >
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto text-red-600">
                        <Trash2 size={24} />
                    </div>
                    <div>
                        <p className="text-gray-600 dark:text-gray-300">
                            Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{confirmDelete?.companyName}</span>?
                        </p>
                        <p className="text-sm text-red-500 mt-2">This action cannot be undone.</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button variant="secondary" className="flex-1" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                        <Button variant="destructive" className="flex-1" onClick={() => onDeleteConfirm(confirmDelete._id)}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default IndustriesPage;
