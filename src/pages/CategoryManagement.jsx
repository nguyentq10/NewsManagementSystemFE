// src/pages/CategoryManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import * as staffService from '../services/staffService'; // QUAY LẠI DÙNG 'import * as'
import Modal from '../components/Modal';

// (CSS styles - Không đổi)
const styles = {
  container: { padding: '20px', maxWidth: '1000px', margin: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { margin: 0 },
  button: { padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  thTd: { border: '1px solid #ddd', padding: '12px', textAlign: 'left' },
  th: { backgroundColor: '#f4f4f4' },
  actions: { display: 'flex', gap: '10px' },
  editButton: { padding: '5px 10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  deleteButton: { padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  error: { color: 'red', fontWeight: 'bold' },
  formRow: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
  input: { width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' },
};

const initialFormState = {
  categoryName: '',
  categoryDescription: '',
  parentCategoryID: null,
  isActive: true,
};

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      // GỌI HÀM BẰNG 'staffService.'
      const response = await staffService.getCategories();
      if (response.statusCode === '200') {
        setCategories(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormData(initialFormState);
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      categoryName: category.categoryName,
      categoryDescription: category.categoryDescription,
      parentCategoryID: category.parentCategoryID,
      isActive: category.isActive,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let response;
      if (editingCategory) {
        // GỌI HÀM BẰNG 'staffService.'
        response = await staffService.updateCategory(editingCategory.categoryId, formData);
      } else {
        // GỌI HÀM BẰNG 'staffService.'
        response = await staffService.createCategory(formData);
      }
      if (response.statusCode === '200' || response.statusCode === '201') {
        fetchCategories();
        handleCloseModal();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to save category.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? (Requires no associated news)')) {
      try {
        // GỌI HÀM BẰNG 'staffService.'
        const response = await staffService.deleteCategory(id);
        if (response.statusCode === '200') {
          fetchCategories();
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err.message || 'Failed to delete category. Check constraints.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Category Management</h2>
        <button style={styles.button} onClick={handleOpenCreateModal}>
          Create New Category
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && !isModalOpen && <p style={styles.error}>{error}</p>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.thTd, ...styles.th }}>ID</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Name</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Status</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.categoryId}>
              <td style={styles.thTd}>{cat.categoryId}</td>
              <td style={styles.thTd}>{cat.categoryName}</td>
              <td style={styles.thTd}>{cat.isActive ? 'Active' : 'Inactive'}</td>
              <td style={styles.thTd}>
                <div style={styles.actions}>
                  <button style={styles.editButton} onClick={() => handleOpenEditModal(cat)}>Edit</button>
                  <button style={styles.deleteButton} onClick={() => handleDelete(cat.categoryId)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleSubmit}>
          {error && isModalOpen && <p style={styles.error}>{error}</p>}
          
          <div style={styles.formRow}>
            <label style={styles.label}>Name:</label>
            <input style={styles.input} type="text" name="categoryName" value={formData.categoryName} onChange={handleInputChange} required />
          </div>
          
          <div style={styles.formRow}>
            <label style={styles.label}>Description:</label>
            <input style={styles.input} type="text" name="categoryDescription" value={formData.categoryDescription} onChange={handleInputChange} />
          </div>
          
          <div style={styles.formRow}>
            <label style={styles.label}>
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} />
              {' '}Active
            </label>
          </div>
          
          <button type="submit" style={styles.button}>
            {editingCategory ? 'Update' : 'Create'}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default CategoryManagement;