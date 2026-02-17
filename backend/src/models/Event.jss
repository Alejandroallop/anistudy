const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Por favor añade un título al evento'],
    trim: true,
    maxlength: [100, 'El título no puede tener más de 100 caracteres']
  },
  date: {
    type: Date,
    required: [true, 'Por favor especifica una fecha para el evento']
  },
  type: {
    type: String,
    required: [true, 'Por favor especifica el tipo de evento'],
    enum: {
      values: ['exam', 'delivery', 'class'],
      message: 'El tipo debe ser exam, delivery o class'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);
