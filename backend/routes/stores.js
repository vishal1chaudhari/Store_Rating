const express = require('express');
const router = express.Router();
const {
  addStore,
  getStores
} = require('../controllers/storeController');

const { verifyToken, checkRole } = require('../middleware/authMiddleware');


router.post('/add', verifyToken, checkRole('admin'), addStore);
router.get('/', verifyToken, checkRole('admin'), getStores);

module.exports = router;
