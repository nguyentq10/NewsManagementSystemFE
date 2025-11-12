// src/components/StaffLayout.jsx
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

// CSS-in-JS cho giao diện
const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#343a40', // Màu tối
    color: 'white',
    padding: '20px',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '30px',
    textAlign: 'center',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  navItem: {
    marginBottom: '10px',
  },
  navLink: {
    color: '#adb5bd', // Màu xám nhạt
    textDecoration: 'none',
    display: 'block',
    padding: '10px 15px',
    borderRadius: '5px',
    transition: 'background-color 0.2s, color 0.2s',
  },
  navLinkActive: { // Style khi link được active
    color: 'white',
    backgroundColor: '#007bff', // Màu xanh
  },
  content: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f8f9fa', // Màu nền
  },
};

function StaffLayout() {
  const location = useLocation(); // Dùng để biết đang ở trang nào

  // Hàm kiểm tra link có active không
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div style={styles.layout}>
      {/* THANH MENU BÊN TRÁI */}
      <nav style={styles.sidebar}>
        <h2 style={styles.title}>Staff Dashboard</h2>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link 
              to="/staff/news" 
              style={{
                ...styles.navLink, 
                ...(isActive('/staff/news') && styles.navLinkActive) 
              }}
            >
              News Management
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link 
              to="/staff/categories" 
              style={{
                ...styles.navLink, 
                ...(isActive('/staff/categories') && styles.navLinkActive)
              }}
            >
              Category Management
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link 
              to="/staff/profile" 
              style={{
                ...styles.navLink, 
                ...(isActive('/staff/profile') && styles.navLinkActive)
              }}
            >
              My Profile
            </Link>
          </li>
        </ul>
      </nav>

      {/* VÙNG TRẮNG BÊN PHẢI (NƠI HIỂN THỊ CÁC TRANG CON) */}
      <main style={styles.content}>
        {/* <Outlet /> là nơi React render trang NewsManagement của bạn */}
        <Outlet /> 
      </main>
    </div>
  );
}

// ⚠️ LỖI CỦA BẠN LÀ DO THIẾU DÒNG NÀY ⚠️
export default StaffLayout;