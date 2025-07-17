const express = require('express');
const router = express.Router();
const {
  addUserByAdmin,
  getAllUsers,
  getUserById
} = require('../controllers/userController');

const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Only admin can access these routes
router.post('/add', verifyToken, checkRole('admin'), addUserByAdmin);
router.get('/', verifyToken, checkRole('admin'), getAllUsers);
router.get('/:id', verifyToken, checkRole('admin'), getUserById);

module.exports = router;
