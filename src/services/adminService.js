// src/services/adminService.js
import apiService from './apiService';

const API_PATH = '/admin';

// === Account Management ===

// GET /api/admin/accounts?search=...
export const getAccounts = (searchTerm) => {
  // 1. Tạo một đối tượng params
  const params = {};

  // 2. CHỈ thêm 'search' vào params NẾU nó có giá trị
  if (searchTerm) {
    params.search = searchTerm;
  }

  // 3. Gửi request với params (sẽ là {} nếu searchTerm rỗng)
  return apiService.get(`${API_PATH}/accounts`, { params });
};

// POST /api/admin/accounts
// (dto = AccountCreateDto)
export const createAccount = (dto) => {
  return apiService.post(`${API_PATH}/accounts`, dto);
};

// PUT /api/admin/accounts/{id}
// (dto = AccountUpdateDto)
export const updateAccount = (id, dto) => {
  return apiService.put(`${API_PATH}/accounts/${id}`, dto);
};

// DELETE /api/admin/accounts/{id}
export const deleteAccount = (id) => {
  return apiService.delete(`${API_PATH}/accounts/${id}`);
};

// === Reports ===

// GET /api/admin/reports/statistics
export const getStatisticsReport = (startDate, endDate) => {
  return apiService.get(`${API_PATH}/reports/statistics`, {
    params: { startDate, endDate },
  });
};