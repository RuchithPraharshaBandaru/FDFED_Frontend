import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAdminProducts, fetchProductsAdminThunk, removeProduct, setProductApproved } from '../../../store/slices/adminSlice';
import Button from '../../ui/Button';
import { Check, X, Trash2, Eye, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(selectAdminProducts);
  const [viewProduct, setViewProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all'); // all | verified | pending
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState(null); // 'title' | 'price' | 'category' | 'seller' | 'verified'
  const [sortDir, setSortDir] = useState('asc'); // 'asc' | 'desc'

  useEffect(() => { dispatch(fetchProductsAdminThunk({})); }, [dispatch]);

  // Build category options from items
  const categories = useMemo(() => {
    const set = new Set();
    (items || []).forEach(p => { if (p?.category) set.add(p.category); });
    return ['all', ...Array.from(set).sort()];
  }, [items]);

  // Derived view: filter -> sort -> paginate
  const filtered = useMemo(() => {
    const list = (items || []).filter(p => {
      const catOk = categoryFilter === 'all' || p.category === categoryFilter;
      const ver = !!p.verified;
      const verOk = verifiedFilter === 'all' || (verifiedFilter === 'verified' ? ver : !ver);
      return catOk && verOk;
    });
    return list;
  }, [items, categoryFilter, verifiedFilter]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const getVal = (p) => {
      switch (sortKey) {
        case 'title': return (p.title || '').toString().toLowerCase();
        case 'price': return Number(p.price) || 0;
        case 'category': return (p.category || '').toString().toLowerCase();
        case 'seller': return (p.sellerId?.storeName || p.seller?.storeName || '').toString().toLowerCase();
        case 'verified': return p.verified ? 1 : 0;
        default: return '';
      }
    };
    const arr = [...filtered].sort((a, b) => {
      const va = getVal(a);
      const vb = getVal(b);
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

  // Reset to page 1 when filters/pageSize change
  useEffect(() => { setPage(1); }, [categoryFilter, verifiedFilter, pageSize]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ArrowUpDown className="inline h-3.5 w-3.5" />;
    return sortDir === 'asc' ? <ArrowUp className="inline h-3.5 w-3.5" /> : <ArrowDown className="inline h-3.5 w-3.5" />;
  };

  const approve = async (id, approved) => {
    const res = await dispatch(setProductApproved({ id, approved }));
    if (res.meta.requestStatus === 'fulfilled') toast.success(approved ? 'Product approved' : 'Product disapproved');
    else toast.error(res.payload || 'Failed to update');
  };

  const onDelete = async (id) => {
    const res = await dispatch(removeProduct(id));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Product deleted');
    else toast.error(res.payload || 'Failed to delete');
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Products</h1>
      {loading ? (
        <div className="rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        </div>
      ) : (
        <div className="rounded-2xl border shadow-sm overflow-hidden">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 p-4 border-b bg-white/60 dark:bg-gray-900/50">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">Category</label>
              <select
                className="h-9 rounded-md border px-2 text-sm bg-background"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c === 'all' ? 'All' : c}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">Status</label>
              <select
                className="h-9 rounded-md border px-2 text-sm bg-background"
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-sm text-gray-600 dark:text-gray-300">Per page</label>
              <select
                className="h-9 rounded-md border px-2 text-sm bg-background"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900/40 backdrop-blur supports-backdrop-filter:bg-gray-50/80 dark:supports-backdrop-filter:bg-gray-900/40">
              <tr className="text-left text-gray-600 dark:text-gray-300">
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide">
                  <button className="inline-flex items-center gap-1 hover:underline" onClick={() => toggleSort('title')}>
                    Product <SortIcon col="title" />
                  </button>
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide">
                  <button className="inline-flex items-center gap-1 hover:underline" onClick={() => toggleSort('price')}>
                    Price <SortIcon col="price" />
                  </button>
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide">
                  <button className="inline-flex items-center gap-1 hover:underline" onClick={() => toggleSort('category')}>
                    Category <SortIcon col="category" />
                  </button>
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide">
                  <button className="inline-flex items-center gap-1 hover:underline" onClick={() => toggleSort('seller')}>
                    Seller <SortIcon col="seller" />
                  </button>
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide">
                  <button className="inline-flex items-center gap-1 hover:underline" onClick={() => toggleSort('verified')}>
                    Status <SortIcon col="verified" />
                  </button>
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map(p => {
                const img = p.image || (p.images && p.images[0]) || p.thumbnail || 'https://via.placeholder.com/64?text=Img';
                const seller = p.sellerId?.storeName || p.seller?.storeName || '-';
                const verified = !!p.verified;
                return (
                  <tr key={p._id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={img} alt={p.title} className="h-12 w-12 rounded-md object-cover border" />
                        <div className="min-w-0">
                          <div className="font-medium truncate max-w-[24ch]" title={p.title}>{p.title || 'Untitled'}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[28ch]" title={p._id}>ID: {p._id.slice(-8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">₹{p.price}</td>
                    <td className="py-3 px-4">{p.category || '-'}</td>
                    <td className="py-3 px-4">{seller}</td>
                    <td className="py-3 px-4">
                      {verified ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 text-xs font-medium">Verified</span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-2 py-0.5 text-xs font-medium">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => setViewProduct(p)} title="View">
                          <Eye size={16} />
                        </Button>
                        {verified ? (
                          <Button variant="secondary" size="sm" onClick={() => approve(p._id, false)} title="Disapprove"><X size={16} /></Button>
                        ) : (
                          <Button variant="secondary" size="sm" onClick={() => approve(p._id, true)} title="Approve"><Check size={16} /></Button>
                        )}
                        <Button variant="destructive" size="sm" onClick={() => onDelete(p._id)} title="Delete"><Trash2 size={16} /></Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
          {/* Footer / Pagination */}
          <div className="flex items-center justify-between gap-3 p-4 border-t bg-white/60 dark:bg-gray-900/50">
            <div className="text-xs text-gray-600 dark:text-gray-300">
              Showing {total === 0 ? 0 : start + 1}–{Math.min(end, total)} of {total}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}>Prev</Button>
              <span className="text-sm">Page {currentPage} / {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>Next</Button>
            </div>
          </div>
          {(!items || items.length === 0) && (
            <div className="p-6 text-sm text-center text-muted-foreground">No products found.</div>
          )}
        </div>
      )}

      {/* View Product Modal */}
      {viewProduct && (() => {
        const p = viewProduct;
        const img = p.image || (p.images && p.images[0]) || p.thumbnail || 'https://via.placeholder.com/320x240?text=Product';
        const seller = p.sellerId?.storeName || p.seller?.storeName || '-';
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-2xl rounded-xl border bg-background p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Product Details</h2>
                <Button variant="outline" size="sm" onClick={() => setViewProduct(null)}>Close</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <img src={img} alt={p.title} className="w-full h-48 md:h-56 object-cover rounded-lg border" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-base font-semibold">{p.title || 'Untitled'}</div>
                  {p.description && <div className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{p.description}</div>}
                  <div><span className="text-gray-500">Price:</span> ₹{p.price}</div>
                  <div><span className="text-gray-500">Category:</span> {p.category || '-'}</div>
                  <div><span className="text-gray-500">Seller:</span> {seller}</div>
                  <div>
                    <span className="text-gray-500">Status:</span>{' '}
                    {p.verified ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 text-xs font-medium">Verified</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-2 py-0.5 text-xs font-medium">Pending</span>
                    )}
                  </div>
                  {p.createdAt && (
                    <div className="text-gray-500">Created: {new Date(p.createdAt).toLocaleString()}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default ProductsPage;
