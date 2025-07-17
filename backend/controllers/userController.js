const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Admin adds a new user (Admin or Store Owner)
exports.addUserByAdmin = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password || !address || !role)
    return res.status(400).json({ message: 'All fields required' });

  const allowedRoles = ['admin', 'store_owner', 'user'];
if (!allowedRoles.includes(role)) {
  return res.status(400).json({ message: 'Invalid role provided' });
}

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `INSERT INTO users (name, email, password, address, role)
               VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [name, email, hashedPassword, address, role], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    res.status(201).json({ message: 'User added successfully' });
  });
};

// Admin fetches all users with optional filters
exports.getAllUsers = (req, res) => {
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

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    res.json(results);
  });
};

// Admin gets a single user by ID
exports.getUserById = (req, res) => {
  const userId = req.params.id;

  const sql = `SELECT u.id, u.name, u.email, u.address, u.role,
    (SELECT ROUND(AVG(r.rating), 1) FROM ratings r
     JOIN stores s ON r.store_id = s.id
     WHERE s.owner_id = u.id) AS store_rating
    FROM users u
    WHERE u.id = ?`;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = results[0];

    // Only show rating if store_owner
    if (user.role !== 'store_owner') {
      delete user.store_rating;
    }

    res.json(user);
  });
};
