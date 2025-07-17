const db = require('../config/db');

// ➕ Add Store
exports.addStore = (req, res) => {
  const { name, email, address, owner_id } = req.body;

  if (!name || !email || !address || !owner_id) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = `INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`;
  db.query(sql, [name, email, address, owner_id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    res.status(201).json({ message: 'Store added successfully' });
  });
};

// 📋 Get All Stores (with filters + avg rating)
exports.getStores = (req, res) => {
  const { name, email, address } = req.query;

  let sql = `
    SELECT s.id, s.name, s.email, s.address, u.name AS owner_name,
      ROUND(AVG(r.rating), 1) AS average_rating
    FROM stores s
    LEFT JOIN users u ON s.owner_id = u.id
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE 1=1
  `;

  const params = [];

  if (name) {
    sql += ' AND s.name LIKE ?';
    params.push(`%${name}%`);
  }

  if (email) {
    sql += ' AND s.email LIKE ?';
    params.push(`%${email}%`);
  }

  if (address) {
    sql += ' AND s.address LIKE ?';
    params.push(`%${address}%`);
  }

  sql += ' GROUP BY s.id ORDER BY s.name ASC';

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};
