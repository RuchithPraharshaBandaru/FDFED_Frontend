import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellProductsThunk, updateSellProductStatusThunk, selectAdminSellProducts } from '../../../store/slices/adminSlice';
import Select from '../../ui/Select';
import { toast } from 'react-hot-toast';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

const statuses = ['Pending','Verified','Rejected'];

const SellProductsPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(selectAdminSellProducts);
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
    const res = await dispatch(updateSellProductStatusThunk({ id, userStatus: status }));
    if (res.meta.requestStatus === 'fulfilled') toast.success('User status updated');
    else toast.error(res.payload || 'Update failed');
  };

  const filteredItems = useMemo(() => {
    const list = items || [];
    return list.filter(sp => {
      const inItems = filters.items ? sp.items?.toLowerCase().includes(filters.items.toLowerCase()) : true;
      const inFabric = filters.fabric ? sp.fabric?.toLowerCase().includes(filters.fabric.toLowerCase()) : true;
      const inSize = filters.size ? sp.size === filters.size : true;
      const inGender = filters.gender ? sp.gender === filters.gender : true;
      const inUserStatus = filters.userStatus ? sp.userStatus === filters.userStatus : true;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Second-hand Products</h1>
        <div className="text-sm text-muted-foreground">Total: {items?.length ?? 0}</div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Filters */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="space-y-4 p-4 border rounded-2xl bg-card">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Filters</span>
              <Button variant="link" size="sm" onClick={resetFilters}>Reset</Button>
            </div>
            <Input label="Items" value={filters.items} onChange={e=>setFilters(f=>({ ...f, items: e.target.value }))} placeholder="e.g. shirts" />
            <Input label="Fabric" value={filters.fabric} onChange={e=>setFilters(f=>({ ...f, fabric: e.target.value }))} placeholder="e.g. Linen" />
            <Select label="Size" value={filters.size} onChange={e=>setFilters(f=>({ ...f, size: e.target.value }))} options={[
              {label:'Any', value:''}, {label:'XS', value:'XS'}, {label:'S', value:'S'}, {label:'M', value:'M'}, {label:'L', value:'L'}, {label:'XL', value:'XL'}
            ]} />
            <Select label="Gender" value={filters.gender} onChange={e=>setFilters(f=>({ ...f, gender: e.target.value }))} options={[
              {label:'Any', value:''}, {label:'Mens', value:'mens'}, {label:'Womens', value:'womens'}, {label:'Unisex', value:'unisex'}
            ]} />
            <Select label="User Status" value={filters.userStatus} onChange={e=>setFilters(f=>({ ...f, userStatus: e.target.value }))} options={[
              {label:'Any', value:''}, ...statuses.map(s=>({label:s, value:s}))
            ]} />
            <Select label="Admin Status" value={filters.adminStatus} onChange={e=>setFilters(f=>({ ...f, adminStatus: e.target.value }))} options={[
              {label:'Any', value:''}, {label:'Pending', value:'Pending'}, {label:'Listed', value:'Listed'}, {label:'Sold', value:'Sold'}
            ]} />
            <Select label="Time Slot" value={filters.timeSlot} onChange={e=>setFilters(f=>({ ...f, timeSlot: e.target.value }))} options={[
              {label:'Any', value:''}, {label:'morning', value:'morning'}, {label:'afternoon', value:'afternoon'}, {label:'evening', value:'evening'}
            ]} />
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" label="Min Usage (months)" value={filters.minUsage} onChange={e=>setFilters(f=>({ ...f, minUsage: e.target.value }))} />
              <Input type="number" label="Max Usage (months)" value={filters.maxUsage} onChange={e=>setFilters(f=>({ ...f, maxUsage: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input type="date" label="From Date" value={filters.fromDate} onChange={e=>setFilters(f=>({ ...f, fromDate: e.target.value }))} />
              <Input type="date" label="To Date" value={filters.toDate} onChange={e=>setFilters(f=>({ ...f, toDate: e.target.value }))} />
            </div>
          </div>
        </aside>

        {/* List */}
        <section className="col-span-12 lg:col-span-9">
          {loading ? (
            <div>Loading…</div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map(sp => (
                <div key={sp._id || sp.id} className="border rounded-2xl overflow-hidden bg-card">
                  {/* Image */}
                  {sp.imageSrc ? (
                    <img src={sp.imageSrc} alt={`${sp.items} - ${sp.fabric}`} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-muted flex items-center justify-center text-muted-foreground">No image</div>
                  )}
                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{sp.items} <span className="text-xs text-muted-foreground">({sp.size})</span></div>
                      <div className="text-sm font-medium">₹{sp.estimated_value}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">Fabric: {sp.fabric} • Gender: {sp.gender}</div>
                    <div className="text-xs text-muted-foreground">Usage: {sp.readableUsage || `${sp.usageDuration} months`}</div>
                    <div className="text-xs text-muted-foreground">Date: {sp.clothesDate ? new Date(sp.clothesDate).toLocaleDateString() : '-' } • Slot: {sp.timeSlot || '-'}</div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs">User: {sp.userStatus || '-'}</span>
                      <Select name={`st-${sp._id || sp.id}`} value={sp.userStatus} onChange={(e) => updateStatus(sp._id || sp.id, e.target.value)} options={statuses.map(s => ({ label: s, value: s }))} />
                    </div>
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground">No products match filters.</div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SellProductsPage;
