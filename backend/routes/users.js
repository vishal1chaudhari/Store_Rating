const express = require('express');
const router = express.Router();
const {
  addUserByAdmin,
  getAllUsers,
  getUserById, 
  getAllStores,
  updatePassword
} = require('../controllers/userController');

const { verifyToken, checkRole } = require('../middleware/authMiddleware');


router.post('/add', verifyToken, checkRole('admin'), addUserByAdmin);
router.get('/all', verifyToken, checkRole('admin'), getAllUsers);
router.get('/:id', verifyToken, checkRole('admin'), getUserById);


router.get('/stores', verifyToken, checkRole('user'), getAllStores);
router.post('/update-password', verifyToken, checkRole(['user', 'store_owner']), updatePassword);

module.exports = router;
