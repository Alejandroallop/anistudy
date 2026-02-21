const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Helper: construir objeto de respuesta completo del usuario
const buildUserResponse = (user, token) => ({
  _id:          user._id,
  name:         user.name,
  email:        user.email,
  level:        user.level,
  xp:           user.xp,
  avatar:       user.avatar,
  focusTime:    user.focusTime,
  attributes:   user.attributes,
  stats:        user.stats,
  achievements: user.achievements,
  token
});

// @desc    Registrar usuario
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    // Verificar si existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear usuario
    const user = await User.create({ name, email, password, avatar });

    if (user) {
      res.status(201).json(buildUserResponse(user, generateToken(user._id)));
    } else {
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// @desc    Autenticar usuario & obtener token
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json(buildUserResponse(user, generateToken(user._id)));
    } else {
      res.status(401).json({ message: 'Email o contraseña inválidos' });
    }
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// @desc    Obtener perfil completo del usuario autenticado
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = {
  register,
  login,
  getProfile
};
