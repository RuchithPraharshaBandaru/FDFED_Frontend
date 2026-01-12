import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorsThunk, selectAdminVendors } from '../../../store/slices/adminSlice';
import { Search, Store, Mail, FileText, Eye, X } from 'lucide-react';
import Input from '../../ui/Input';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const VendorsPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(selectAdminVendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    dispatch(fetchVendorsThunk({}));
  }, [dispatch]);

  const filteredVendors = (items || []).filter(vendor => 
    vendor.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.gstn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Vendors</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your registered vendor partners.</p>
        </div>
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 p-4 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search vendors by name, email, or GSTN..."
            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Card>
        <Card className="p-4 flex items-center justify-between bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
              <Store className="w-5 h-5" />
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-200">Total Vendors</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{items?.length || 0}</span>
        </Card>
      </div>

      {/* Vendors Table */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Store Name</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">GSTN</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    <div className="animate-pulse flex justify-center">Loading vendors...</div>
                  </td>
                </tr>
              ) : filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No vendors found matching your search.
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor) => (
                  <tr 
                    key={vendor._id} 
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                          {vendor.storeName?.charAt(0).toUpperCase() || 'V'}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{vendor.storeName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {vendor.email}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-300 font-mono text-sm">
                      {vendor.gstn ? (
                        <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          {vendor.gstn}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedVendor(vendor)}
                        className="hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Vendor Details</h3>
              <button 
                onClick={() => setSelectedVendor(null)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-2xl">
                  {selectedVendor.storeName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">{selectedVendor.storeName}</h4>
                  <p className="text-sm text-gray-500">ID: {selectedVendor._id}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">Email Address</label>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {selectedVendor.email}
                  </div>
                </div>
                
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <label className="text-xs font-medium text-gray-500 uppercase mb-1 block">GST Number</label>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-mono">
                    <FileText className="w-4 h-4 text-gray-400" />
                    {selectedVendor.gstn || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end">
              <Button onClick={() => setSelectedVendor(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsPage;
