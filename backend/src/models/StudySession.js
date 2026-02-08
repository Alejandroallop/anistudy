const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'La sesión debe pertenecer a un usuario'],
      index: true
    },
    duration: {
      type: Number,
      required: [true, 'La duración es obligatoria'],
      min: [1, 'La duración debe ser al menos 1 minuto'],
      max: [120, 'La duración no puede exceder 120 minutos']
    },
    mode: {
      type: String,
      required: [true, 'El modo es obligatorio'],
      enum: {
        values: ['focus', 'short-break', 'long-break'],
        message: '{VALUE} no es un modo válido'
      }
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Índices para estadísticas
studySessionSchema.index({ user: 1, completedAt: -1 });
studySessionSchema.index({ user: 1, mode: 1 });

// Método estático para obtener estadísticas del usuario
studySessionSchema.statics.getUserStats = async function(userId, dateFrom) {
  return this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        completedAt: { $gte: dateFrom }
      }
    },
    {
      $group: {
        _id: '$mode',
        totalSessions: { $sum: 1 },
        totalMinutes: { $sum: '$duration' }
      }
    }
  ]);
};

module.exports = mongoose.model('StudySession', studySessionSchema);
