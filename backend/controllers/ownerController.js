const db = require('../config/db');


exports.getStoreOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    
    const [stores] = await db.query('SELECT * FROM stores WHERE owner_id = ?', [ownerId]);

    if (stores.length === 0) {
      return res.status(404).json({ message: 'No store found for this owner' });
    }

    const store = stores[0];

    const ratingsSql = `
      SELECT u.id AS user_id, u.name, u.email, r.rating
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
    `;

    const avgSql = `SELECT ROUND(AVG(rating), 1) AS average_rating FROM ratings WHERE store_id = ?`;

    const [userRatings] = await db.query(ratingsSql, [store.id]);
    const [avgResult] = await db.query(avgSql, [store.id]);

    res.json({
      store: {
        id: store.id,
        name: store.name,
        address: store.address
      },
      average_rating: avgResult[0]?.average_rating || 0,
      users_rated: userRatings
    });
  } catch (err) {
    console.error('Store owner dashboard error:', err);
    res.status(500).json({ message: err.message });
  }
};
