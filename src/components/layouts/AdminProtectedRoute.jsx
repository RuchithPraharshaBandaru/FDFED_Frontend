// src/components/layouts/AdminProtectedRoute.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectIsAdminAuthenticated, selectAdminAuthInitialized, checkAdminAuth } from '../../store/slices/adminAuthSlice';

const AdminProtectedRoute = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAdminAuthenticated);
  const init = useSelector(selectAdminAuthInitialized);
  useEffect(() => { if (!init) dispatch(checkAdminAuth()); }, [dispatch, init]);

  if (!init) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuth) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
};

export default AdminProtectedRoute;
