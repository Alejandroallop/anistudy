const Resource = require('../models/Resource');

// Asignar icon automáticamente según el tipo
const getIconByType = (type) => {
  const iconMap = {
    'PDF': 'pi pi-file-pdf',
    'Video': 'pi pi-video',
    'Link': 'pi pi-link'
  };
  return iconMap[type] || 'pi pi-file';
};

// @desc    Obtener todos los recursos del usuario
// @route   GET /api/resources
// @access  Private
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Crear un nuevo recurso
// @route   POST /api/resources
// @access  Private
const createResource = async (req, res) => {
  try {
    const { name, type, description, url } = req.body;

    if (!name || !type || !url) {
      return res.status(400).json({ message: 'Por favor rellena todos los campos obligatorios (name, type, url)' });
    }

    // Validar que el tipo sea válido
    if (!['PDF', 'Link', 'Video'].includes(type)) {
      return res.status(400).json({ message: 'El tipo debe ser PDF, Link o Video' });
    }

    // Asignar el icon automáticamente según el tipo
    const icon = getIconByType(type);

    const resource = await Resource.create({
      name,
      type,
      icon,
      description: description || '',
      url,
      user: req.user.id
    });

    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Eliminar recurso
// @route   DELETE /api/resources/:id
// @access  Private
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Recurso no encontrado' });
    }

    // Verificar que el usuario sea el dueño del recurso
    if (resource.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    await resource.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getResources,
  createResource,
  deleteResource
};
