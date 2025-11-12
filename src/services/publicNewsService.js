// src/services/publicNewsService.js
import apiService from './apiService';

// Đường dẫn khớp với Controller C#
const API_PATH = '/PublicNews'; 

// GET /api/PublicNews/news
export const getPublicNews = () => {
  return apiService.get(`${API_PATH}/news`);
};

// GET /api/PublicNews/news/{id}
export const getPublicNewsById = (id) => {
  return apiService.get(`${API_PATH}/news/${id}`);
};