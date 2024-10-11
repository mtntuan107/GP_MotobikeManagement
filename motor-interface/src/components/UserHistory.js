import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiURL from '../api/api'; // Assuming this file contains the API base URL
import '../styles/History.css';

const UserHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch maintenance history data from the API
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${apiURL}/maintenance/user_maintenance_history/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHistoryData(response.data);
      } catch (err) {
        console.error('Error fetching maintenance history:', err);
        setError('Failed to load maintenance history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Render loading, error, or the table
  return (
    <div>
      <h1>Maintenance History</h1>

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table className="history-table" border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Employee</th>
              <th>Motorbike</th>
              <th>Part</th>
              <th>Maintenance Type</th>
            </tr>
          </thead>
          <tbody>
            {historyData.length > 0 ? (
              historyData.map((history) => (
                <tr key={history.id}>
                  <td>{history.day}</td>
                  <td>{history.description}</td>
                  <td>{history.employeename}</td>
                  <td>{history.motorbikebrand}</td>
                  <td>{history.partmmname}</td>
                  <td>{history.typename}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  No history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserHistory;
