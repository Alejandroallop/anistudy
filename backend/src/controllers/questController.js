const Quest = require('../models/Quest');
const User  = require('../models/User');

// @desc    Obtener todas las misiones del usuario
// @route   GET /api/quests
// @access  Private
const getQuests = async (req, res) => {
  try {
    const quests = await Quest.find({ user: req.user._id });
    res.status(200).json(quests);
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
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
      user: req.user._id
    });

    res.status(201).json(quest);
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
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
    if (quest.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const updatedQuest = await Quest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // ============================================================
    // 🎮 MOTOR DE GAMIFICACIÓN RPG
    // ============================================================
    if (req.body.status === 'completed' && quest.status !== 'completed') {
      try {
        const user = await User.findById(req.user._id);

        if (user) {
          // Sumar XP de la misión
          user.xp = (user.xp || 0) + (updatedQuest.xp || 0);

          // Incrementar tareas completadas
          if (!user.stats) user.stats = { tasksCompleted: 0, streak: 0 };
          user.stats.tasksCompleted = (user.stats.tasksCompleted || 0) + 1;

          // Asegurar que existen los atributos
          if (!user.attributes) {
            user.attributes = { intelligence: 10, discipline: 10, creativity: 10 };
          }

          // Bucle de subida de nivel
          let xpNeeded = (user.level * 100) + 100;
          while (user.xp >= xpNeeded) {
            user.xp     -= xpNeeded;
            user.level  += 1;
            user.attributes.intelligence += 2;
            user.attributes.discipline   += 2;
            user.attributes.creativity   += 2;
            xpNeeded = (user.level * 100) + 100;
            console.log(`🎉 ¡Usuario subió al nivel ${user.level}!`);
          }

          // ⭐ Sistema de Logros Automáticos
          if (!user.achievements) user.achievements = [];

          if (user.stats.tasksCompleted === 1 && !user.achievements.includes('fas fa-star')) {
            user.achievements.push('fas fa-star');
            console.log('🏅 Logro desbloqueado: Primera misión completada');
          }

          if (user.stats.tasksCompleted === 5 && !user.achievements.includes('fas fa-medal')) {
            user.achievements.push('fas fa-medal');
            console.log('🏆 Logro desbloqueado: 5 misiones completadas');
          }

          if (user.stats.tasksCompleted >= 10 && !user.achievements.includes('fas fa-khanda')) {
            user.achievements.push('fas fa-khanda');
            console.log('⚔️  Logro desbloqueado: 10 misiones completadas');
          }

          if (user.level >= 5 && !user.achievements.includes('fas fa-crown')) {
            user.achievements.push('fas fa-crown');
            console.log('👑 Logro desbloqueado: Nivel 5 alcanzado');
          }

          await user.save();
          console.log(`✅ XP actualizado: ${user.xp} | Nivel: ${user.level} | Tareas: ${user.stats.tasksCompleted}`);
        }
      } catch (xpError) {
        // No interrumpir la respuesta principal si falla el XP
        console.error('❌ Error al actualizar XP del usuario:', xpError.message);
      }
    }
    // ============================================================

    res.status(200).json(updatedQuest);
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
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
    if (quest.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    await quest.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = {
  getQuests,
  createQuest,
  updateQuest,
  deleteQuest
};
