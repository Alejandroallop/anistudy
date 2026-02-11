const Quest = require('../models/Quest');
const Schedule = require('../models/Schedule');
const StudySession = require('../models/StudySession');

/**
 * @desc    Obtener datos del dashboard del usuario
 * @route   GET /api/dashboard
 * @access  Private
 */
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Obtener el día de la semana actual
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const today = daysOfWeek[new Date().getDay()];

    // Ejecutar todas las consultas en paralelo para optimizar
    const [pendingTasks, todaySchedule, studyStats] = await Promise.all([
      // Misiones pendientes (antes Tareas)
      Quest.find({
        user: userId,
        status: 'pending'
      })
        .sort({ createdAt: -1 })
        .limit(5),

      // Horario de hoy
      Schedule.find({
        user: userId,
        day: today
      }).sort({ startTime: 1 }),

      // Estadísticas de las últimas 2 semanas
      StudySession.aggregate([
        {
          $match: {
            user: userId,
            completedAt: {
              $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // Últimos 14 días
            }
          }
        },
        {
          $group: {
            _id: '$mode',
            totalSessions: { $sum: 1 },
            totalMinutes: { $sum: '$duration' }
          }
        }
      ])
    ]);

    // Calcular totales de estadísticas
    const stats = {
      focus: { sessions: 0, minutes: 0 },
      shortBreak: { sessions: 0, minutes: 0 },
      longBreak: { sessions: 0, minutes: 0 }
    };

    studyStats.forEach(stat => {
      if (stat._id === 'focus') {
        stats.focus = {
          sessions: stat.totalSessions,
          minutes: stat.totalMinutes
        };
      } else if (stat._id === 'short-break') {
        stats.shortBreak = {
          sessions: stat.totalSessions,
          minutes: stat.totalMinutes
        };
      } else if (stat._id === 'long-break') {
        stats.longBreak = {
          sessions: stat.totalSessions,
          minutes: stat.totalMinutes
        };
      }
    });

    // Respuesta estructurada
    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: req.user._id,
          email: req.user.email,
          profile: req.user.profile,
          settings: req.user.settings
        },
        tasks: {
          pending: pendingTasks,
          count: pendingTasks.length
        },
        schedule: {
          today: today,
          classes: todaySchedule,
          count: todaySchedule.length
        },
        stats: {
          period: 'last_14_days',
          focus: stats.focus,
          shortBreak: stats.shortBreak,
          longBreak: stats.longBreak,
          totalStudyMinutes: stats.focus.minutes,
          totalSessions: stats.focus.sessions + stats.shortBreak.sessions + stats.longBreak.sessions
        }
      }
    });
  } catch (error) {
    console.error('Error obteniendo datos del dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos del dashboard'
    });
  }
};

module.exports = {
  getDashboardData
};
