// src/pages/AccountManagement.jsx
import React, { useState, useEffect, useCallback } from 'react'; // 1. IMPORT useCallback
import { Link } from 'react-router-dom';
import * as adminService from '../services/adminService';
import Modal from '../components/Modal';

// CSS styles (Không đổi)
const styles = {
  container: { padding: '20px', maxWidth: '1000px', margin: 'auto' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: { margin: 0 },
  headerButtons: {
    display: 'flex',
    gap: '10px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    textDecoration: 'none',
  },
  reportButton: {
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    textDecoration: 'none',
  },
  searchBar: {
    padding: '10px',
    fontSize: '16px',
    width: '300px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  table: { width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  thTd: { border: '1px solid #ddd', padding: '12px', textAlign: 'left' },
  th: { backgroundColor: '#f4f4f4' },
  actions: { display: 'flex', gap: '10px' },
  editButton: { padding: '5px 10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  deleteButton: { padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  error: { color: 'red', fontWeight: 'bold' },
  formRow: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
  input: { width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' },
  select: { width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' },
};

const initialFormState = {
  accountName: '',
  accountEmail: '',
  accountPassword: '',
  accountRole: 1,
};

function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null); 
  const [formData, setFormData] = useState(initialFormState);

  // SỬA LỖI WARNING useEffect
  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getAccounts(searchTerm);
      if (response.statusCode === '200') {
        setAccounts(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch accounts.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]); 

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]); // Sửa dependency array

  const handleOpenCreateModal = () => {
    setEditingAccount(null);
    setFormData(initialFormState);
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (account) => {
    setEditingAccount(account);
    setFormData({
      accountName: account.accountName,
      accountEmail: account.accountEmail,
      accountPassword: '', 
      accountRole: account.accountRole,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // ⚠️ SỬA LỖI ERROR: THÊM HÀM BỊ THIẾU ⚠️
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let response;
      if (editingAccount) {
        const updateDto = {
          accountName: formData.accountName,
          accountRole: parseInt(formData.accountRole),
        };
        response = await adminService.updateAccount(editingAccount.accountId, updateDto);
      } else {
        const createDto = {
          ...formData,
          accountRole: parseInt(formData.accountRole),
        };
        response = await adminService.createAccount(createDto);
      }
      if (response.statusCode === '200' || response.statusCode === '201') {
        fetchAccounts(); 
        handleCloseModal();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to save account.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        const response = await adminService.deleteAccount(id);
        if (response.statusCode === '200') {
          fetchAccounts();
        } else {
          setError(response.message); 
        }
      } catch (err) {
        setError(err.message || 'Failed to delete account.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Account Management</h2>
        
        <div style={styles.headerButtons}>
          <Link to="/admin/reports" style={styles.reportButton}>
            Go to Reports
          </Link>
          <button style={styles.button} onClick={handleOpenCreateModal}>
            Create New Account
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name or email..."
        style={styles.searchBar}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <p>Loading...</p>}
      {error && !isModalOpen && <p style={styles.error}>{error}</p>}

      <table style={styles.table}>
        <thead>
          <tr>
            {/* ⚠️ SỬA LỖI WARNING: Sửa 'style="auto"' thành style object ⚠️ */}
            <th style={{ ...styles.thTd, ...styles.th }}>ID</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Name</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Email</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Role</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <tr key={acc.accountId}>
              <td style={styles.thTd}>{acc.accountId}</td>
              <td style={styles.thTd}>{acc.accountName}</td>
              <td style={styles.thTd}>{acc.accountEmail}</td>
              <td style={styles.thTd}>{acc.roleName}</td>
              <td style={styles.thTd}>
                <div style={styles.actions}>
                  <button style={styles.editButton} onClick={() => handleOpenEditModal(acc)}>Edit</button>
                  <button style={styles.deleteButton} onClick={() => handleDelete(acc.accountId)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* === MODAL (POPUP) TẠO/SỬA === */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAccount ? 'Edit Account' : 'Create Account'}
      >
        <form onSubmit={handleSubmit}>
          {error && isModalOpen && <p style={styles.error}>{error}</p>}

          <div style={styles.formRow}>
            <label style={styles.label}>Account Name:</label>
            <input
              style={styles.input}
              type="text"
              name="accountName"
              value={formData.accountName}
              onChange={handleInputChange} // Gọi hàm đã thêm
              required
            />
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>Email:</label>
            <input
              style={styles.input}
              type="email"
              name="accountEmail"
              value={formData.accountEmail}
              onChange={handleInputChange} // Gọi hàm đã thêm
              required
              disabled={editingAccount} 
            />
          </div>

          {!editingAccount && (
            <div style={styles.formRow}>
              <label style={styles.label}>Password:</label>
              <input
                style={styles.input}
                type="password"
                name="accountPassword"
                value={formData.accountPassword}
                onChange={handleInputChange} // Gọi hàm đã thêm
                required
              />
            </div>
          )}

          <div style={styles.formRow}>
            <label style={styles.label}>Role:</label>
            <select
              style={styles.select}
              name="accountRole"
              value={formData.accountRole}
              onChange={handleInputChange} // Gọi hàm đã thêm
            >
              <option value={1}>Staff</option>
              <option value={2}>Lecturer</option>
            </select>
          </div>

          <button type="submit" style={styles.button}>
            {editingAccount ? 'Update' : 'Create'}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default AccountManagement;