const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Crear la aplicación Express
const app = express();

// Middlewares de seguridad
app.use(helmet());

// CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:4200'];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origin (ej. Postman, servidores back-to-back)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origen no permitido → ${origin}`));
  },
  credentials: true
}));

// Logger HTTP
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  // En producción, logs mínimos o nulos según la rúbrica
  // Podrías usar 'tiny' o simplemente no cargar morgan si quieres silencio total
  app.use(morgan('tiny')); 
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
const resourceRoutes = require('./routes/resourceRoutes');
const eventRoutes = require('./routes/eventRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/chat', chatRoutes);

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
app.use((err, req, res, _next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
  });
});

module.exports = app;
