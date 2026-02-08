const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido']
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false // No devolver password por defecto en queries
    },
    profile: {
      nickname: {
        type: String,
        trim: true,
        default: 'Estudiante'
      },
      gender: {
        type: String,
        enum: ['boy', 'girl'],
        default: 'girl'
      },
      avatarId: {
        type: String,
        default: 'default-avatar'
      },
      level: {
        type: Number,
        default: 1,
        min: 1
      },
      xp: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    settings: {
      pomodoroLength: {
        type: Number,
        default: 25,
        min: 1,
        max: 60
      },
      shortBreak: {
        type: Number,
        default: 5,
        min: 1,
        max: 30
      },
      longBreak: {
        type: Number,
        default: 15,
        min: 1,
        max: 60
      },
      isMusicEnabled: {
        type: Boolean,
        default: true
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Índices para mejorar rendimiento
userSchema.index({ email: 1 });

// ====================================
// MIDDLEWARE: Hashear contraseña antes de guardar
// ====================================
userSchema.pre('save', async function (next) {
  // Solo hashear si la contraseña ha sido modificada
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ====================================
// MÉTODO: Comparar contraseña
// ====================================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ====================================
// MÉTODO: Generar token JWT
// ====================================
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

module.exports = mongoose.model('User', userSchema);

