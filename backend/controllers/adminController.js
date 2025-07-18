const db = require('../config/db');

exports.getAdminDashboard = (req, res) => {
  const stats = {
    total_users: 0,
    total_stores: 0,
    total_ratings: 0,
  };

  
  const userQuery = `SELECT COUNT(*) AS count FROM users`;
  const storeQuery = `SELECT COUNT(*) AS count FROM stores`;
  const ratingQuery = `SELECT COUNT(*) AS count FROM ratings`;

  db.query(userQuery, (err, userResult) => {
    if (err) return res.status(500).json({ message: err.message });

    stats.total_users = userResult[0].count;

    db.query(storeQuery, (err, storeResult) => {
      if (err) return res.status(500).json({ message: err.message });

      stats.total_stores = storeResult[0].count;

      db.query(ratingQuery, (err, ratingResult) => {
        if (err) return res.status(500).json({ message: err.message });

        stats.total_ratings = ratingResult[0].count;

        res.json(stats);
      });
    });
  });
};

exports.getStats = async (req, res) => {
  try {
    const [userRows] = await db.query(`SELECT COUNT(*) AS count FROM users`);
    const [storeRows] = await db.query(`SELECT COUNT(*) AS count FROM stores`);
    const [ratingRows] = await db.query(`SELECT COUNT(*) AS count FROM ratings`);

    res.json({
      users: userRows[0].count,
      stores: storeRows[0].count,
      ratings: ratingRows[0].count
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, address, role FROM users');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const [stores] = await db.query(`
      SELECT s.id, s.name, s.email, s.address, 
             COALESCE(ROUND(AVG(r.rating), 1), 0) AS avgRating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id, s.name, s.email, s.address
      ORDER BY s.name ASC
    `);
    res.json(stores);
  } catch (err) {
    console.error('Error fetching stores:', err);
    res.status(500).json({ message: 'Error fetching stores' });
  }
};


