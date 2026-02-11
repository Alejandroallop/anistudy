const Quest = require('../models/Quest');

// @desc    Obtener todas las misiones del usuario
// @route   GET /api/quests
// @access  Private
const getQuests = async (req, res) => {
  try {
    const quests = await Quest.find({ user: req.user.id });
    res.status(200).json(quests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Crear una nueva misión
// @route   POST /api/quests
// @access  Private
const createQuest = async (req, res) => {
  try {
    const { title, description, rank, xp } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Por favor rellena todos los campos' });
    }

    const quest = await Quest.create({
      title,
      description,
      rank: rank || 'C',
      xp: xp || 10,
      user: req.user.id
    });

    res.status(201).json(quest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Actualizar misión (marcar como completada)
// @route   PUT /api/quests/:id
// @access  Private
const updateQuest = async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id);

    if (!quest) {
      return res.status(404).json({ message: 'Misión no encontrada' });
    }

    // Verificar que el usuario sea el dueño de la misión
    if (quest.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const updatedQuest = await Quest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedQuest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Eliminar misión
// @route   DELETE /api/quests/:id
// @access  Private
const deleteQuest = async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id);

    if (!quest) {
      return res.status(404).json({ message: 'Misión no encontrada' });
    }

    // Verificar que el usuario sea el dueño de la misión
    if (quest.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    await quest.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuests,
  createQuest,
  updateQuest,
  deleteQuest
};
