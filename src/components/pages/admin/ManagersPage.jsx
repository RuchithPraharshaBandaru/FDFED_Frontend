import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetchManagersThunk, createManagerThunk, deleteManagerThunk, updateManagerPasswordThunk, selectAdminManagers } from '../../../store/slices/adminSlice';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { KeyRound, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Min 6 characters'),
});

const ManagersPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(selectAdminManagers);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => { dispatch(fetchManagersThunk({})); }, [dispatch]);

  const onCreate = async (values) => {
    const res = await dispatch(createManagerThunk(values));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Manager created');
      reset();
      dispatch(fetchManagersThunk({}));
    } else toast.error(res.payload || 'Failed to create');
  };

  const onDelete = async (id) => {
    const res = await dispatch(deleteManagerThunk(id));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Manager deleted');
    else toast.error(res.payload || 'Failed to delete');
  };

  const onChangePassword = async (id) => {
    const password = window.prompt('Enter a new password (min 6 characters)');
    if (!password) return;
    if (String(password).length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    const res = await dispatch(updateManagerPasswordThunk({ id, password }));
    if (res.meta.requestStatus === 'fulfilled') toast.success('Password updated');
    else toast.error(res.payload || 'Failed to update password');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Managers</h1>
      <form onSubmit={handleSubmit(onCreate)} className="grid sm:grid-cols-3 gap-3 max-w-3xl">
        <div>
          <Input label="Email" placeholder="manager@example.com" {...register('email')} />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Input label="Password" type="password" placeholder="secret123" {...register('password')} />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <div className="flex items-end">
          <Button type="submit">Create</Button>
        </div>
      </form>

      <div className="rounded-xl border overflow-auto">
        {loading ? 'Loading…' : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-2 px-3">Email</th>
                <th>Assigned Users</th>
                <th>Assigned Sellers</th>
                <th>Pending Users</th>
                <th>Pending Sellers</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(items || []).map(m => (
                <tr key={m._id} className="border-t">
                  <td className="py-2 px-3">{m.email}</td>
                  <td>{m.assignedUserCount ?? 0}</td>
                  <td>{m.assignedSellerCount ?? 0}</td>
                  <td>{m.pendingUserQuota ?? 0}</td>
                  <td>{m.pendingSellerQuota ?? 0}</td>
                  <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td className="text-right pr-3">
                    <Button variant="outline" size="sm" onClick={() => onChangePassword(m._id)}>
                      <KeyRound size={16} />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(m._id)}><Trash2 size={16} /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManagersPage;
