const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');

// Todas las rutas del dashboard están protegidas
router.get('/', protect, getDashboardData);

module.exports = router;
