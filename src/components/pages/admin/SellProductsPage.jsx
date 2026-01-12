import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellProductsThunk, updateSellProductStatusThunk, selectAdminSellProducts } from '../../../store/slices/adminSlice';
import Select from '../../ui/Select';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import { Filter, RefreshCw, Search, Calendar, Clock, Tag, User, CheckCircle, XCircle, AlertCircle, Eye, X } from 'lucide-react';

const statuses = ['Pending', 'Verified', 'Rejected'];

const SellProductsPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(selectAdminSellProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    items: '',
    fabric: '',
    size: '',
    gender: '',
    userStatus: '',
    adminStatus: '',
    timeSlot: '',
    minUsage: '',
    maxUsage: '',
    fromDate: '',
    toDate: '',
  });

  useEffect(() => { dispatch(fetchSellProductsThunk({})); }, [dispatch]);

  const updateStatus = async (id, status) => {
    console.log("updateStatus called with:", id, status);
    if (!id) {
      toast.error("Invalid Product ID");
      return;
    }
    const res = await dispatch(updateSellProductStatusThunk({ id, userStatus: status }));
    console.log("updateStatus result:", res);
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success(`Product marked as ${status}`);
      if (selectedProduct && (selectedProduct._id === id || selectedProduct.id === id)) {
        setSelectedProduct(prev => ({ ...prev, userStatus: status }));
      }
    } else {
      toast.error(res.payload || 'Update failed');
    }
  };

  const filteredItems = useMemo(() => {
    const list = items || [];
    return list.filter(sp => {
      const inItems = filters.items ? sp.items?.toLowerCase().includes(filters.items.toLowerCase()) : true;
      const inFabric = filters.fabric ? sp.fabric?.toLowerCase().includes(filters.fabric.toLowerCase()) : true;
      const inSize = filters.size ? sp.size === filters.size : true;
      const inGender = filters.gender ? sp.gender === filters.gender : true;
      const inUserStatus = filters.userStatus ? sp.userStatus === filters.userStatus : sp.userStatus !== 'Rejected';
      const inAdminStatus = filters.adminStatus ? sp.adminStatus === filters.adminStatus : true;
      const inTimeSlot = filters.timeSlot ? sp.timeSlot === filters.timeSlot : true;
      const inUsageMin = filters.minUsage ? Number(sp.usageDuration ?? 0) >= Number(filters.minUsage) : true;
      const inUsageMax = filters.maxUsage ? Number(sp.usageDuration ?? 0) <= Number(filters.maxUsage) : true;
      const inDateFrom = filters.fromDate ? new Date(sp.clothesDate) >= new Date(filters.fromDate) : true;
      const inDateTo = filters.toDate ? new Date(sp.clothesDate) <= new Date(filters.toDate) : true;
      return inItems && inFabric && inSize && inGender && inUserStatus && inAdminStatus && inTimeSlot && inUsageMin && inUsageMax && inDateFrom && inDateTo;
    });
  }, [items, filters]);

  const resetFilters = () => setFilters({
    items: '', fabric: '', size: '', gender: '', userStatus: '', adminStatus: '', timeSlot: '', minUsage: '', maxUsage: '', fromDate: '', toDate: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'Rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Second-hand Products</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and verify user-submitted second-hand items.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-sm text-gray-500">Total Items:</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">{items?.length ?? 0}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Filters */}
        <aside className="col-span-12 lg:col-span-3 space-y-6">
          <Card className="p-5 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <Filter className="w-4 h-4" />
                Filters
              </div>
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs h-8">
                <RefreshCw className="w-3 h-3 mr-1" /> Reset
              </Button>
            </div>
            
            <div className="space-y-4">
              <Input 
                label="Item Name" 
                value={filters.items} 
                onChange={e=>setFilters(f=>({ ...f, items: e.target.value }))} 
                placeholder="Search items..." 
                className="bg-gray-50 dark:bg-gray-900/50"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <Select 
                  label="Size" 
                  value={filters.size} 
                  onChange={e=>setFilters(f=>({ ...f, size: e.target.value }))} 
                  options={[
                    {label:'Any', value:''}, {label:'XS', value:'XS'}, {label:'S', value:'S'}, {label:'M', value:'M'}, {label:'L', value:'L'}, {label:'XL', value:'XL'}
                  ]} 
                />
                <Select 
                  label="Gender" 
                  value={filters.gender} 
                  onChange={e=>setFilters(f=>({ ...f, gender: e.target.value }))} 
                  options={[
                    {label:'Any', value:''}, {label:'Mens', value:'mens'}, {label:'Womens', value:'womens'}, {label:'Unisex', value:'unisex'}
                  ]} 
                />
              </div>

              <Select 
                label="Status" 
                value={filters.userStatus} 
                onChange={e=>setFilters(f=>({ ...f, userStatus: e.target.value }))} 
                options={[
                  {label:'All Statuses', value:''}, ...statuses.map(s=>({label:s, value:s}))
                ]} 
              />

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs font-medium text-gray-500 mb-3 uppercase">Advanced Filters</p>
                <div className="space-y-3">
                  <Input label="Fabric" value={filters.fabric} onChange={e=>setFilters(f=>({ ...f, fabric: e.target.value }))} placeholder="e.g. Cotton" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input type="number" label="Min Usage" placeholder="Months" value={filters.minUsage} onChange={e=>setFilters(f=>({ ...f, minUsage: e.target.value }))} />
                    <Input type="number" label="Max Usage" placeholder="Months" value={filters.maxUsage} onChange={e=>setFilters(f=>({ ...f, maxUsage: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </aside>

        {/* List */}
        <section className="col-span-12 lg:col-span-9">
          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <Card key={i} className="h-80 animate-pulse bg-gray-100 dark:bg-gray-800 border-0" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map(sp => (
                <Card key={sp._id || sp.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-gray-800">
                  {/* Image Area */}
                  <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-900">
                    {sp.imageSrc ? (
                      <img 
                        src={sp.imageSrc} 
                        alt={`${sp.items}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <Tag className="w-10 h-10 mb-2 opacity-20" />
                        <span className="text-xs">No image available</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm backdrop-blur-md ${getStatusColor(sp.userStatus)}`}>
                        {sp.userStatus || 'Pending'}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs font-medium opacity-90">Estimated Value</p>
                          <p className="font-bold">₹{sp.estimated_value}</p>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-white text-black hover:bg-gray-200 border-none h-8 px-3 text-xs"
                          onClick={() => setSelectedProduct(sp)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate pr-2" title={sp.items}>{sp.items}</h3>
                        <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400">{sp.size}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                        <span className="capitalize">{sp.gender}</span> • <span className="capitalize">{sp.fabric}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {sp.usageDuration} months used
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {sp.clothesDate ? new Date(sp.clothesDate).toLocaleDateString() : '-'}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {filteredItems.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">No products found</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm mt-2">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={resetFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Product Details</h3>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Image & Status */}
                <div className="space-y-6">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative">
                    {selectedProduct.imageSrc ? (
                      <img src={selectedProduct.imageSrc} alt={selectedProduct.items} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 flex-col">
                        <Tag className="w-12 h-12 mb-2 opacity-20" />
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Verification Status</h4>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        {statuses.map(status => (
                          <button
                            key={status}
                            onClick={() => updateStatus(selectedProduct._id || selectedProduct.id, status)}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                              selectedProduct.userStatus === status
                                ? getStatusColor(status) + ' ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 ring-gray-200 dark:ring-gray-700'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        Current status: <span className="font-medium text-gray-900 dark:text-white">{selectedProduct.userStatus || 'Pending'}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Details */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProduct.items}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-medium border border-blue-200 dark:border-blue-800">
                        {selectedProduct.gender}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs font-medium border border-purple-200 dark:border-purple-800">
                        Size: {selectedProduct.size}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <span className="text-xs text-gray-500 block mb-1">Estimated Value</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">₹{selectedProduct.estimated_value}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <span className="text-xs text-gray-500 block mb-1">Usage Duration</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{selectedProduct.usageDuration} <span className="text-sm font-normal text-gray-500">months</span></span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <div>
                        <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Fabric</span>
                        <span className="font-medium text-gray-900 dark:text-white">{selectedProduct.fabric}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Time Slot</span>
                        <span className="font-medium text-gray-900 dark:text-white">{selectedProduct.timeSlot || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Date Added</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedProduct.clothesDate ? new Date(selectedProduct.clothesDate).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Admin Status</span>
                        <span className="font-medium text-gray-900 dark:text-white">{selectedProduct.adminStatus || 'Pending'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedProduct.description && (
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 block text-xs uppercase tracking-wider mb-2">Description</span>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedProduct(null)}>Close</Button>
              <Button onClick={() => updateStatus(selectedProduct._id || selectedProduct.id, 'Verified')}>Verify Product</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellProductsPage;

