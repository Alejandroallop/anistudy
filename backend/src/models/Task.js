const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'La tarea debe pertenecer a un usuario'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      maxlength: [200, 'El título no puede exceder 200 caracteres']
    },
    subject: {
      type: String,
      trim: true,
      maxlength: [100, 'La materia no puede exceder 100 caracteres']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed'],
        message: '{VALUE} no es un estado válido'
      },
      default: 'pending'
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} no es una prioridad válida'
      },
      default: 'medium'
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function(value) {
          // Solo valida si hay fecha
          return !value || value >= new Date();
        },
        message: 'La fecha de vencimiento no puede ser en el pasado'
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Índices compuestos para consultas frecuentes
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);
