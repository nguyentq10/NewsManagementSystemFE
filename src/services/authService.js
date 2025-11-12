// src/services/authService.js
import apiService from './apiService';

/**
 * Gọi API đăng nhập
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>}
 */
export const login = (email, password) => {
  // Gửi DTO (LoginRequest) mà API yêu cầu
  return apiService.post('/auth/login', { email, password });
};