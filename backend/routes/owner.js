const express = require('express');
const router = express.Router();
const { getStoreOwnerDashboard } = require('../controllers/ownerController');

const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.get('/dashboard', verifyToken, checkRole('store_owner'), getStoreOwnerDashboard);

module.exports = router;
