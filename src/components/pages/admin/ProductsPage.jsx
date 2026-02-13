import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAdminProducts, fetchProductsAdminThunk, removeProduct, setProductApproved } from '../../../store/slices/adminSlice';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import Select from '../../ui/Select';
import { Check, X, Trash2, Eye, ArrowUp, ArrowDown, ArrowUpDown, Search, Package, Tag, Store, IndianRupee, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(selectAdminProducts);
  const [viewProduct, setViewProduct] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all'); // all | verified | pending

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sorting
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

      if (!catOk || !verOk) return false;

      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (p.title || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.sellerId?.storeName || p.seller?.storeName || '').toLowerCase().includes(q)
      );
    });
    return list;
  }, [items, categoryFilter, verifiedFilter, search]);

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
  useEffect(() => { setPage(1); }, [categoryFilter, verifiedFilter, pageSize, search]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ArrowUpDown className="inline h-3.5 w-3.5 text-gray-400" />;
    return sortDir === 'asc' ? <ArrowUp className="inline h-3.5 w-3.5 text-blue-600" /> : <ArrowDown className="inline h-3.5 w-3.5 text-blue-600" />;
  };

  const approve = async (id, approved) => {
    const res = await dispatch(setProductApproved({ id, approved }));
    if (res.meta.requestStatus === 'fulfilled') toast.success(approved ? 'Product approved' : 'Product disapproved');
    else toast.error(res.payload || 'Failed to update');
  };

  const onDeleteConfirm = async (id) => {
    const res = await dispatch(removeProduct(id));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Product deleted');
    else toast.error(res.payload || 'Failed to delete');
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6 p-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage product inventory and approvals</p>
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
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={categories.map(c => ({ value: c, label: c === 'all' ? 'All Categories' : c }))}
              className="w-full sm:w-48"
            />
            <Select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'verified', label: 'Verified' },
                { value: 'pending', label: 'Pending' }
              ]}
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
              {[10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => toggleSort('title')}>
                    <div className="flex items-center gap-1">Product <SortIcon col="title" /></div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => toggleSort('price')}>
                    <div className="flex items-center gap-1">Price <SortIcon col="price" /></div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => toggleSort('category')}>
                    <div className="flex items-center gap-1">Category <SortIcon col="category" /></div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => toggleSort('seller')}>
                    <div className="flex items-center gap-1">Seller <SortIcon col="seller" /></div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => toggleSort('verified')}>
                    <div className="flex items-center gap-1">Status <SortIcon col="verified" /></div>
                  </th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {displayItems.map(p => {
                  const img = p.image || (p.images && p.images[0]) || p.thumbnail || 'https://via.placeholder.com/64?text=Img';
                  const seller = p.sellerId?.storeName || p.seller?.storeName || '-';
                  const verified = !!p.verified;
                  return (
                    <tr key={p._id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={img} alt={p.title} className="h-12 w-12 rounded-lg object-cover border border-gray-200 dark:border-gray-700 shadow-sm" />
                          <div className="min-w-0 max-w-[200px]">
                            <div className="font-medium text-gray-900 dark:text-white truncate" title={p.title}>{p.title || 'Untitled'}</div>
                            <div className="text-xs text-gray-500 truncate">ID: {p._id.slice(-8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">₹{p.price}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                          <Tag size={12} /> {p.category || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{seller}</td>
                      <td className="py-3 px-4">
                        {verified ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-0.5 text-xs font-medium border border-green-100 dark:border-green-900">
                            <Check size={12} /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-0.5 text-xs font-medium border border-amber-100 dark:border-amber-900">
                            <ClockIcon size={12} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" onClick={() => setViewProduct(p)} title="View Details">
                            <Eye size={16} className="text-blue-600" />
                          </Button>
                          {verified ? (
                            <Button variant="ghost" size="sm" onClick={() => approve(p._id, false)} title="Disapprove">
                              <X size={16} className="text-amber-600" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => approve(p._id, true)} title="Approve">
                              <Check size={16} className="text-green-600" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(p)} title="Delete">
                            <Trash2 size={16} className="text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {total === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No products found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}

        {/* Footer / Pagination */}
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
                disabled={currentPage <= 1}
                className="disabled:opacity-50"
              >
                Previous
              </Button>
              <div className="text-sm font-medium px-2">Page {currentPage} of {totalPages}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* View Product Modal */}
      <Modal
        isOpen={!!viewProduct}
        onClose={() => setViewProduct(null)}
        title="Product Details"
        className="max-w-3xl"
      >
        {viewProduct && (() => {
          const p = viewProduct;
          const img = p.image || (p.images && p.images[0]) || p.thumbnail || 'https://via.placeholder.com/320x240?text=Product';
          const seller = p.sellerId?.storeName || p.seller?.storeName || '-';
          return (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <img src={img} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                    <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Price</div>
                    <div className="text-lg font-bold text-blue-700 dark:text-blue-300">₹{p.price}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
                    <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">Category</div>
                    <div className="text-lg font-bold text-purple-700 dark:text-purple-300 truncate">{p.category}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{p.title}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    {p.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 px-2.5 py-0.5 text-xs font-medium">
                        <Check size={12} /> Verified Product
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-2.5 py-0.5 text-xs font-medium">
                        <ClockIcon size={12} /> Pending Approval
                      </span>
                    )}
                    <span className="text-xs text-gray-500">ID: {p._id}</span>
                  </div>

                  <div className="prose dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    {p.description || <span className="italic text-gray-400">No description provided.</span>}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Store size={18} className="text-gray-500" /> Seller Information
                  </h4>
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between">
                    <span className="font-medium">{seller}</span>
                    <Button variant="outline" size="sm">View Seller</Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                  {p.verified ? (
                    <Button variant="secondary" className="flex-1" onClick={() => { approve(p._id, false); setViewProduct(null); }}>
                      <X size={16} className="mr-2" /> Disapprove
                    </Button>
                  ) : (
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => { approve(p._id, true); setViewProduct(null); }}>
                      <Check size={16} className="mr-2" /> Approve
                    </Button>
                  )}
                  <Button variant="destructive" onClick={() => { setConfirmDelete(p); setViewProduct(null); }}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete Product"
        className="max-w-sm"
      >
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto text-red-600">
            <Trash2 size={24} />
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{confirmDelete?.title}</span>?
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

// Helper icon component
const ClockIcon = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default ProductsPage;
