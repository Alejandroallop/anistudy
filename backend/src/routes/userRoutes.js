const express = require('express');
const router = express.Router();
const { getStats, addFocusTime } = require('../controllers/statsController');
const { protect } = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(protect);

// GET /api/users/stats - Obtener estadísticas del usuario
router.get('/stats', getStats);

// POST /api/users/focus-time - Registrar tiempo de Pomodoro completado
router.post('/focus-time', addFocusTime);

module.exports = router;
