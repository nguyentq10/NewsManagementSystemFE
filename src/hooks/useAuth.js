// src/hooks/useAuth.js
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

// ⚠️ PHẢI LÀ 'export const'
export const useAuth = () => {
  return useContext(AuthContext);
};