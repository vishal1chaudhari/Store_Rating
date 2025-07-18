const express = require('express');
const router = express.Router();
const {
  submitOrUpdateRating,
  getUserRatingsForStores
} = require('../controllers/ratingController');

const { verifyToken, checkRole } = require('../middleware/authMiddleware');
router.post('/submit', verifyToken, checkRole('user'), submitOrUpdateRating);
router.get('/', verifyToken, checkRole('user'), getUserRatingsForStores);

module.exports = router;
