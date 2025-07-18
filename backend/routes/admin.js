const express = require('express');
const router = express.Router();
const { getAdminDashboard, getStats, getAllUsers, getAllStores } = require('../controllers/adminController');
const { getUserById } = require('../controllers/userController');

const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.get('/dashboard', verifyToken, checkRole('admin'), getAdminDashboard);
router.get('/stats', verifyToken, checkRole('admin'), getStats);
router.get('/users', verifyToken, checkRole('admin'), getAllUsers);   
router.get('/stores', verifyToken, checkRole('admin'), getAllStores); 
router.get('/users/:id', verifyToken, checkRole('admin'), getUserById);

module.exports = router;
