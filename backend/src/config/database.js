const mongoose = require('mongoose');

/**
 * Conecta a la base de datos MongoDB usando Mongoose
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Opciones recomendadas para Mongoose 8+
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    console.log('='.repeat(50));
    console.log(`🔥 MongoDB Conectado: ${conn.connection.host}`);
    console.log(`📊 Base de Datos: ${conn.connection.name}`);
    console.log('='.repeat(50));

    // Eventos de conexión
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB desconectado');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de MongoDB:', err);
    });

  } catch (error) {
    console.error('='.repeat(50));
    console.error('❌ Error al conectar a MongoDB:');
    console.error(error.message);
    console.error('='.repeat(50));
    process.exit(1);
  }
};

module.exports = connectDB;
