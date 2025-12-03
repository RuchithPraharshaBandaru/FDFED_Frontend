import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorsThunk, selectAdminVendors } from '../../../store/slices/adminSlice';

const VendorsPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(selectAdminVendors);

  useEffect(() => { dispatch(fetchVendorsThunk({})); }, [dispatch]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Vendors</h1>
      {loading ? 'Loading…' : (
        <div className="rounded-xl border overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-2 px-3">Store</th>
                <th>Email</th>
                <th>GSTN</th>
              </tr>
            </thead>
            <tbody>
              {(items || []).map(v => (
                <tr key={v._id} className="border-t">
                  <td className="py-2 px-3">{v.storeName}</td>
                  <td>{v.email}</td>
                  <td>{v.gstn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorsPage;
