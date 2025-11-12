// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import * as staffService from '../services/staffService';

// CSS-in-JS
const styles = {
  container: { padding: '20px', maxWidth: '600px', margin: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  title: { margin: 0, marginBottom: '20px' },
  formRow: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
  input: { width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' },
  button: { padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
  error: { color: 'red', fontWeight: 'bold' },
  success: { color: 'green', fontWeight: 'bold' },
};

function ProfilePage() {
  const [formData, setFormData] = useState({ accountName: '' });
  const [email, setEmail] = useState(''); // Email không cho sửa
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await staffService.getProfile();
      if (response.statusCode === '200') {
        setFormData({ accountName: response.data.accountName });
        setEmail(response.data.accountEmail);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch profile.');
    } finally {
      setLoading(false);
    }
  };

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
    setSuccess('');
    try {
      // DTO của API PUT /profile/me chỉ cần 'accountName'
      const dto = { accountName: formData.accountName };
      const response = await staffService.updateProfile(dto);
      if (response.statusCode === '200') {
        setSuccess('Profile updated successfully!');
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Profile</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        
        <div style={styles.formRow}>
          <label style={styles.label}>Email:</label>
          <input 
            style={{...styles.input, backgroundColor: '#e9ecef'}} 
            type="email" 
            value={email} 
            disabled 
          />
        </div>
        
        <div style={styles.formRow}>
          <label style={styles.label}>Account Name:</label>
          <input
            style={styles.input}
            type="text"
            name="accountName"
            value={formData.accountName}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <button type="submit" style={styles.button}>
          Update Profile
        </button>
      </form>
    </div>
  );
}

// ⚠️ ĐẢM BẢO CÓ DÒNG NÀY ⚠️
export default ProfilePage;