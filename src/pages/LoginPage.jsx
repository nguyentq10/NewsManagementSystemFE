// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth(); // Lấy hàm login từ Context
  const navigate = useNavigate(); // Dùng để chuyển trang

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login(email, password);

      if (success) {
        // Đăng nhập thành công, tự động chuyển hướng
        const role = localStorage.getItem('userRole');
        if (role === 'Admin') {
          navigate('/admin/dashboard');
        } else if (role === 'Staff') {
          navigate('/staff/dashboard');
        } else {
          navigate('/'); // Trang chủ
        }
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      // (err là object lỗi từ apiService)
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };
  
  // CSS đơn giản
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f4f4f4'
    },
    formWrapper: {
      padding: '30px',
      borderRadius: '8px',
      backgroundColor: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      width: '350px'
    },
    title: { textAlign: 'center', margin: 0, marginBottom: '20px' },
    formRow: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
    input: { width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' },
    button: { width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
    error: { color: 'red', textAlign: 'center', marginTop: '10px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formRow}>
            <label style={styles.label}>Email: </label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.formRow}>
            <label style={styles.label}>Password: </label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button style={styles.button} type="submit">Login</button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;