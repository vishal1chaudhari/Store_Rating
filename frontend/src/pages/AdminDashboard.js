
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  
  const [userFilters, setUserFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: ''
  });

  const [storeFilters, setStoreFilters] = useState({
    name: '',
    email: '',
    address: ''
  });

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user'
  });

  const [newStore, setNewStore] = useState({
    name: '',
    email: '',
    address: '',
    owner_id: ''
  });

  const [userError, setUserError] = useState('');
  const [userSuccess, setUserSuccess] = useState('');
  const [storeMessage, setStoreMessage] = useState('');

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleStorageChange = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await axios.get('/admin/stores');
      setStores(res.data);
    } catch (err) {
      console.error('Error fetching stores:', err);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const res = await axios.get(`/admin/users/${userId}`);
      setSelectedUser(res.data);
      setShowUserModal(true);
    } catch (err) {
      console.error('Error fetching user details:', err);
      alert('Failed to fetch user details');
    }
  };

  const validateUserForm = () => {
    const { name, email, password, address } = newUser;
    
    if (name.length < 20 || name.length > 60) {
      setUserError('Name must be 20-60 characters long');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setUserError('Invalid email format');
      return false;
    }
    if (address.length > 400) {
      setUserError('Address must be 400 characters or less');
      return false;
    }
    if (password.length < 8 || password.length > 16 || !/[A-Z]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      setUserError('Password must be 8-16 characters, include uppercase & special character');
      return false;
    }
    return true;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setUserError('');
    setUserSuccess('');

    if (!validateUserForm()) {
      return;
    }

    try {
      await axios.post('/users/add', newUser);
      setUserSuccess('User added successfully!');
      setNewUser({ name: '', email: '', address: '', password: '', role: 'user' });
      fetchUsers();
      fetchStats();
      setTimeout(() => setUserSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setUserError(err.response?.data?.message || 'Failed to add user');
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    setStoreMessage('');
    
    if (!newStore.name || !newStore.email || !newStore.address || !newStore.owner_id) {
      setStoreMessage('All fields are required');
      return;
    }

    try {
      const res = await axios.post('/stores/add', newStore);
      setStoreMessage('Store added successfully!');
      setNewStore({ name: '', email: '', address: '', owner_id: '' });
      fetchStores();
      fetchStats();
    } catch (err) {
      console.error(err);
      setStoreMessage(err.response?.data?.message || 'Failed to add store');
    }
  };

  const filteredUsers = users.filter(user => {
    return (
      user.name.toLowerCase().includes(userFilters.name.toLowerCase()) &&
      user.email.toLowerCase().includes(userFilters.email.toLowerCase()) &&
      user.address.toLowerCase().includes(userFilters.address.toLowerCase()) &&
      (userFilters.role === '' || user.role === userFilters.role)
    );
  });

  const filteredStores = stores.filter(store => {
    return (
      store.name.toLowerCase().includes(storeFilters.name.toLowerCase()) &&
      store.email.toLowerCase().includes(storeFilters.email.toLowerCase()) &&
      store.address.toLowerCase().includes(storeFilters.address.toLowerCase())
    );
  });

  useEffect(() => {
    const init = async () => {
      await fetchStats();
      await fetchUsers();
      await fetchStores();
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return <div className="loading">Loading Dashboard...</div>;

  return (
    <div className="admin-container">
      <div className="header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.users}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-content">
            <h3>{stats.stores}</h3>
            <p>Total Stores</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{stats.ratings}</h3>
            <p>Total Ratings</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Add New User</h2>
        <form onSubmit={handleAddUser} className="form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Name (20-60 characters)"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
              className="form-input"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
              className="form-input"
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Address (max 400 characters)"
              value={newUser.address}
              onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
              required
              className="form-input"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="form-input"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>
          <div className="form-row">
            <input
              type="password"
              placeholder="Password (8-16 chars, uppercase + special)"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
              className="form-input"
            />
            <button type="submit" className="btn btn-primary">Add User</button>
          </div>
        </form>
        {userError && <div className="error-message">{userError}</div>}
        {userSuccess && <div className="success-message">{userSuccess}</div>}
      </div>

      <div className="section">
        <h2>User Management</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Filter by name"
            value={userFilters.name}
            onChange={(e) => setUserFilters({ ...userFilters, name: e.target.value })}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Filter by email"
            value={userFilters.email}
            onChange={(e) => setUserFilters({ ...userFilters, email: e.target.value })}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Filter by address"
            value={userFilters.address}
            onChange={(e) => setUserFilters({ ...userFilters, address: e.target.value })}
            className="filter-input"
          />
          <select
            value={userFilters.role}
            onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}
            className="filter-input"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => fetchUserDetails(user.id)}
                      className="btn btn-small btn-secondary"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2>Add New Store</h2>
        <form onSubmit={handleAddStore} className="form">
          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Store Name"
              value={newStore.name}
              onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
              required
              className="form-input"
            />
            <input
              type="email"
              name="email"
              placeholder="Store Email"
              value={newStore.email}
              onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
              required
              className="form-input"
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newStore.address}
              onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
              required
              className="form-input"
            />
            <select
              name="owner_id"
              value={newStore.owner_id}
              onChange={(e) => setNewStore({ ...newStore, owner_id: e.target.value })}
              required
              className="form-input"
            >
              <option value="">Select Store Owner</option>
              {users.filter(u => u.role === 'store_owner').map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <button type="submit" className="btn btn-primary">Add Store</button>
          </div>
        </form>
        {storeMessage && (
          <div className={storeMessage.includes('successfully') ? 'success-message' : 'error-message'}>
            {storeMessage}
          </div>
        )}
      </div>

      <div className="section">
        <h2>Store Management</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Filter by name"
            value={storeFilters.name}
            onChange={(e) => setStoreFilters({ ...storeFilters, name: e.target.value })}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Filter by email"
            value={storeFilters.email}
            onChange={(e) => setStoreFilters({ ...storeFilters, email: e.target.value })}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Filter by address"
            value={storeFilters.address}
            onChange={(e) => setStoreFilters({ ...storeFilters, address: e.target.value })}
            className="filter-input"
          />
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Average Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store) => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.email}</td>
                  <td>{store.address}</td>
                  <td>{store.avgRating && !isNaN(Number(store.avgRating)) && Number(store.avgRating) > 0 ? `${Number(store.avgRating).toFixed(1)}/5` : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
      {showUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Details</h3>
              <button onClick={() => setShowUserModal(false)} className="close-btn">&times;</button>
            </div>
            <div className="modal-body">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Address:</strong> {selectedUser.address}</p>
              <p><strong>Role:</strong> 
                <span className={`role-badge role-${selectedUser.role}`}>
                  {selectedUser.role}
                </span>
              </p>
              {selectedUser.role === 'store_owner' && selectedUser.store_rating && (
                <p><strong>Store Rating:</strong> {selectedUser.store_rating}/5</p>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
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
        .header h1 {
          margin: 0;
          color: #333;
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
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .stat-card {
          background-color:  #007bff;
          color: white;
          padding: 30px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .stat-icon {
          font-size: 3rem;
          margin-right: 20px;
        }
        .stat-content h3 {
          margin: 0;
          font-size: 2.5rem;
          font-weight: bold;
        }
        .stat-content p {
          margin: 5px 0 0 0;
          opacity: 0.9;
        }
        .section {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }
        .section h2 {
          margin-top: 0;
          color: #333;
          border-bottom: 2px solid #eee;
          padding-bottom: 10px;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          align-items: end;
        }
        .form-input {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
        }
        .form-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }
        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s;
        }
        .btn-primary {
          background: #007bff;
          color: white;
        }
        .btn-primary:hover {
          background: #0056b3;
        }
        .btn-secondary {
          background: #6c757d;
          color: white;
        }
        .btn-secondary:hover {
          background: #545b62;
        }
        .btn-small {
          padding: 6px 12px;
          font-size: 12px;
        }
        .filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        .filter-input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
        }
        .table-container {
          overflow-x: auto;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .data-table th,
        .data-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        .data-table th {
          background: #f8f9fa;
          font-weight: bold;
          color: #333;
        }
        .data-table tr:hover {
          background: #f8f9fa;
        }
        .role-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .role-user {
          background: #e3f2fd;
          color: #1976d2;
        }
        .role-admin {
          background: #fff3e0;
          color: #f57c00;
        }
        .role-store_owner {
          background: #e8f5e8;
          color: #388e3c;
        }
        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 5px;
          margin-top: 10px;
        }
        .success-message {
          background: #d4edda;
          color: #155724;
          padding: 12px;
          border-radius: 5px;
          margin-top: 10px;
        }
        .loading {
          text-align: center;
          padding: 50px;
          font-size: 18px;
          color: #666;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          border-radius: 10px;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #eee;
        }
        .modal-header h3 {
          margin: 0;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }
        .modal-body {
          padding: 20px;
        }
        .modal-body p {
          margin: 10px 0;
        }
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          .filters {
            grid-template-columns: 1fr;
          }
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
