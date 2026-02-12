const mongoose = require('mongoose');
const Quest = require('../models/Quest');
const User = require('../models/User');

/**
 * @desc    Obtener estadísticas del usuario (Nivel, XP, Misiones)
 * @route   GET /api/users/stats
 * @access  Private
 */
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Buscar todas las misiones del usuario
    const quests = await Quest.find({ user: userId });

    // 2. Calcular contadores
    let pendingQuests = 0;
    let inProgressQuests = 0;
    let completedQuests = 0;
    let totalXP = 0;

    quests.forEach(quest => {
      if (quest.status === 'completed') {
        completedQuests++;
        totalXP += (quest.xp || 0);
      } else if (quest.status === 'in-progress') {
        inProgressQuests++;
      } else {
        pendingQuests++;
      }
    });

    // 3. Calcular Nivel
    // Fórmula simple: 1 nivel cada 100 XP. Empieza en nivel 1.
    // Nivel 1: 0-99 XP
    // Nivel 2: 100-199 XP
    const calculatedLevel = Math.floor(totalXP / 100) + 1;

    // 4. Actualizar usuario si hay cambios
    // (Opcional: solo si queremos persistirlo en la colección User para acceso rápido)
    const user = await User.findById(userId);
    let userUpdated = false;

    if (user.xp !== totalXP) {
        user.xp = totalXP;
        userUpdated = true;
    }
    if (user.level !== calculatedLevel) {
        user.level = calculatedLevel;
        userUpdated = true;
    }

    if (userUpdated) {
        await user.save();
    }

    // 5. Preparar respuesta
    // Calculamos el progreso para el siguiente nivel
    // XP en el nivel actual = totalXP % 100
    // Siguiente nivel requiere = 100 XP (en este modelo simple de 100 por nivel)
    const xpInCurrentLevel = totalXP % 100;
    const xpToNextLevel = 100;

    res.status(200).json({
      level: calculatedLevel,
      currentXP: totalXP, // XP Total acumulada
      xpInCurrentLevel: xpInCurrentLevel, // Para la barra de progreso (ej: 50)
      nextLevelXP: xpToNextLevel, // Meta del nivel (ej: 100)
      completedQuests,
      pendingQuests,
      inProgressQuests,
      totalQuests: quests.length
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas del usuario' });
  }
};

module.exports = {
  getStats
};
