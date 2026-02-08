const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El evento debe pertenecer a un usuario'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      maxlength: [200, 'El título no puede exceder 200 caracteres']
    },
    start: {
      type: Date,
      required: [true, 'La fecha de inicio es obligatoria']
    },
    end: {
      type: Date,
      required: [true, 'La fecha de fin es obligatoria'],
      validate: {
        validator: function(value) {
          return value > this.start;
        },
        message: 'La fecha de fin debe ser posterior a la fecha de inicio'
      }
    },
    allDay: {
      type: Boolean,
      default: false
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

// Índices para consultas de calendario
eventSchema.index({ user: 1, start: 1 });
eventSchema.index({ user: 1, end: 1 });

module.exports = mongoose.model('Event', eventSchema);
