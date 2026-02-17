const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Por favor añade un nombre al recurso'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  type: {
    type: String,
    required: [true, 'Por favor especifica el tipo de recurso'],
    enum: {
      values: ['PDF', 'Link', 'Video'],
      message: 'El tipo debe ser PDF, Link o Video'
    }
  },
  icon: {
    type: String,
    default: 'pi pi-file'
  },
  description: {
    type: String,
    maxlength: [500, 'La descripción no puede tener más de 500 caracteres']
  },
  url: {
    type: String,
    required: [true, 'Por favor añade una URL al recurso']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resource', resourceSchema);
