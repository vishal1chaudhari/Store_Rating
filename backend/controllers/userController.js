const db = require('../config/db');
const bcrypt = require('bcryptjs');


exports.addUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const allowedRoles = ['admin', 'store_owner', 'user'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO users (name, email, password, address, role)
                 VALUES (?, ?, ?, ?, ?)`;

    await db.query(sql, [name, email, hashedPassword, address, role]);
    res.status(201).json({ message: 'User added successfully' });
  } catch (err) {
    console.error('Add user error:', err);
    res.status(500).json({ message: err.message });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;

    let sql = 'SELECT id, name, email, address, role FROM users WHERE 1=1';
    const params = [];

    if (name) {
      sql += ' AND name LIKE ?';
      params.push(`%${name}%`);
    }
    if (email) {
      sql += ' AND email LIKE ?';
      params.push(`%${email}%`);
    }
    if (address) {
      sql += ' AND address LIKE ?';
      params.push(`%${address}%`);
    }
    if (role) {
      sql += ' AND role = ?';
      params.push(role);
    }

    const [results] = await db.query(sql, params);
    res.json(results);
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ message: err.message });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const sql = `SELECT u.id, u.name, u.email, u.address, u.role,
      (SELECT ROUND(AVG(r.rating), 1) FROM ratings r
       JOIN stores s ON r.store_id = s.id
       WHERE s.owner_id = u.id) AS store_rating
      FROM users u
      WHERE u.id = ?`;

    const [results] = await db.query(sql, [userId]);
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    if (user.role !== 'store_owner') {
      delete user.store_rating;
    }

    res.json(user);
  } catch (err) {
    console.error('Get user by ID error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const [stores] = await db.query('SELECT * FROM stores');
    res.json(stores);
  } catch (err) {
    console.error('Error fetching stores:', err);
    res.status(500).json({ message: 'Error fetching stores' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    
    if (newPassword.length < 8 || newPassword.length > 16) {
      return res.status(400).json({ message: 'Password must be 8-16 characters long' });
    }
    if (!/[A-Z]/.test(newPassword)) {
      return res.status(400).json({ message: 'Password must include at least one uppercase letter' });
    }
    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      return res.status(400).json({ message: 'Password must include at least one special character' });
    }

  
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];
    const bcrypt = require('bcryptjs');
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Update password error:', err);
    res.status(500).json({ message: 'Error updating password' });
  }
};
