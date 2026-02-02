import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminLogin, checkAdminAuth, selectIsAdminAuthenticated, selectAdminAuthLoading, selectAdminAuthError } from '../../../store/slices/adminAuthSlice';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { useNavigate, Link } from 'react-router-dom';
import { LockKeyhole, ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const AdminLoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAdminAuthenticated);
  const loading = useSelector(selectAdminAuthLoading);
  const error = useSelector(selectAdminAuthError);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema), mode: 'onTouched' });

  useEffect(() => { dispatch(checkAdminAuth()); }, [dispatch]);
  useEffect(() => { if (isAuth) navigate('/admin/dashboard', { replace: true }); }, [isAuth, navigate]);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  const onSubmit = async (values) => {
    const res = await dispatch(adminLogin(values));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Authenticated');
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-6 rounded-2xl border bg-white/60 dark:bg-gray-900/50 backdrop-blur">
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to role selection
        </Link>
        <div className="flex items-center gap-2">
          <LockKeyhole className="text-green-600" />
          <h1 className="text-xl font-bold">Admin Sign In</h1>
        </div>
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input label="Email" type="email" placeholder="admin@example.com" {...register('email')} />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Input label="Password" type="password" placeholder="••••••••" {...register('password')} />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <Button type="submit" fullWidth disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
