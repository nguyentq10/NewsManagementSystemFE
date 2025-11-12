// src/components/ProtectedRoute.jsx
import React from 'react';
// ⚠️ PHẢI IMPORT BẰNG DẤU {}
import { useAuth } from '../hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * @param {{ allowedRoles: string[] }} props
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth(); // Lấy user từ context

  if (!user) {
    // 1. Chưa đăng nhập? Về trang Login
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // 2. Đăng nhập nhưng sai vai trò?
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. OK -> Hiển thị trang con (thông qua <Outlet />)
  return <Outlet />;
};

// ⚠️ PHẢI LÀ 'export default'
export default ProtectedRoute;