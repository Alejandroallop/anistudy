const express = require('express');
const router = express.Router();
const {
  getResources,
  createResource,
  deleteResource
} = require('../controllers/resourceController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // Todas las rutas requieren autenticación

router.route('/')
  .get(getResources)
  .post(createResource);

router.route('/:id')
  .delete(deleteResource);

module.exports = router;
