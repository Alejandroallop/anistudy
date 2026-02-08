require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/database');

// Importar modelos
const User = require('../models/User');
const Schedule = require('../models/Schedule');
const Task = require('../models/Task');
const StudySession = require('../models/StudySession');
const Event = require('../models/Event');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

const log = (color, message) => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const seedDatabase = async () => {
  try {
    // Conectar a MongoDB
    await connectDB();
    log('cyan', '\n🌱 Iniciando proceso de Seed...\n');

    // ====================================
    // 1. LIMPIEZA DE DATOS EXISTENTES
    // ====================================
    log('yellow', '🧹 Limpiando datos existentes...');
    await User.deleteMany({});
    await Schedule.deleteMany({});
    await Task.deleteMany({});
    await StudySession.deleteMany({});
    await Event.deleteMany({});
    log('green', '✅ Datos eliminados correctamente\n');

    // ====================================
    // 2. CREAR USUARIO PROTAGONISTA (SAKURA)
    // ====================================
    log('blue', '👤 Creando usuario Sakura...');
    
    // Hashear la contraseña antes de crear el usuario
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const sakura = await User.create({
      email: 'demo@anistudy.com',
      password: hashedPassword,
      profile: {
        nickname: 'SakuraDev',
        gender: 'girl',
        avatarId: 'sakura-avatar',
        level: 5,
        xp: 450
      },
      settings: {
        pomodoroLength: 25,
        shortBreak: 5,
        longBreak: 15,
        isMusicEnabled: true
      }
    });
    log('green', `✅ Usuario creado: ${sakura.profile.nickname} (Nivel ${sakura.profile.level})\n`);

    // ====================================
    // 3. CREAR HORARIO ESCOLAR (LUNES - VIERNES)
    // ====================================
    log('blue', '📅 Creando horario escolar...');
    const scheduleData = [
      // LUNES
      { day: 'Lunes', startTime: '08:30', endTime: '10:30', subject: 'Despliegue', room: 'Aula 201', color: '#FF6B6B' },
      { day: 'Lunes', startTime: '10:45', endTime: '12:45', subject: 'Diseño de Interfaces', room: 'Aula 305', color: '#4ECDC4' },
      { day: 'Lunes', startTime: '13:00', endTime: '14:30', subject: 'Cliente', room: 'Aula 102', color: '#45B7D1' },
      
      // MARTES
      { day: 'Martes', startTime: '08:30', endTime: '10:30', subject: 'Servidor', room: 'Aula 201', color: '#96CEB4' },
      { day: 'Martes', startTime: '10:45', endTime: '12:45', subject: 'Empresa', room: 'Aula 401', color: '#FFEAA7' },
      { day: 'Martes', startTime: '13:00', endTime: '14:30', subject: 'Despliegue', room: 'Aula 201', color: '#FF6B6B' },
      
      // MIÉRCOLES
      { day: 'Miércoles', startTime: '08:30', endTime: '10:30', subject: 'Cliente', room: 'Aula 102', color: '#45B7D1' },
      { day: 'Miércoles', startTime: '10:45', endTime: '12:45', subject: 'Servidor', room: 'Aula 201', color: '#96CEB4' },
      { day: 'Miércoles', startTime: '13:00', endTime: '14:30', subject: 'Diseño de Interfaces', room: 'Aula 305', color: '#4ECDC4' },
      
      // JUEVES
      { day: 'Jueves', startTime: '08:30', endTime: '10:30', subject: 'Empresa', room: 'Aula 401', color: '#FFEAA7' },
      { day: 'Jueves', startTime: '10:45', endTime: '12:45', subject: 'Despliegue', room: 'Aula 201', color: '#FF6B6B' },
      { day: 'Jueves', startTime: '13:00', endTime: '14:30', subject: 'Cliente', room: 'Aula 102', color: '#45B7D1' },
      
      // VIERNES
      { day: 'Viernes', startTime: '08:30', endTime: '10:30', subject: 'Diseño de Interfaces', room: 'Aula 305', color: '#4ECDC4' },
      { day: 'Viernes', startTime: '10:45', endTime: '12:45', subject: 'Servidor', room: 'Aula 201', color: '#96CEB4' },
      { day: 'Viernes', startTime: '13:00', endTime: '14:30', subject: 'Empresa', room: 'Aula 401', color: '#FFEAA7' }
    ];

    const schedules = await Schedule.insertMany(
      scheduleData.map(s => ({ ...s, user: sakura._id }))
    );
    log('green', `✅ ${schedules.length} clases creadas (Lunes a Viernes)\n`);

    // ====================================
    // 4. CREAR TAREAS
    // ====================================
    log('blue', '✅ Creando tareas...');
    
    // Tareas completadas (sin dueDate porque ya están hechas)
    const completedTasks = await Task.insertMany([
      {
        user: sakura._id,
        title: 'Entregar práctica Docker',
        subject: 'Despliegue',
        status: 'completed',
        priority: 'high'
      },
      {
        user: sakura._id,
        title: 'Diseñar mockup en Figma',
        subject: 'Diseño de Interfaces',
        status: 'completed',
        priority: 'medium'
      }
    ]);
    log('green', `✅ ${completedTasks.length} tareas completadas`);

    // Tareas pendientes
    const pendingTasks = await Task.insertMany([
      {
        user: sakura._id,
        title: 'Estudiar para examen de React',
        subject: 'Cliente',
        status: 'pending',
        priority: 'high',
        dueDate: new Date('2026-02-12')
      },
      {
        user: sakura._id,
        title: 'Implementar API REST con Express',
        subject: 'Servidor',
        status: 'pending',
        priority: 'high',
        dueDate: new Date('2026-02-15')
      },
      {
        user: sakura._id,
        title: 'Leer capítulo 3 del libro de Empresa',
        subject: 'Empresa',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date('2026-02-20')
      }
    ]);
    log('green', `✅ ${pendingTasks.length} tareas pendientes\n`);

    // ====================================
    // 5. CREAR SESIONES DE ESTUDIO
    // ====================================
    log('blue', '📊 Creando sesiones de estudio...');
    
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const studySessions = await StudySession.insertMany([
      // Ayer
      {
        user: sakura._id,
        duration: 25,
        mode: 'focus',
        completedAt: new Date(yesterday.setHours(9, 30, 0))
      },
      {
        user: sakura._id,
        duration: 5,
        mode: 'short-break',
        completedAt: new Date(yesterday.setHours(10, 0, 0))
      },
      {
        user: sakura._id,
        duration: 25,
        mode: 'focus',
        completedAt: new Date(yesterday.setHours(10, 10, 0))
      },
      // Hoy
      {
        user: sakura._id,
        duration: 25,
        mode: 'focus',
        completedAt: new Date(now.setHours(8, 0, 0))
      },
      {
        user: sakura._id,
        duration: 15,
        mode: 'long-break',
        completedAt: new Date(now.setHours(8, 30, 0))
      }
    ]);
    log('green', `✅ ${studySessions.length} sesiones de estudio creadas\n`);

    // ====================================
    // 6. RESUMEN FINAL
    // ====================================
    log('bright', '='.repeat(60));
    log('green', '🎉 SEED COMPLETADO EXITOSAMENTE');
    log('bright', '='.repeat(60));
    log('cyan', `\n📊 Resumen de datos creados:`);
    log('cyan', `   • 1 Usuario: ${sakura.email}`);
    log('cyan', `   • ${schedules.length} Clases en el horario`);
    log('cyan', `   • ${completedTasks.length + pendingTasks.length} Tareas (${completedTasks.length} completadas, ${pendingTasks.length} pendientes)`);
    log('cyan', `   • ${studySessions.length} Sesiones de estudio`);
    log('cyan', '\n🔐 Credenciales de acceso:');
    log('yellow', `   Email: demo@anistudy.com`);
    log('yellow', `   Password: 123456\n`);

  } catch (error) {
    log('red', '\n❌ Error durante el seed:');
    console.error(error);
    process.exit(1);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    log('blue', '🔌 Conexión a MongoDB cerrada\n');
  }
};

// Ejecutar el seed
seedDatabase();
