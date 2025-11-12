// src/services/staffService.js
import apiService from './apiService';

// Đảm bảo API_PATH khớp với Swagger của bạn
const API_PATH = '/Staff';

// === Profile ===
export const getProfile = () => {
  return apiService.get(`${API_PATH}/profile/me`);
};

export const updateProfile = (dto) => {
  return apiService.put(`${API_PATH}/profile/me`, dto);
};

// === Category Management ===
export const getCategories = () => {
  return apiService.get(`${API_PATH}/categories`);
};

export const createCategory = (dto) => {
  return apiService.post(`${API_PATH}/categories`, dto);
};

export const updateCategory = (id, dto) => {
  return apiService.put(`${API_PATH}/categories/${id}`, dto);
};

export const deleteCategory = (id) => {
  return apiService.delete(`${API_PATH}/categories/${id}`);
};

// === News Management ===
export const getNews = () => {
  return apiService.get(`${API_PATH}/news`);
};

export const getNewsHistory = () => {
  return apiService.get(`${API_PATH}/news/history`);
};

export const createNews = (dto) => {
  return apiService.post(`${API_PATH}/news`, dto);
};

export const updateNews = (id, dto) => {
  return apiService.put(`${API_PATH}/news/${id}`, dto);
};

export const deleteNews = (id) => {
  return apiService.delete(`${API_PATH}/news/${id}`);
};