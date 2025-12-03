import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellersThunk, approveSellerThunk, deleteSellerThunk, selectAdminSellers } from '../../../store/slices/adminSlice';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { Check, Trash2, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SellersPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(selectAdminSellers);

  // table state
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

  const onDelete = async (id) => {
    const res = await dispatch(deleteSellerThunk(id));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Seller deleted');
    else toast.error(res.payload || 'Delete failed');
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
    if (sortKey !== col) return <ArrowUpDown className="inline h-3.5 w-3.5" />;
    return sortDir === 'asc' ? <ArrowUp className="inline h-3.5 w-3.5" /> : <ArrowDown className="inline h-3.5 w-3.5" />;
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Sellers</h1>
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
          <Select
            label="Status"
            name="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statuses.map(s => ({ value: s, label: s === 'all' ? 'All' : s }))}
            className="sm:w-52"
          />
          <Input
            label="Search"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search store, name or email"
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
                  <button className="inline-flex items-center gap-1" onClick={() => toggleSort('store')}>
                    Store <SortIcon col="store" />
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
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide">
                  <button className="inline-flex items-center gap-1" onClick={() => toggleSort('status')}>
                    Status <SortIcon col="status" />
                  </button>
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide">
                  <button className="inline-flex items-center gap-1" onClick={() => toggleSort('products')}>
                    Products <SortIcon col="products" />
                  </button>
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide">
                  <button className="inline-flex items-center gap-1" onClick={() => toggleSort('created')}>
                    Created <SortIcon col="created" />
                  </button>
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map(s => (
                <tr key={s._id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={s.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.storeName || s.name || 'Seller')}&background=E5E7EB&color=111827&size=96`}
                        alt={s.storeName}
                        className="h-10 w-10 rounded-full object-cover border"
                      />
                      <div>
                        <div className="font-medium">{s.storeName}</div>
                        <div className="text-xs text-gray-500">{s.name || '-'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-3">{s.email}</td>
                  <td className="py-2 px-3">{s.address?.city || '-'}</td>
                  <td className="py-2 px-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${ (s?.identityVerification?.status || '').toLowerCase() === 'verified' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200' }`}>
                      {s?.identityVerification?.status || 'Pending'}
                    </span>
                  </td>
                  <td className="py-2 px-3">{(s.products || []).length}</td>
                  <td className="py-2 px-3">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 px-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="secondary" size="sm" onClick={() => approve(s._id)}><Check size={16} /></Button>
                      <Button variant="destructive" size="sm" onClick={() => onDelete(s._id)}><Trash2 size={16} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {total === 0 && (
            <div className="p-6 text-sm text-center text-muted-foreground">No sellers found.</div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500">Showing {start + 1}-{Math.min(end, total)} of {total}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</Button>
            <div className="text-xs">Page {currentPage} / {totalPages}</div>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellersPage;
