import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, removeCustomer, selectAdminCustomers } from '../../../store/slices/adminSlice';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { Trash2, Eye, User as UserIcon, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CustomersPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(selectAdminCustomers);
  const [viewUser, setViewUser] = useState(null);
  const [confirmUser, setConfirmUser] = useState(null);

  // Table controls
  const [cityFilter, setCityFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState(null); // 'name' | 'email' | 'city' | 'created'
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => { dispatch(fetchCustomers({})); }, [dispatch]);

  const initials = useMemo(() => (u) => {
    const f = (u?.firstname || '').charAt(0).toUpperCase();
    const l = (u?.lastname || '').charAt(0).toUpperCase();
    return (f + l) || 'U';
  }, []);

  const onDeleteConfirm = async (id) => {
    const res = await dispatch(removeCustomer(id));
    if (res.meta.requestStatus === 'fulfilled') toast.success('User deleted');
    else toast.error(res.payload || 'Failed to delete');
    setConfirmUser(null);
  };

  // Build city options
  const cities = useMemo(() => {
    const set = new Set();
    (items || []).forEach(u => { const c = u?.Address?.city; if (c) set.add(c); });
    return ['all', ...Array.from(set).sort()];
  }, [items]);

  // Derived data: filter -> search
  const filtered = useMemo(() => {
    const list = (items || []).filter(u => {
      const cityOk = cityFilter === 'all' || (u?.Address?.city === cityFilter);
      if (!cityOk) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      const name = `${u.firstname || ''} ${u.lastname || ''}`.toLowerCase();
      const email = (u.email || '').toLowerCase();
      return name.includes(q) || email.includes(q);
    });
    return list;
  }, [items, cityFilter, search]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const val = (u) => {
      switch (sortKey) {
        case 'name': return `${u.firstname || ''} ${u.lastname || ''}`.trim().toLowerCase();
        case 'email': return (u.email || '').toLowerCase();
        case 'city': return (u?.Address?.city || '').toLowerCase();
        case 'created': return new Date(u.createdAt || 0).getTime();
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

  // Pagination
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const displayItems = sorted.slice(start, end);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [cityFilter, search, pageSize]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ArrowUpDown className="inline h-3.5 w-3.5" />;
    return sortDir === 'asc' ? <ArrowUp className="inline h-3.5 w-3.5" /> : <ArrowDown className="inline h-3.5 w-3.5" />;
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Customers</h1>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            label="City"
            name="city"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            options={cities.map(c => ({ value: c, label: c === 'all' ? 'All' : c }))}
            className="sm:w-52"
          />
          <Input
            label="Search"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            className="sm:w-64"
          />
        </div>
        <Select
          label="Per page"
          name="perPage"
          value={String(pageSize)}
          onChange={(e) => setPageSize(Number(e.target.value))}
          options={[10, 20, 50].map(n => ({ value: String(n), label: String(n) }))}
          className="sm:w-32"
        />
      </div>

      {loading ? (
        <div className="rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        </div>
      ) : (
        <div className="rounded-2xl border shadow-sm overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900/40 backdrop-blur supports-backdrop-filter:bg-gray-50/80 dark:supports-backdrop-filter:bg-gray-900/40">
              <tr className="text-left text-gray-600 dark:text-gray-300">
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide">
                  <button className="inline-flex items-center gap-1" onClick={() => toggleSort('name')}>
                    Customer <SortIcon col="name" />
                  </button>
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide">
                  <button className="inline-flex items-center gap-1" onClick={() => toggleSort('email')}>
                    Email <SortIcon col="email" />
                  </button>
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide">
                  <button className="inline-flex items-center gap-1" onClick={() => toggleSort('city')}>
                    City <SortIcon col="city" />
                  </button>
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map(u => (
                <tr key={u._id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((u.firstname||'') + ' ' + (u.lastname||''))}&background=E5E7EB&color=111827&size=96`}
                        alt={u.firstname}
                        className="h-9 w-9 rounded-full object-cover border"
                      />
                      <div>
                        <div className="font-medium">{u.firstname} {u.lastname}</div>
                        <div className="text-xs text-gray-500">ID: {u._id.slice(-6)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-3">{u.email}</td>
                  <td className="py-2 px-3">{u.Address?.city || '-'}</td>
                  <td className="py-2 px-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setViewUser(u)}>
                        <Eye size={16} />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => setConfirmUser(u)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {total === 0 && (
            <div className="p-6 text-sm text-center text-muted-foreground">No customers found.</div>
          )}
        </div>
      )}

      {/* Pagination footer */}
      {!loading && total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            Showing {start + 1}-{Math.min(end, total)} of {total}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</Button>
            <div className="text-xs">Page {currentPage} / {totalPages}</div>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
          </div>
        </div>
      )}

      {/* View Dialog */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-xl border bg-background p-5 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <UserIcon className="h-5 w-5 text-gray-600" />
              </div>
              <h2 className="text-lg font-semibold">Customer Details</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500">Name:</span> {viewUser.firstname} {viewUser.lastname}</div>
              <div><span className="text-gray-500">Email:</span> {viewUser.email}</div>
              {viewUser.Address && (
                <div><span className="text-gray-500">Address:</span> {viewUser.Address?.street || ''} {viewUser.Address?.city || ''}</div>
              )}
              <div className="text-gray-500">Created: {new Date(viewUser.createdAt).toLocaleString()}</div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="rounded-lg border p-2 text-center">
                  <div className="text-xs text-gray-500">Products</div>
                  <div className="font-semibold">{(viewUser.products || []).length}</div>
                </div>
                <div className="rounded-lg border p-2 text-center">
                  <div className="text-xs text-gray-500">Sell</div>
                  <div className="font-semibold">{(viewUser.sellProduct || []).length}</div>
                </div>
                <div className="rounded-lg border p-2 text-center">
                  <div className="text-xs text-gray-500">Reviews</div>
                  <div className="font-semibold">{(viewUser.reviews || []).length}</div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setViewUser(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {confirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="alertdialog" aria-modal="true">
          <div className="w-full max-w-md rounded-xl border bg-background p-5 shadow-xl">
            <h2 className="text-lg font-semibold mb-1">Delete customer?</h2>
            <p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmUser(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => onDeleteConfirm(confirmUser._id)}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
