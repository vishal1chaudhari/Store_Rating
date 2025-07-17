const db = require('../config/db');

// 🧑‍💼 Store Owner Dashboard
exports.getStoreOwnerDashboard = (req, res) => {
  const ownerId = req.user.id;

  // Step 1: Find the store owned by this user
  const storeSql = `SELECT * FROM stores WHERE owner_id = ?`;

  db.query(storeSql, [ownerId], (err, stores) => {
    if (err) return res.status(500).json({ message: err.message });

    if (stores.length === 0) {
      return res.status(404).json({ message: 'No store found for this owner' });
    }

    const store = stores[0];

    // Step 2: Get average rating and list of users who rated this store
    const ratingsSql = `
      SELECT u.id AS user_id, u.name, u.email, r.rating
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
    `;

    const avgSql = `SELECT ROUND(AVG(rating), 1) AS average_rating FROM ratings WHERE store_id = ?`;

    db.query(ratingsSql, [store.id], (err, userRatings) => {
      if (err) return res.status(500).json({ message: err.message });

      db.query(avgSql, [store.id], (err, avgResult) => {
        if (err) return res.status(500).json({ message: err.message });

        res.json({
          store: {
            id: store.id,
            name: store.name,
            address: store.address
          },
          average_rating: avgResult[0]?.average_rating || 0,
          users_rated: userRatings
        });
      });
    });
  });
};
