const db = require('../config/db');


exports.submitOrUpdateRating = async (req, res) => {
  try {
    console.log('Received rating request body:', req.body); // Debug log
    const { store_id, rating } = req.body;
    let user_id = req.user.id; 
    user_id = Number(user_id);
    const storeIdNum = Number(store_id);

    if (!storeIdNum || !rating) {
      return res.status(400).json({ message: 'Store and rating are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    console.log('About to check for existing rating:', { user_id, storeIdNum });
    const [results] = await db.query('SELECT * FROM ratings WHERE user_id = ? AND store_id = ?', [user_id, storeIdNum]);
    console.log('Check query results:', { results });

    if (results.length > 0) {
      console.log('About to update existing rating:', { user_id, storeIdNum, rating });
      await db.query('UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?', [rating, user_id, storeIdNum]);
      console.log('Rating updated successfully');
      return res.json({ message: 'Rating updated successfully' });
    } else {
      console.log('About to insert new rating:', { user_id, storeIdNum, rating });
      await db.query('INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)', [user_id, storeIdNum, rating]);
      console.log('Rating inserted successfully');
      return res.status(201).json({ message: 'Rating submitted successfully' });
    }
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ message: err.message });
  }
};


exports.getUserRatingsForStores = async (req, res) => {
  try {
    const user_id = req.user.id;

    const sql = `
      SELECT s.id AS store_id, s.name AS store_name, s.address, r.rating AS user_rating,
        ROUND((SELECT AVG(r2.rating) FROM ratings r2 WHERE r2.store_id = s.id), 1) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id AND r.user_id = ?
    `;

    const [results] = await db.query(sql, [user_id]);
    res.json(results);
  } catch (err) {
    console.error('Get user ratings error:', err);
    res.status(500).json({ message: err.message });
  }
};
