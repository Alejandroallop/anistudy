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
    console.log('🔍 DEBUG STATS - Misiones encontradas:', quests);

    // 2. Calcular contadores
    let pendingQuests = 0;
    let inProgressQuests = 0;
    let completedQuests = 0;
    let totalXP = 0;

    quests.forEach(quest => {
      // Blindaje: Trim y LowerCase para evitar errores de 'Completed ' o 'COMPLETED'
      const status = (quest.status || '').toLowerCase().trim();
      const xpValue = parseInt(quest.xp) || 0; // Asegurar que sea número

      if (status === 'completed') {
        completedQuests++;
        totalXP += xpValue;
      } else if (status === 'in-progress') {
        inProgressQuests++;
      } else {
        pendingQuests++;
      }
    });

    // 3. Calcular Nivel (Curva Cuadrática RPG)
    // Fórmula: Nivel = floor(sqrt(TotalXP / 50)) + 1
    // Nivel 1: 0-49 XP
    // Nivel 2: 50-199 XP
    // Nivel 3: 200-449 XP
    // ...
    const calculatedLevel = Math.floor(Math.sqrt(totalXP / 50)) + 1;

    // 4. Actualizar usuario en la BD (CRÍTICO: Persistencia)
    await User.findByIdAndUpdate(userId, {
      xp: totalXP,
      level: calculatedLevel
    });

    // 5. Preparar respuesta (Cálculo Relativo para la Barra)
    // XP necesaria para alcanzar el nivel actual (piso)
    // Fórmula inversa: XP = 50 * (Nivel-1)^2
    const xpForCurrentLevel = 50 * Math.pow(calculatedLevel - 1, 2);
    
    // XP necesaria para el SIGUIENTE nivel (techo)
    // Fórmula inversa: XP = 50 * (Nivel)^2
    const xpForNextLevel = 50 * Math.pow(calculatedLevel, 2);

    // Progreso dentro del nivel actual (0 a X)
    const xpProgressInLevel = totalXP - xpForCurrentLevel;
    
    // Total de XP que pide este nivel (de piso a techo)
    const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;

    res.status(200).json({
      level: calculatedLevel,
      currentXP: xpProgressInLevel, // Manda el progreso RELATIVO (ej: 25)
      totalXP: totalXP,             // XP histórica total (ej: 75)
      nextLevelXP: xpNeededForLevel, // Meta del nivel (ej: 150)
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
