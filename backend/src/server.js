require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Conectar a MongoDB primero, luego levantar el servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📊 Modo: ${NODE_ENV.toUpperCase()}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log('='.repeat(50));
  });
});
