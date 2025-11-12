// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { role: 'Admin', token: '...' }

  // Tự động load user từ localStorage khi F5
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRole');
    if (token && role) {
      setUser({ token, role });
    }
  }, []);

  // Hàm Login
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      // response.data = { token, role }
      if (response.statusCode === '200') {
        const { token, role } = response.data;
        localStorage.setItem('userToken', token);
        localStorage.setItem('userRole', role);
        setUser({ token, role });
        return true;
      }
      return false; // Login thất bại (sai pass - 401)
    } catch (error) {
      console.error("Login Error:", error);
      return false; // Lỗi mạng, 401, 404...
    }
  };

  // Hàm Logout
  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;