import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetchManagersThunk, createManagerThunk, deleteManagerThunk, selectAdminManagers } from '../../../store/slices/adminSlice';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { Trash2 } from 'lucide-react';
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
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(items || []).map(m => (
                <tr key={m._id} className="border-t">
                  <td className="py-2 px-3">{m.email}</td>
                  <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td className="text-right pr-3">
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
