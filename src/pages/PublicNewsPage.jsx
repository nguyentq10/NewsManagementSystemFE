// src/pages/PublicNewsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as publicNewsService from '../services/publicNewsService';
import { useAuth } from '../hooks/useAuth';

// CSS-in-JS
const styles = {
  container: { padding: '20px', maxWidth: '1200px', margin: 'auto' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: { textAlign: 'center', margin: 0, flex: 1 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex', // (Để căn chỉnh meta xuống cuối)
    flexDirection: 'column', // (Để căn chỉnh meta xuống cuối)
  },
  cardContent: {
    flex: 1, // (Để căn chỉnh meta xuống cuối)
  },
  cardTitle: { margin: 0, fontSize: '1.25rem', color: '#007bff' },
  cardHeadline: { fontSize: '0.9rem', color: '#555', marginTop: '10px' },
  
  // ⚠️ STYLE MỚI CHO TAGS TRÊN CARD ⚠️
  cardTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginTop: '10px',
  },
  cardTag: {
    backgroundColor: '#6c757d', // Màu xám
    color: 'white',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '0.75rem',
  },
  // ---------------------------------
  
  cardMeta: {
    fontSize: '0.8rem',
    color: '#888',
    marginTop: '15px',
    paddingTop: '10px',
    borderTop: '1px solid #eee', // Tách biệt meta
    display: 'flex',
    justifyContent: 'space-between',
  },
  error: { color: 'red', textAlign: 'center' },
  loginButton: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    textDecoration: 'none',
  },
};

function PublicNewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await publicNewsService.getPublicNews();
      if (response.statusCode === '200') {
        setNewsList(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch news.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/news/${id}`); 
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>FUNews Home Page</h1>
        {!user && (
          <Link to="/login" style={styles.loginButton}>
            Login
          </Link>
        )}
      </div>

      {loading && <p>Loading news...</p>}
      {error && <p style={styles.error}>{error}</p>}
      
      <div style={styles.grid}>
        {newsList.map((news) => (
          <div
            key={news.newsArticleId}
            style={styles.card}
            onClick={() => handleCardClick(news.newsArticleId)}
            onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)')}
            onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)')}
          >
            <div style={styles.cardContent}>
              <h3 style={styles.cardTitle}>{news.newsTitle}</h3>
              <p style={styles.cardHeadline}>{news.headline}</p>

              {/* ⚠️ HIỂN THỊ TAGS Ở ĐÂY ⚠️ */}
              {news.tags && news.tags.length > 0 && (
                <div style={styles.cardTags}>
                  {news.tags.map(tag => (
                    <span key={tag} style={styles.cardTag}>{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <div style={styles.cardMeta}>
              <span>{news.categoryName}</span>
              <span>{new Date(news.createdDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PublicNewsPage;