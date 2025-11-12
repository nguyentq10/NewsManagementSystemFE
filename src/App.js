// src/App.js
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Import các component
import ProtectedRoute from './components/ProtectedRoute';
import StaffLayout from './components/StaffLayout'; 

// Import các Trang
import LoginPage from './pages/LoginPage';
import AccountManagement from './pages/AccountManagement';
import ReportPage from './pages/ReportPage';
import PublicNewsPage from './pages/PublicNewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import CategoryManagement from './pages/CategoryManagement';
import NewsManagement from './pages/NewsManagement';
import ProfilePage from './pages/ProfilePage';


const LogoutButton = () => {
  const { logout } = useAuth();
  return (
    <button onClick={logout} style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
      Logout
    </button>
  );
};

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      {user && <LogoutButton />}

      <Routes>
        {/* === Public Routes === */}
        <Route path="/" element={<PublicNewsPage />} /> 
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<h2>403 - Unauthorized</h2>} />

        {/* === ⚠️ STAFF ROUTES (ĐÃ SỬA CẤU TRÚC) ⚠️ === */}
        {/* Bước 1: Bảo vệ (Chỉ cho Staff) */}
        <Route element={<ProtectedRoute allowedRoles={['Staff']} />}>
          {/* Bước 2: Hiển thị Menu (StaffLayout) */}
          <Route element={<StaffLayout />}>
            {/* Bước 3: Render các trang con BÊN TRONG Menu */}
            <Route path="/staff/dashboard" element={<Navigate to="/staff/news" replace />} />
            <Route path="/staff/news" element={<NewsManagement />} />
            <Route path="/staff/categories" element={<CategoryManagement />} />
            <Route path="/staff/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* === ⚠️ ADMIN ROUTES (ĐÃ SỬA CẤU TRÚC) ⚠️ === */}
        {/* Bước 1: Bảo vệ (Chỉ cho Admin) */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          {/* Admin không cần Layout, nên render thẳng trang */}
          <Route path="/admin/dashboard" element={<Navigate to="/admin/accounts" replace />} />
          <Route path="/admin/accounts" element={<AccountManagement />} />
          <Route path="/admin/reports" element={<ReportPage />} />
        </Route>

        {/* === Lecturer Routes === */}
        <Route element={<ProtectedRoute allowedRoles={['Lecturer']} />}>
           <Route path="/lecturer/dashboard" element={<h2>Lecturer Dashboard</h2>} />
        </Route>

        {/* Route mặc định */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;