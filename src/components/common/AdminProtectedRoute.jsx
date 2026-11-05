import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * AdminProtectedRoute - Bảo vệ các route Quản trị viên
 * Kiểm tra trạng thái đăng nhập và role admin từ localStorage.
 * Nếu chưa đăng nhập hoặc không phải admin, thông báo và redirect về /login với replace: true
 */
const AdminProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isLoggedIn || userRole !== 'admin') {
    alert('⚠️ Quyền truy cập bị từ chối! Bạn chưa đăng nhập hoặc không có quyền Quản trị viên.');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
