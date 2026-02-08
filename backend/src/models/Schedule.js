const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El horario debe pertenecer a un usuario'],
      index: true
    },
    day: {
      type: String,
      required: [true, 'El día es obligatorio'],
      enum: {
        values: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
        message: '{VALUE} no es un día válido'
      }
    },
    startTime: {
      type: String,
      required: [true, 'La hora de inicio es obligatoria'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'El formato debe ser HH:MM (ej: 09:00)']
    },
    endTime: {
      type: String,
      required: [true, 'La hora de fin es obligatoria'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'El formato debe ser HH:MM (ej: 10:30)'],
      validate: {
        validator: function(value) {
          // Compara tiempos en formato HH:MM
          return value > this.startTime;
        },
        message: 'La hora de fin debe ser posterior a la hora de inicio'
      }
    },
    subject: {
      type: String,
      required: [true, 'La materia es obligatoria'],
      trim: true,
      maxlength: [100, 'La materia no puede exceder 100 caracteres']
    },
    room: {
      type: String,
      trim: true,
      maxlength: [50, 'El aula no puede exceder 50 caracteres']
    },
    color: {
      type: String,
      trim: true,
      default: '#3788d8',
      match: [/^#[0-9A-Fa-f]{6}$/, 'El color debe ser un código hexadecimal válido']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Índice compuesto para consultas por día
scheduleSchema.index({ user: 1, day: 1, startTime: 1 });

// Prevenir solapamiento de horarios
scheduleSchema.pre('save', async function(next) {
  const overlapping = await this.constructor.findOne({
    user: this.user,
    day: this.day,
    _id: { $ne: this._id },
    $or: [
      { startTime: { $lt: this.endTime }, endTime: { $gt: this.startTime } }
    ]
  });

  if (overlapping) {
    const error = new Error('Ya existe una clase en ese horario');
    return next(error);
  }
  next();
});

module.exports = mongoose.model('Schedule', scheduleSchema);
