// src/pages/PublicNewsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 1. Import 'Link'
import * as publicNewsService from '../services/publicNewsService';
import { useAuth } from '../hooks/useAuth'; // 2. Import 'useAuth'

// CSS-in-JS
const styles = {
  container: { padding: '20px', maxWidth: '1200px', margin: 'auto' },
  header: { // Vùng header để chứa Title và Nút
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: { textAlign: 'center', margin: 0, flex: 1 }, // flex: 1 để đẩy nút ra xa
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
  },
  cardTitle: { margin: 0, fontSize: '1.25rem', color: '#007bff' },
  cardHeadline: { fontSize: '0.9rem', color: '#555', marginTop: '10px' },
  cardMeta: {
    fontSize: '0.8rem',
    color: '#888',
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  error: { color: 'red', textAlign: 'center' },
  // 3. Style cho nút Login
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
  const { user } = useAuth(); // Lấy trạng thái đăng nhập

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
    navigate(`/news/${id}`); // Chuyển đến trang chi tiết
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>FUNews Home Page</h1>

        {/* 4. THÊM NÚT LOGIN Ở ĐÂY */}
        {/* Chỉ hiển thị nếu user CHƯA đăng nhập */}
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
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <h3 style={styles.cardTitle}>{news.newsTitle}</h3>
            <p style={styles.cardHeadline}>{news.headline}</p>
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