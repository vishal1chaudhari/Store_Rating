// --- AdminDashboard.js ---
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {

  const navigate = useNavigate();
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


  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);


  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user'
  });

  const [userError, setUserError] = useState('');
  const [userSuccess, setUserSuccess] = useState('');

  const [newStore, setNewStore] = useState({
    name: '',
    email: '',
    address: '',
    owner_id: ''
  });
  const [storeMessage, setStoreMessage] = useState('');

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
      console.log('Fetched users:', res.data); // ✅ Add this
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err); // ✅ Check if error occurs
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

  const handleStoreChange = (e) => {
    setNewStore({ ...newStore, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setUserError('');
    setUserSuccess('');

    const { name, email, password, address, role } = newUser;

    if (name.length < 3 || name.length > 60) {
      return setUserError('Name must be 3 to 60 characters.');
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return setUserError('Invalid email format.');
    }
    if (address.length > 400) {
      return setUserError('Address too long.');
    }
    if (password.length < 8 || password.length > 16 || !/[A-Z]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      return setUserError('Password must be 8–16 chars, include uppercase & special char.');
    }

    try {
      await axios.post('/users/add', newUser);
      alert("User added successfully");
      setNewUser({ name: '', email: '', address: '', password: '', role: 'user' });
      fetchUsers();
      fetchStats();
      console.log("User added successfully");
      setTimeout(() => setUserSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setUserError(err.response?.data?.message || 'Failed to add user');
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    setStoreMessage('');
    try {
      const res = await axios.post('/stores/add', newStore);
      setStoreMessage('Store added successfully!');
      setNewStore({ name: '', email: '', address: '', owner_id: '' });
      fetchStores();
    } catch (err) {
      console.error(err);
      setStoreMessage(err.response?.data?.message || 'Failed to add store');
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchStats();
      await fetchUsers();
      await fetchStores();
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading Dashboard...</p>;

  return (
    <div style={styles.container}>
      <h2>Admin Dashboard</h2>

      <div style={styles.stats}>
        <div style={styles.card}>👥 Users: {stats.users}</div>
        <div style={styles.card}>🏪 Stores: {stats.stores}</div>
        <div style={styles.card}>⭐ Ratings: {stats.ratings}</div>
      </div>

      <h3>👤 Add New User</h3>
      <form onSubmit={handleAddUser} style={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          required
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Address"
          value={newUser.address}
          onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
          style={styles.input}
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          style={styles.input}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="store_owner">Store Owner</option>
        </select>
        <button type="submit" style={styles.button}>Add User</button>
      </form>

      {userError && <p style={{ color: 'red' }}>{userError}</p>}
      {userSuccess && <p style={{ color: 'green', fontWeight: 'bold' }}>{userSuccess}</p>}



      <h3 style={{ marginTop: '30px' }}>📄 User List</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Address</th><th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr style={styles.tr} key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.address}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />

      <h3 style={{ marginTop: '30px' }}>➕ Add New Store</h3>
      <form onSubmit={handleAddStore} style={styles.form}>
        <input type="text" name="name" placeholder="Store Name" value={newStore.name} onChange={handleStoreChange} required style={styles.input} />
        <input type="email" name="email" placeholder="Store Email" value={newStore.email} onChange={handleStoreChange} required style={styles.input} />
        <input type="text" name="address" placeholder="Address" value={newStore.address} onChange={handleStoreChange} required style={styles.input} />
        <select name="owner_id" value={newStore.owner_id} onChange={handleStoreChange} required style={styles.input}>
          <option value="">Select Store Owner</option>
          {users.filter(u => u.role === 'store_owner').map((u) => (
            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
          ))}
        </select>
        <button type="submit" style={styles.button}>Add Store</button>
      </form>
      {storeMessage && <p style={{ color: storeMessage.includes('successfully') ? 'green' : 'red' }}>{storeMessage}</p>}

      <h3 style={{ marginTop: '30px' }}>🏪 Store List</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Address</th><th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr style={styles.tr} key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>{s.avgRating?.toFixed(1) || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '20px',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '30px',
  },
  card: {
    background: '#007bff',
    color: 'white',
    padding: '20px',
    borderRadius: '10px',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    backgroundColor: '#f2f2f2',
    textAlign: 'center',
  },
  tr: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
  },

  input: {
    padding: '10px',
    fontSize: '16px',
    margin: '5px 0',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },
  button: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};
