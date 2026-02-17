const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  deleteEvent
} = require('../controllers/eventController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // Todas las rutas requieren autenticación

router.route('/')
  .get(getEvents)
  .post(createEvent);

router.route('/:id')
  .delete(deleteEvent);

module.exports = router;
