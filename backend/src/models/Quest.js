const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor añade un título a la misión'],
    trim: true,
    maxlength: [50, 'El título no puede tener más de 50 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Por favor añade una descripción'],
    maxlength: [500, 'La descripción no puede tener más de 500 caracteres']
  },
  rank: {
    type: String,
    required: true,
    enum: ['S', 'A', 'B', 'C', 'D'],
    default: 'C'
  },
  xp: {
    type: Number,
    required: true,
    default: 10
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quest', questSchema);
