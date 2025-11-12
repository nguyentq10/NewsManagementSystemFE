// src/pages/ReportPage.jsx
import React, { useState } from 'react';
import * as adminService from '../services/adminService';

// CSS-in-JS (Giao diện đẹp)
const styles = {
  container: { padding: '20px', maxWidth: '1000px', margin: 'auto' },
  title: { margin: 0, marginBottom: '20px' },
  filterContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  datePicker: { padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' },
  button: {
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  table: { width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  thTd: { border: '1px solid #ddd', padding: '12px', textAlign: 'left' },
  th: { backgroundColor: '#f4f4f4' },
  error: { color: 'red', fontWeight: 'bold' },
};

function ReportPage() {
  const [reportData, setReportData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      setError('Start Date and End Date are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await adminService.getStatisticsReport(startDate, endDate);
      if (response.statusCode === '200') {
        setReportData(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Statistics Report</h2>
      
      <div style={styles.filterContainer}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Start Date: </label>
          <input
            type="date"
            style={styles.datePicker}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>End Date: </label>
          <input
            type="date"
            style={styles.datePicker}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button style={styles.button} onClick={handleGenerateReport}>
          Generate Report
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.thTd, ...styles.th }}>Article ID</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Title</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Created Date</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Author</th>
            <th style={{ ...styles.thTd, ...styles.th }}>Category</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((item) => (
            <tr key={item.newsArticleId}>
              <td style={styles.thTd}>{item.newsArticleId}</td>
              <td style={styles.thTd}>{item.newsTitle}</td>
              <td style={styles.thTd}>{new Date(item.createdDate).toLocaleDateString()}</td>
              <td style={styles.thTd}>{item.createdByAccountName}</td>
              <td style={styles.thTd}>{item.categoryName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportPage;