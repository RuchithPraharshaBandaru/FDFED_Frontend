import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellersThunk, approveSellerThunk, deleteSellerThunk, selectAdminSellers } from '../../../store/slices/adminSlice';
import Button from '../../ui/Button';
import Select from '../../ui/Select';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import { Check, Trash2, ArrowUp, ArrowDown, ArrowUpDown, Search, Store, Mail, MapPin, Package, Calendar, Eye, ShieldCheck, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SellersPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(selectAdminSellers);

  // table state
  const [viewSeller, setViewSeller] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [cityFilter, setCityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState(null); // 'store'|'email'|'city'|'created'|'status'|'products'
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => { dispatch(fetchSellersThunk({})); }, [dispatch]);

  const approve = async (id) => {
    const res = await dispatch(approveSellerThunk(id));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Seller approved');
    else toast.error(res.payload || 'Approval failed');
  };

  const onDeleteConfirm = async (id) => {
    const res = await dispatch(deleteSellerThunk(id));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Seller deleted');
    else toast.error(res.payload || 'Delete failed');
    setConfirmDelete(null);
  };

  // options
  const cities = useMemo(() => {
    const set = new Set();
    (items || []).forEach(s => { const c = s?.address?.city; if (c) set.add(c); });
    return ['all', ...Array.from(set).sort()];
  }, [items]);

  const statuses = useMemo(() => {
    const set = new Set();
    (items || []).forEach(s => { const st = s?.identityVerification?.status; if (st) set.add(st); });
    return ['all', ...Array.from(set).sort()];
  }, [items]);

  // derive data
  const filtered = useMemo(() => {
    const list = (items || []).filter(s => {
      const cityOk = cityFilter === 'all' || (s?.address?.city === cityFilter);
      if (!cityOk) return false;
      const st = s?.identityVerification?.status || '';
      const statusOk = statusFilter === 'all' || st === statusFilter;
      if (!statusOk) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      const store = (s.storeName || '').toLowerCase();
      const name = (s.name || '').toLowerCase();
      const email = (s.email || '').toLowerCase();
      return store.includes(q) || name.includes(q) || email.includes(q);
    });
    return list;
  }, [items, cityFilter, statusFilter, search]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const val = (s) => {
      switch (sortKey) {
        case 'store': return (s.storeName || '').toLowerCase();
        case 'email': return (s.email || '').toLowerCase();
        case 'city': return (s?.address?.city || '').toLowerCase();
        case 'status': return (s?.identityVerification?.status || '').toLowerCase();
        case 'products': return (s.products || []).length;
        case 'created': return new Date(s.createdAt || 0).getTime();
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

  useEffect(() => { setPage(1); }, [cityFilter, statusFilter, search, pageSize]);

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sellers</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage seller accounts and verifications</p>
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
                placeholder="Search store, name or email..." 
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              options={cities.map(c => ({ value: c, label: c === 'all' ? 'All Cities' : c }))}
              className="w-full sm:w-48"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statuses.map(s => ({ value: s, label: s === 'all' ? 'All Status' : s }))}
              className="w-full sm:w-40"
            />
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
            <p className="mt-2 text-gray-500">Loading sellers...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => toggleSort('store')}>
                    <div className="flex items-center gap-1">Store <SortIcon col="store" /></div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => toggleSort('email')}>
                    <div className="flex items-center gap-1">Email <SortIcon col="email" /></div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => toggleSort('city')}>
                    <div className="flex items-center gap-1">City <SortIcon col="city" /></div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => toggleSort('status')}>
                    <div className="flex items-center gap-1">Status <SortIcon col="status" /></div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => toggleSort('products')}>
                    <div className="flex items-center gap-1">Products <SortIcon col="products" /></div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => toggleSort('created')}>
                    <div className="flex items-center gap-1">Created <SortIcon col="created" /></div>
                  </th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {displayItems.map(s => (
                  <tr key={s._id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.storeName || s.name || 'Seller')}&background=random`}
                          alt={s.storeName}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-900 shadow-sm"
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{s.storeName}</div>
                          <div className="text-xs text-gray-500">{s.name || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{s.email}</td>
                    <td className="py-3 px-4">
                      {s.address?.city ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          <MapPin size={12} /> {s.address.city}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border ${ 
                        (s?.identityVerification?.status || '').toLowerCase() === 'verified' 
                          ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900' 
                          : 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900' 
                      }`}>
                        {(s?.identityVerification?.status || '').toLowerCase() === 'verified' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                        {s?.identityVerification?.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{(s.products || []).length}</td>
                    <td className="py-3 px-4 text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" onClick={() => setViewSeller(s)} title="View Details">
                          <Eye size={16} className="text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => approve(s._id)} title="Approve">
                          <Check size={16} className="text-green-600" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(s)} title="Delete">
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
                  <Store size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No sellers found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search or filters</p>
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

      {/* View Seller Modal */}
      <Modal
        isOpen={!!viewSeller}
        onClose={() => setViewSeller(null)}
        title="Seller Details"
      >
        {viewSeller && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <img
                src={viewSeller.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(viewSeller.storeName || viewSeller.name || 'Seller')}&background=random`}
                alt={viewSeller.storeName}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-white dark:ring-gray-900"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{viewSeller.storeName}</h3>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
                  <Mail size={14} />
                  <span>{viewSeller.email}</span>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin size={18} className="text-blue-500" /> Address Information
                </h4>
                <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                  {viewSeller.address ? (
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <p>{viewSeller.address.street}</p>
                      <p>{viewSeller.address.city}, {viewSeller.address.state}</p>
                      <p>{viewSeller.address.pincode}</p>
                      <p>{viewSeller.address.country}</p>
                    </div>
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
                      <span>Joined:</span>
                      <span className="font-medium">{new Date(viewSeller.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`font-medium ${
                        (viewSeller.identityVerification?.status || '').toLowerCase() === 'verified' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {viewSeller.identityVerification?.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center">
              <Package className="mx-auto text-blue-600 mb-2" size={24} />
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{(viewSeller.products || []).length}</div>
              <div className="text-xs font-medium text-blue-600/80 dark:text-blue-400">Total Products</div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete Seller"
        className="max-w-sm"
      >
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto text-red-600">
            <Trash2 size={24} />
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{confirmDelete?.storeName}</span>?
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

export default SellersPage;
