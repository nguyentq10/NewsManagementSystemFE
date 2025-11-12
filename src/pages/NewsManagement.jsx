// src/pages/NewsManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import * as staffService from '../services/staffService';
import Modal from '../components/Modal';

// (CSS styles)
const styles = {
  container: { padding: '20px', maxWidth: '1200px', margin: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { margin: 0 },
  button: { padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
  toggleButtons: { display: 'flex', gap: '10px', marginBottom: '20px' },
  toggleButton: { padding: '8px 12px', border: '1px solid #007bff', backgroundColor: 'white', color: '#007bff', cursor: 'pointer', borderRadius: '5px' },
  toggleButtonActive: { backgroundColor: '#007bff', color: 'white' },
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
  textarea: { width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px' },
  select: { width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' },
  tagContainer: { display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' },
  tag: { backgroundColor: '#007bff', color: 'white', padding: '5px 10px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '5px' },
  tagClose: { cursor: 'pointer', fontWeight: 'bold' },
};

const initialFormState = {
  newsTitle: '',
  headline: '',
  newsContent: '',
  newsSource: '',
  categoryID: '',
  newsStatus: true,
  tags: [],
};

function NewsManagement() {
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [tagInput, setTagInput] = useState('');

  const fetchNewsAndCategories = useCallback(async () => {
    setLoading(true);
    try {
      const catResponse = await staffService.getCategories();
      if (catResponse.statusCode === '200') {
        setCategories(catResponse.data);
      } else {
        setError(catResponse.message);
      }

      const newsResponse = (view === 'all')
        ? await staffService.getNews()
        : await staffService.getNewsHistory();
      
      if (newsResponse.statusCode === '200') {
        setNewsList(newsResponse.data);
      } else {
        setError(newsResponse.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  }, [view]);

  useEffect(() => {
    fetchNewsAndCategories();
  }, [fetchNewsAndCategories]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput('');
    }
  };
  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleOpenCreateModal = () => {
    setEditingNews(null);
    setFormData(initialFormState);
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (news) => {
    setEditingNews(news);
    const category = categories.find(c => c.categoryName === news.categoryName);
    setFormData({
      newsTitle: news.newsTitle,
      headline: news.headline,
      newsContent: news.newsContent || '',
      newsSource: news.newsSource || '',
      categoryID: category ? category.categoryId : '',
      newsStatus: news.newsStatus,
      tags: news.tags || [],
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const dto = {
        ...formData,
        categoryID: parseInt(formData.categoryID)
      };
      
      let response;
      if (editingNews) {
        response = await staffService.updateNews(editingNews.newsArticleId, dto);
      } else {
        response = await staffService.createNews(dto);
      }
      if (response.statusCode === '200' || response.statusCode === '201') {
        fetchNewsAndCategories();
        handleCloseModal();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to save news.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      try {
        const response = await staffService.deleteNews(id);
        if (response.statusCode === '200') {
          fetchNewsAndCategories();
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err.message || 'Failed to delete news.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>News Management</h2>
        <button style={styles.button} onClick={handleOpenCreateModal}>
          Create New Article
        </button>
      </div>

      <div style={styles.toggleButtons}>
        <button 
          style={{...styles.toggleButton, ...(view === 'all' && styles.toggleButtonActive)}}
          onClick={() => setView('all')}
        >
          All News
        </button>
        <button 
          style={{...styles.toggleButton, ...(view === 'history' && styles.toggleButtonActive)}}
          onClick={() => setView('history')}
        >
          My History
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && !isModalOpen && <p style={styles.error}>{error}</p>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.thTd, ...styles.th }}>Title</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Category</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Author</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Status</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {newsList.map((news) => (
            <tr key={news.newsArticleId}>
              <td style={styles.thTd}>{news.newsTitle}</td>
              <td style={styles.thTd}>{news.categoryName}</td>
              <td style={styles.thTd}>{news.createdBy}</td>
              <td style={styles.thTd}>{news.newsStatus ? 'Active' : 'Inactive'}</td>
              <td style={styles.thTd}>
                <div style={styles.actions}>
                  <button style={styles.editButton} onClick={() => handleOpenEditModal(news)}>Edit</button>
                  <button style={styles.deleteButton} onClick={() => handleDelete(news.newsArticleId)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingNews ? 'Edit News Article' : 'Create News Article'}
      >
        <form onSubmit={handleSubmit}>
          {error && isModalOpen && <p style={styles.error}>{error}</p>}
          
          <div style={styles.formRow}>
            <label style={styles.label}>Title:</label>
            <input style={styles.input} type="text" name="newsTitle" value={formData.newsTitle} onChange={handleInputChange} required />
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>Headline (Mô tả ngắn):</label>
            <input style={styles.input} type="text" name="headline" value={formData.headline} onChange={handleInputChange} required />
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>Content:</label>
            <textarea style={styles.textarea} name="newsContent" value={formData.newsContent} onChange={handleInputChange} />
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>Category:</label>
            <select style={styles.select} name="categoryID" value={formData.categoryID} onChange={handleInputChange} required>
              <option value="">-- Select Category --</option>
              {categories.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
              ))}
            </select>
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>Tags (Nhấn Enter để thêm):</label>
            <div style={styles.tagContainer}>
              {formData.tags.map(tag => (
                <span key={tag} style={styles.tag}>
                  {tag}
                  <span style={styles.tagClose} onClick={() => removeTag(tag)}>&times;</span>
                </span>
              ))}
            </div>
            <input 
              style={styles.input} 
              type="text" 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Type tag and press Enter"
            />
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>News Source:</label>
            <input style={styles.input} type="text" name="newsSource" value={formData.newsSource} onChange={handleInputChange} />
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>
              <input type="checkbox" name="newsStatus" checked={formData.newsStatus} onChange={handleInputChange} />
              {' '}Active (Publish)
            </label>
          </div>
          
          <button type="submit" style={styles.button}>
            {editingNews ? 'Update' : 'Create'}
          </button>
        </form>
      </Modal>
    </div>
  );
}

// ⚠️ ĐẢM BẢO CÓ DÒNG NÀY ⚠️
export default NewsManagement;