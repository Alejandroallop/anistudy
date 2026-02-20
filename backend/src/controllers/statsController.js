const Quest = require('../models/Quest');
const User = require('../models/User');
const Event = require('../models/Event');

/**
 * @desc    Obtener estadísticas del usuario (Nivel, XP, Misiones, Enfoque, Próximo Evento)
 * @route   GET /api/users/stats
 * @access  Private
 */
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Buscar usuario actual
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // 2. Buscar todas las misiones del usuario
    const quests = await Quest.find({ user: userId });

    // 3. Calcular contadores
    let pendingQuests = 0;
    let inProgressQuests = 0;
    let completedQuests = 0;
    let totalXP = 0;

    quests.forEach(quest => {
      const status = (quest.status || '').toLowerCase().trim();
      const xpValue = parseInt(quest.xp) || 0;

      if (status === 'completed') {
        completedQuests++;
        totalXP += xpValue;
      } else if (status === 'in-progress') {
        inProgressQuests++;
      } else {
        pendingQuests++;
      }
    });

    // 4. Calcular Nivel (Curva Cuadrática RPG)
    const calculatedLevel = Math.floor(Math.sqrt(totalXP / 50)) + 1;

    // 5. Actualizar usuario en la BD
    await User.findByIdAndUpdate(userId, {
      xp: totalXP,
      level: calculatedLevel
    });

    // 6. Calcular progreso relativo del nivel
    const xpForCurrentLevel = 50 * Math.pow(calculatedLevel - 1, 2);
    const xpForNextLevel = 50 * Math.pow(calculatedLevel, 2);
    const xpProgressInLevel = totalXP - xpForCurrentLevel;
    const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;

    // 7. Buscar misiones activas (no completadas) - máximo 2
    const activeQuests = quests
      .filter(q => q.status !== 'completed')
      .slice(0, 2);

    // 8. Buscar el próximo evento del calendario
    const nextEvent = await Event.findOne({
      user: userId,
      start: { $gte: new Date() }
    }).sort({ start: 1 });

    // 9. Respuesta completa con todos los datos del dashboard
    res.status(200).json({
      level: calculatedLevel,
      currentXP: xpProgressInLevel,
      totalXP: totalXP,
      nextLevelXP: xpNeededForLevel,
      completedQuests,
      pendingQuests,
      inProgressQuests,
      totalQuests: quests.length,
      focusTime: currentUser.focusTime || 0,
      streak: currentUser.streak || 1, // TODO: Implementar lógica de racha
      activeQuests: activeQuests,
      nextEvent: nextEvent
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas del usuario' });
  }
};

// @desc    Añadir tiempo de enfoque (Pomodoro) con XP y subida de nivel
// @route   POST /api/users/focus-time
// @access  Private
const addFocusTime = async (req, res) => {
  try {
    const { minutes } = req.body;

    if (!minutes || typeof minutes !== 'number' || minutes <= 0) {
      return res.status(400).json({ message: 'Por favor proporciona una cantidad válida de minutos' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Sumar minutos al tiempo total de enfoque
    user.focusTime = (user.focusTime || 0) + minutes;

    // Otorgar XP por estudiar (5 XP por minuto)
    const xpGained = minutes * 5;
    user.xp = (user.xp || 0) + xpGained;

    // Asegurar que existen los atributos
    if (!user.attributes) {
      user.attributes = { intelligence: 10, discipline: 10, creativity: 10 };
    }

    // Bucle de subida de nivel (misma fórmula que en misiones)
    let xpNeeded = (user.level * 100) + 100;
    while (user.xp >= xpNeeded) {
      user.xp    -= xpNeeded;
      user.level += 1;
      user.attributes.intelligence += 2;
      user.attributes.discipline   += 2;
      user.attributes.creativity   += 2;
      xpNeeded = (user.level * 100) + 100;
      console.log(`🎉 ¡Usuario subió al nivel ${user.level} por Pomodoro!`);
    }

    await user.save();

    console.log(`✅ Pomodoro: ${user.name} +${minutes}min (+${xpGained}XP) | Nivel: ${user.level} | FocusTime: ${user.focusTime}min`);

    res.status(200).json({
      success: true,
      minutesAdded: minutes,
      xpGained,
      totalFocusTime: user.focusTime,
      level: user.level,
      xp: user.xp,
      attributes: user.attributes
    });
  } catch (error) {
    console.error('❌ Error en addFocusTime:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats,
  addFocusTime
};
