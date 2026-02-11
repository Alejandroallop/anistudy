const express = require('express');
const router = express.Router();
const {
  getQuests,
  createQuest,
  updateQuest,
  deleteQuest
} = require('../controllers/questController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // Todas las rutas requieren autenticación

router.route('/')
  .get(getQuests)
  .post(createQuest);

router.route('/:id')
  .put(updateQuest)
  .delete(deleteQuest);

module.exports = router;
