import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1 className="dashboard-title">User Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="card-grid">
        <div className="card" onClick={() => navigate('/all-stores')}>
          <h2 className="card-title">🔍 View & Rate Stores</h2>
          <p className="card-text">Browse stores and submit or update your ratings.</p>
        </div>

        <div className="card" onClick={() => navigate('/search-stores')}>
          <h2 className="card-title">🔎 Search Stores</h2>
          <p className="card-text">Search stores by name or address.</p>
        </div>

        <div className="card" onClick={() => navigate('/update-password')}>
          <h2 className="card-title">🔐 Update Password</h2>
          <p className="card-text">Change your account password securely.</p>
        </div>
      </div>

      <style>{`
        .dashboard-container {
          min-height: 100vh;
          padding: 2rem;
          background-color: #f3f4f6;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .dashboard-title {
          font-size: 2rem;
          font-weight: bold;
          text-align: left;
          margin: 0;
        }
        .logout-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }
        .logout-btn:hover {
          background: #c82333;
        }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        .card {
          background-color: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          transition: box-shadow 0.3s ease;
          cursor: pointer;
        }
        .card:hover {
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }
        .card-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .card-text {
          color: #555;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
