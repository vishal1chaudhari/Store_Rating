const db = require('../config/db');

// ✅ Submit or Update Rating
exports.submitOrUpdateRating = (req, res) => {
  const { store_id, rating } = req.body;
  const user_id = req.user.id; // from JWT

  if (!store_id || !rating) {
    return res.status(400).json({ message: 'Store and rating are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  // Check if rating already exists
  const checkSql = `SELECT * FROM ratings WHERE user_id = ? AND store_id = ?`;

  db.query(checkSql, [user_id, store_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length > 0) {
      // ✅ Update existing rating
      const updateSql = `UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?`;
      db.query(updateSql, [rating, user_id, store_id], (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: 'Rating updated successfully' });
      });
    } else {
      // ✅ Insert new rating
      const insertSql = `INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)`;
      db.query(insertSql, [user_id, store_id, rating], (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: 'Rating submitted successfully' });
      });
    }
  });
};

// 📋 Get All Store Ratings for Logged-in User
exports.getUserRatingsForStores = (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT s.id AS store_id, s.name AS store_name, s.address, r.rating AS user_rating,
      ROUND((SELECT AVG(r2.rating) FROM ratings r2 WHERE r2.store_id = s.id), 1) AS average_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id AND r.user_id = ?
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};
