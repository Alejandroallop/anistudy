const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Crear la aplicación Express
const app = express();

// Middlewares de seguridad
app.use(helmet());

// CORS
app.use(cors({
  origin: 'http://localhost:4200', // Angular Frontend
  credentials: true
}));

// Logger HTTP
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Parseo de JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====================================
// RUTAS DE LA API
// ====================================
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const questRoutes = require('./routes/questRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/users', require('./routes/userRoutes'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: '✅ API funcionando correctamente',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth (login, register, me)',
      dashboard: '/api/dashboard (protected)'
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path
  });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
  });
});

module.exports = app;
