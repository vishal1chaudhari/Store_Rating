const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/stores', async (req, res) => {
  try {
    const [stores] = await db.query('SELECT * FROM stores');
    res.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/search', async (req, res) => {
  try {
    const { name, address } = req.query;
    let sql = 'SELECT * FROM stores WHERE 1=1';
    const params = [];

    if (name) {
      sql += ' AND name LIKE ?';
      params.push(`%${name}%`);
    }

    if (address) {
      sql += ' AND address LIKE ?';
      params.push(`%${address}%`);
    }

    const [stores] = await db.query(sql, params);
    res.json(stores);
  } catch (error) {
    console.error('Error searching stores:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
