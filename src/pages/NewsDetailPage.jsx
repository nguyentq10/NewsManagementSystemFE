// src/pages/NewsDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as publicNewsService from '../services/publicNewsService';

// CSS-in-JS
const styles = {
  container: { padding: '20px', maxWidth: '800px', margin: 'auto' },
  backButton: {
    padding: '8px 15px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginBottom: '20px',
  },
  title: { fontSize: '2.5rem', marginBottom: '10px' },
  meta: {
    fontSize: '0.9rem',
    color: '#888',
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
  content: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
  },
  error: { color: 'red', textAlign: 'center' },
  
  // ⚠️ STYLE MỚI CHO TAGS ⚠️
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '20px',
  },
  tag: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '5px 12px',
    borderRadius: '15px',
    fontSize: '0.9rem',
  },
};

function NewsDetailPage() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams(); // Lấy 'id' từ URL
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  const fetchArticle = async (articleId) => {
    setLoading(true);
    try {
      const response = await publicNewsService.getPublicNewsById(articleId);
      if (response.statusCode === '200') {
        setArticle(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Article not found.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading article...</p>;
  if (error) return <p style={styles.error}>{error}</p>;
  if (!article) return null;

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      
      <h1 style={styles.title}>{article.newsTitle}</h1>
      
      <div style={styles.meta}>
        <strong>Category:</strong> {article.categoryName} | 
        <strong> Source:</strong> {article.newsSource || 'N/A'} | 
        <strong> Date:</strong> {new Date(article.createdDate).toLocaleString()}
      </div>
      
      {/* ⚠️ HIỂN THỊ TAGS Ở ĐÂY ⚠️ */}
      {article.tags && article.tags.length > 0 && (
        <div style={styles.tagContainer}>
          <strong>Tags:</strong>
          {article.tags.map((tag) => (
            <span key={tag} style={styles.tag}>{tag}</span>
          ))}
        </div>
      )}

      <div
        style={styles.content}
        dangerouslySetInnerHTML={{ __html: article.newsContent }}
      />
    </div>
  );
}

export default NewsDetailPage;