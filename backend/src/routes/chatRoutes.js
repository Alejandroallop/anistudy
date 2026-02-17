const express = require('express');
const router = express.Router();
const { askSensei } = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');

// POST /api/chat - Enviar mensaje al Sensei IA
router.post('/', protect, askSensei);

module.exports = router;
