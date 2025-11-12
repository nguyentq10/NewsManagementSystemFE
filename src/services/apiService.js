// src/services/apiService.js
import axios from 'axios';

// ⚠️⚠️⚠️ CHỈNH SỬA DÒNG NÀY ⚠️⚠️⚠️
// THAY THẾ BẰNG URL CỦA API BACK-END CỦA BẠN
const API_BASE_URL = 'https://localhost:7130/api'; // (Kiểm tra port của bạn)

const apiService = axios.create({
  baseURL: API_BASE_URL,
});

apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  (response) => {
    // Trả về cấu trúc { message, statusCode, data }
    return response.data;
  },
  (error) => {
    if (error.response && error.response.data) {
      // Trả về lỗi có cấu trúc { message, statusCode, data }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default apiService;