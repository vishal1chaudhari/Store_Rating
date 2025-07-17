const express = require('express');
const router = express.Router();
const { getAdminDashboard, getStats, getAllUsers, getAllStores } = require('../controllers/adminController');

const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Admin Dashboard
router.get('/dashboard', verifyToken, checkRole('admin'), getAdminDashboard);
router.get('/stats', verifyToken, checkRole('admin'), getStats);
router.get('/users', verifyToken, checkRole('admin'), getAllUsers);   
router.get('/stores', verifyToken, checkRole('admin'), getAllStores); 

module.exports = router;
