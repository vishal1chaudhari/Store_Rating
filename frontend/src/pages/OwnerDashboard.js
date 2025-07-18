import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      const response = await axios.get('/owner/dashboard');
      setStoreData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching store data:', err);
      setError('Failed to load store data');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading store dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="container">
        <p>No store data available.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Store Owner Dashboard</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/update-password')} className="btn btn-secondary">
            Update Password
          </button>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>

      <div className="store-info">
        <h2>Store Information</h2>
        <div className="info-card">
          <p><strong>Store Name:</strong> {storeData.store.name}</p>
          <p><strong>Address:</strong> {storeData.store.address}</p>
          <p><strong>Average Rating:</strong> 
            <span className="rating">
              {storeData.average_rating ? `${storeData.average_rating}/5` : 'No ratings yet'}
            </span>
          </p>
        </div>
      </div>

      <div className="ratings-section">
        <h2>Users Who Rated This Store</h2>
        {storeData.users_rated && storeData.users_rated.length > 0 ? (
          <div className="users-list">
            {storeData.users_rated.map((user, index) => (
              <div key={index} className="user-card">
                <div className="user-info">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Rating:</strong> 
                    <span className="user-rating">
                      {user.rating}/5
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-ratings">No users have rated this store yet.</p>
        )}
      </div>

      <style>{`
        .container {
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #eee;
        }
        .title {
          font-size: 32px;
          font-weight: bold;
          color: #333;
          margin: 0;
        }
        .header-actions {
          display: flex;
          gap: 10px;
        }
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          transition: background-color 0.3s;
        }
        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }
        .btn-secondary:hover {
          background-color: #545b62;
        }
        .btn-danger {
          background-color: #dc3545;
          color: white;
        }
        .btn-danger:hover {
          background-color: #c82333;
        }
        .store-info, .ratings-section {
          margin-bottom: 30px;
        }
        .store-info h2, .ratings-section h2 {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 15px;
        }
        .info-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #007bff;
        }
        .info-card p {
          margin: 8px 0;
          font-size: 16px;
        }
        .rating, .user-rating {
          color: #ffc107;
          font-weight: bold;
          margin-left: 5px;
        }
        .users-list {
          display: grid;
          gap: 15px;
        }
        .user-card {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .user-info p {
          margin: 5px 0;
          font-size: 14px;
        }
        .no-ratings {
          text-align: center;
          color: #666;
          font-style: italic;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .error {
          color: #dc3545;
          text-align: center;
          padding: 20px;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default OwnerDashboard;
