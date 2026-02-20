require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');

// Importar modelos
const User = require('../models/User');
const Quest = require('../models/Quest');
const Task = require('../models/Task');
const Schedule = require('../models/Schedule');
const StudySession = require('../models/StudySession');
const Event = require('../models/Event');
const Resource = require('../models/Resource');

// ====================================
// COLORES DE CONSOLA
// ====================================
const c = {
  reset:  '\x1b[0m',
  bright: '\x1b[1m',
  green:  '\x1b[32m',
  blue:   '\x1b[34m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  red:    '\x1b[31m'
};
const log = (color, msg) => console.log(`${c[color]}${msg}${c.reset}`);

// ====================================
// FUNCIÓN PRINCIPAL
// ====================================
const seedDatabase = async () => {
  try {
    // 1. CONEXIÓN
    await connectDB();
    log('cyan', '\n🌱 Iniciando proceso de Seed - AniStudy...\n');

    // ====================================
    // 2. LIMPIEZA DE COLECCIONES
    // ====================================
    log('yellow', '🧹 Limpiando colecciones...');
    await User.deleteMany({});
    await Quest.deleteMany({});
    await Task.deleteMany({});
    await Schedule.deleteMany({});
    await StudySession.deleteMany({});
    await Event.deleteMany({});
    await Resource.deleteMany({});
    log('green', '✅ Colecciones limpias\n');

    // ====================================
    // 3. CREAR USUARIO DEMO (SAKURA)
    //    Esquema: name, email, password, level, xp,
    //             avatar, attributes, stats, achievements
    // ====================================
    log('blue', '👤 Creando usuario demo: Sakura...');
    const sakura = await User.create({
      name: 'Sakura Dev',
      email: 'demo@anistudy.com',
      password: '123456',          // Pre-save hook lo hashea automáticamente
      level: 5,
      xp: 500,
      focusTime: 125,
      avatar: 'assets/images/avatar_demo.png',
      attributes: {
        intelligence: 20,
        discipline:   20,
        creativity:   20
      },
      stats: {
        tasksCompleted: 12,
        streak: 7
      },
      achievements: ['pi pi-star-fill', 'pi pi-medal', 'pi pi-crown', 'pi pi-bolt']
    });
    log('green', `✅ Creado: ${sakura.name} | Email: ${sakura.email} | Nivel: ${sakura.level}\n`);

    // ====================================
    // 4. CREAR SEGUNDO USUARIO (KENJI)
    // ====================================
    log('blue', '👤 Creando usuario: Kenji...');
    const kenji = await User.create({
      name: 'Kenji Coder',
      email: 'kenji@anistudy.com',
      password: 'kenji123',
      level: 2,
      xp: 150,
      focusTime: 50,
      avatar: 'assets/images/kenji.png',
      attributes: {
        intelligence: 12,
        discipline:   15,
        creativity:   10
      },
      stats: {
        tasksCompleted: 3,
        streak: 2
      },
      achievements: ['first-login']
    });
    log('green', `✅ Creado: ${kenji.name} | Email: ${kenji.email} | Nivel: ${kenji.level}\n`);

    // ====================================
    // 5. CREAR MISIONES (QUESTS) — Sakura
    //    Esquema: title, description, rank, xp, status, user
    // ====================================
    log('blue', '⚔️  Creando misiones para Sakura...');
    const quests = await Quest.insertMany([
      {
        user: sakura._id,
        title: 'Dominar el Arte del Backend',
        description: 'Implementar una API REST completa con Express.js, autenticación JWT y conexión a MongoDB.',
        rank: 'S',
        xp: 500,
        status: 'in-progress'
      },
      {
        user: sakura._id,
        title: 'El Despertar del Frontend',
        description: 'Construir una SPA en Angular con componentes reutilizables y estilos BEM.',
        rank: 'A',
        xp: 300,
        status: 'completed'
      },
      {
        user: sakura._id,
        title: 'Misión Docker: Despliegue Heroico',
        description: 'Contenerizar la aplicación completa y desplegarla usando Docker Compose.',
        rank: 'A',
        xp: 250,
        status: 'pending'
      },
      {
        user: sakura._id,
        title: 'El Camino del Código Limpio',
        description: 'Refactorizar los componentes principales aplicando BEM y SCSS 7-1.',
        rank: 'B',
        xp: 100,
        status: 'completed'
      },
      {
        user: kenji._id,
        title: 'Primer Contacto con Node.js',
        description: 'Crear un servidor básico con Express y devolver datos en formato JSON.',
        rank: 'C',
        xp: 50,
        status: 'completed'
      },
      {
        user: kenji._id,
        title: 'Conquistar Git y GitHub',
        description: 'Configurar un repositorio, hacer commits semánticos y subir el proyecto.',
        rank: 'D',
        xp: 30,
        status: 'pending'
      }
    ]);
    log('green', `✅ ${quests.length} misiones creadas\n`);

    // ====================================
    // 6. CREAR EVENTOS DE CALENDARIO — Sakura
    //    Esquema: user, title, start, end, type, allDay
    // ====================================
    log('blue', '📅 Creando eventos de calendario...');
    const today = new Date();
    const tomorrow  = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const nextWeek  = new Date(today); nextWeek.setDate(today.getDate() + 7);
    const nextWeek2 = new Date(today); nextWeek2.setDate(today.getDate() + 10);
    const nextWeek3 = new Date(today); nextWeek3.setDate(today.getDate() + 14);

    const events = await Event.insertMany([
      {
        user: sakura._id,
        title: 'Examen Final de Despliegue',
        start: nextWeek,
        allDay: true,
        type: 'exam'
      },
      {
        user: sakura._id,
        title: 'Entrega Proyecto Angular',
        start: tomorrow,
        allDay: true,
        type: 'delivery'
      },
      {
        user: sakura._id,
        title: 'Clase de Diseño de Interfaces',
        start: today,
        end: today,
        allDay: false,
        type: 'class'
      },
      {
        user: sakura._id,
        title: 'Examen de Servidor (Node.js)',
        start: nextWeek2,
        allDay: true,
        type: 'exam'
      },
      {
        user: sakura._id,
        title: 'Entrega Práctica Docker',
        start: nextWeek3,
        allDay: true,
        type: 'delivery'
      }
    ]);
    log('green', `✅ ${events.length} eventos de calendario creados\n`);

    // ====================================
    // 7. CREAR RECURSOS DEL GRIMORIO — Sakura
    //    Esquema: user, name, type (PDF|Link|Video), icon, url, description
    // ====================================
    log('blue', '📚 Creando recursos del Grimorio...');
    const resources = await Resource.insertMany([
      {
        user: sakura._id,
        name: 'Guía Completa de Express.js',
        type: 'Link',
        icon: 'pi pi-globe',
        url: 'https://expressjs.com/es/guide/routing.html',
        description: 'Documentación oficial de Express.js con ejemplos de routing, middleware y manejo de errores.'
      },
      {
        user: sakura._id,
        name: 'Mongoose — Modelado de Datos',
        type: 'Link',
        icon: 'pi pi-database',
        url: 'https://mongoosejs.com/docs/guide.html',
        description: 'Guía oficial de Mongoose para definir esquemas, modelos y consultas en MongoDB.'
      },
      {
        user: sakura._id,
        name: 'Apuntes BEM y SCSS 7-1',
        type: 'PDF',
        icon: 'pi pi-file-pdf',
        url: 'assets/docs/bem-scss-apuntes.pdf',
        description: 'Apuntes de clase sobre metodología BEM estricta y arquitectura SCSS 7-1 con ejemplos prácticos.'
      },
      {
        user: sakura._id,
        name: 'Curso Angular 17 — Componentes y Servicios',
        type: 'Video',
        icon: 'pi pi-video',
        url: 'https://www.youtube.com/watch?v=exampleAngular',
        description: 'Tutorial completo sobre Angular 17: componentes standalone, directivas y comunicación entre componentes.'
      },
      {
        user: sakura._id,
        name: 'Cheatsheet Docker Compose',
        type: 'PDF',
        icon: 'pi pi-file-pdf',
        url: 'assets/docs/docker-compose-cheatsheet.pdf',
        description: 'Referencia rápida de comandos Docker Compose para desarrollo y despliegue.'
      },
      {
        user: sakura._id,
        name: 'JWT Authentication — Best Practices',
        type: 'Link',
        icon: 'pi pi-lock',
        url: 'https://jwt.io/introduction',
        description: 'Introducción a JSON Web Tokens: estructura, firma y mejores prácticas de seguridad.'
      }
    ]);
    log('green', `✅ ${resources.length} recursos del Grimorio creados\n`);

    // ====================================
    // 8. CREAR TAREAS — Sakura
    //    Esquema: user, title, subject, status, priority, dueDate
    // ====================================
    log('blue', '📝 Creando tareas...');
    const now = new Date();
    const addDays = (d) => { const dt = new Date(now); dt.setDate(dt.getDate() + d); return dt; };

    const tasks = await Task.insertMany([
      // Completadas
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
      },
      // Pendientes
      {
        user: sakura._id,
        title: 'Estudiar para examen de React',
        subject: 'Cliente',
        status: 'pending',
        priority: 'high',
        dueDate: addDays(3)
      },
      {
        user: sakura._id,
        title: 'Implementar validación con express-validator',
        subject: 'Servidor',
        status: 'in-progress',
        priority: 'high',
        dueDate: addDays(5)
      },
      {
        user: sakura._id,
        title: 'Leer capítulo 3 de Empresa e Iniciativa Emprendedora',
        subject: 'Empresa',
        status: 'pending',
        priority: 'medium',
        dueDate: addDays(10)
      },
      // Kenji
      {
        user: kenji._id,
        title: 'Hacer la práctica de Express',
        subject: 'Servidor',
        status: 'pending',
        priority: 'high',
        dueDate: addDays(2)
      }
    ]);
    log('green', `✅ ${tasks.length} tareas creadas\n`);

    // ====================================
    // 9. CREAR HORARIO — Sakura
    // ====================================
    log('blue', '📅 Creando horario escolar...');
    const schedules = await Schedule.insertMany([
      { user: sakura._id, day: 'Lunes',     startTime: '08:30', endTime: '10:30', subject: 'Despliegue',           room: 'Aula 201', color: '#FF6B6B' },
      { user: sakura._id, day: 'Lunes',     startTime: '10:45', endTime: '12:45', subject: 'Diseño de Interfaces', room: 'Aula 305', color: '#4ECDC4' },
      { user: sakura._id, day: 'Lunes',     startTime: '13:00', endTime: '14:30', subject: 'Cliente',              room: 'Aula 102', color: '#45B7D1' },
      { user: sakura._id, day: 'Martes',    startTime: '08:30', endTime: '10:30', subject: 'Servidor',             room: 'Aula 201', color: '#96CEB4' },
      { user: sakura._id, day: 'Martes',    startTime: '10:45', endTime: '12:45', subject: 'Empresa',              room: 'Aula 401', color: '#FFEAA7' },
      { user: sakura._id, day: 'Martes',    startTime: '13:00', endTime: '14:30', subject: 'Despliegue',           room: 'Aula 201', color: '#FF6B6B' },
      { user: sakura._id, day: 'Miércoles', startTime: '08:30', endTime: '10:30', subject: 'Cliente',              room: 'Aula 102', color: '#45B7D1' },
      { user: sakura._id, day: 'Miércoles', startTime: '10:45', endTime: '12:45', subject: 'Servidor',             room: 'Aula 201', color: '#96CEB4' },
      { user: sakura._id, day: 'Miércoles', startTime: '13:00', endTime: '14:30', subject: 'Diseño de Interfaces', room: 'Aula 305', color: '#4ECDC4' },
      { user: sakura._id, day: 'Jueves',    startTime: '08:30', endTime: '10:30', subject: 'Empresa',              room: 'Aula 401', color: '#FFEAA7' },
      { user: sakura._id, day: 'Jueves',    startTime: '10:45', endTime: '12:45', subject: 'Despliegue',           room: 'Aula 201', color: '#FF6B6B' },
      { user: sakura._id, day: 'Jueves',    startTime: '13:00', endTime: '14:30', subject: 'Cliente',              room: 'Aula 102', color: '#45B7D1' },
      { user: sakura._id, day: 'Viernes',   startTime: '08:30', endTime: '10:30', subject: 'Diseño de Interfaces', room: 'Aula 305', color: '#4ECDC4' },
      { user: sakura._id, day: 'Viernes',   startTime: '10:45', endTime: '12:45', subject: 'Servidor',             room: 'Aula 201', color: '#96CEB4' },
      { user: sakura._id, day: 'Viernes',   startTime: '13:00', endTime: '14:30', subject: 'Empresa',              room: 'Aula 401', color: '#FFEAA7' }
    ]);
    log('green', `✅ ${schedules.length} clases en el horario\n`);

    // ====================================
    // 10. CREAR SESIONES DE ESTUDIO — Sakura
    // ====================================
    log('blue', '⏱️  Creando sesiones de estudio...');
    const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(now); twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const sessions = await StudySession.insertMany([
      { user: sakura._id, duration: 25, mode: 'focus',       completedAt: new Date(twoDaysAgo.setHours(9,  0, 0)) },
      { user: sakura._id, duration:  5, mode: 'short-break', completedAt: new Date(twoDaysAgo.setHours(9, 30, 0)) },
      { user: sakura._id, duration: 25, mode: 'focus',       completedAt: new Date(twoDaysAgo.setHours(9, 35, 0)) },
      { user: sakura._id, duration: 25, mode: 'focus',       completedAt: new Date(yesterday.setHours(10, 0, 0)) },
      { user: sakura._id, duration: 15, mode: 'long-break',  completedAt: new Date(yesterday.setHours(10, 30, 0)) },
      { user: sakura._id, duration: 25, mode: 'focus',       completedAt: new Date(now.setHours(8, 0, 0)) }
    ]);
    log('green', `✅ ${sessions.length} sesiones de estudio creadas\n`);

    // ====================================
    // 9. RESUMEN FINAL
    // ====================================
    log('bright', '='.repeat(55));
    log('green', '🎉 SEED COMPLETADO EXITOSAMENTE');
    log('bright', '='.repeat(55));
    console.log('');
    log('cyan', '📊 Datos insertados:');
    log('cyan', '   👥 Usuarios    → 2');
    log('cyan', `   ⚔️  Misiones    → ${quests.length}`);
    log('cyan', `   📝 Tareas      → ${tasks.length}`);
    log('cyan', `   📅 Eventos     → ${events.length}`);
    log('cyan', `   📚 Grimorio    → ${resources.length}`);
    log('cyan', `   🗓️  Clases      → ${schedules.length}`);
    log('cyan', `   ⏱️  Sesiones    → ${sessions.length}`);
    console.log('');
    log('cyan', '🔐 Credenciales de acceso:');
    log('yellow', '   ┌─────────────────────────────────────────┐');
    log('yellow', '   │  Usuario Demo (Nivel 5)                 │');
    log('yellow', '   │  Email:    demo@anistudy.com            │');
    log('yellow', '   │  Password: 123456                       │');
    log('yellow', '   ├─────────────────────────────────────────┤');
    log('yellow', '   │  Usuario Kenji (Nivel 2)                │');
    log('yellow', '   │  Email:    kenji@anistudy.com           │');
    log('yellow', '   │  Password: kenji123                     │');
    log('yellow', '   └─────────────────────────────────────────┘');
    console.log('');
    log('green', '🚀 Ejecuta "npm run dev" para iniciar el backend.');
    console.log('');

  } catch (error) {
    log('red', '\n❌ Error durante el seed:');
    console.error(error.message || error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    log('blue', '🔌 Conexión a MongoDB cerrada');
    process.exit(0);
  }
};

// Ejecutar
seedDatabase();
