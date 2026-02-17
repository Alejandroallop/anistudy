const Event = require('../models/Event');

// @desc    Obtener todos los eventos del usuario
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id }).sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Crear un nuevo evento
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const { title, date, start, type, allDay } = req.body;

    // Permitir tanto 'start' como 'date' para flexibilidad
    const eventStart = start || date;

    if (!title || !eventStart || !type) {
      return res.status(400).json({ message: 'Por favor rellena todos los campos obligatorios (title, start/date, type)' });
    }

    // Validar que el tipo sea válido
    if (!['exam', 'delivery', 'class'].includes(type)) {
      return res.status(400).json({ message: 'El tipo debe ser exam, delivery o class' });
    }

    const event = await Event.create({
      title,
      start: eventStart,
      type,
      allDay: allDay !== undefined ? allDay : true,
      user: req.user.id
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Eliminar evento
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Verificar que el usuario sea el dueño del evento
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    await event.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  createEvent,
  deleteEvent
};
