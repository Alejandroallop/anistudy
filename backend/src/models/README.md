# Modelos de Mongoose - Resumen Técnico

## 📚 Índice de Modelos

Todos los modelos están exportados desde `src/models/` y tienen `{ timestamps: true }` activado para `createdAt` y `updatedAt` automáticos.

---

## 1. User.js - Estudiante RPG

**Propósito:** Gestionar perfiles de usuario con sistema de niveles y configuración de Pomodoro.

### Campos Principales:
```javascript
{
  email: String (unique, required, validated),
  password: String (required, min 6 chars),
  profile: {
    nickname: String (default: 'Estudiante'),
    gender: 'boy' | 'girl' (default: 'girl'),
    avatarId: String (default: 'default-avatar'),
    level: Number (default: 1, min: 1),
    xp: Number (default: 0, min: 0)
  },
  settings: {
    pomodoroLength: Number (default: 25, range: 1-60),
    shortBreak: Number (default: 5, range: 1-30),
    longBreak: Number (default: 15, range: 1-60),
    isMusicEnabled: Boolean (default: true)
  }
}
```

### Índices:
- `email` (único)

---

## 2. Task.js - Agenda Kanban

**Propósito:** Sistema de tareas tipo Kanban con prioridades.

### Campos Principales:
```javascript
{
  user: ObjectId → User (required, indexed),
  title: String (required, max 200),
  subject: String (max 100),
  status: 'pending' | 'in-progress' | 'completed' (default: 'pending'),
  priority: 'low' | 'medium' | 'high' (default: 'medium'),
  dueDate: Date (validado: no pasado)
}
```

### Índices:
- `{ user: 1, status: 1 }` (compuesto)
- `{ user: 1, dueDate: 1 }` (compuesto)

---

## 3. Event.js - Calendario

**Propósito:** Eventos de calendario con soporte para días completos.

### Campos Principales:
```javascript
{
  user: ObjectId → User (required, indexed),
  title: String (required, max 200),
  start: Date (required),
  end: Date (required, validado: > start),
  allDay: Boolean (default: false),
  color: String (hex color, default: '#3788d8')
}
```

### Índices:
- `{ user: 1, start: 1 }`
- `{ user: 1, end: 1 }`

---

## 4. StudySession.js - Estadísticas Pomodoro

**Propósito:** Registro de sesiones de estudio para estadísticas.

### Campos Principales:
```javascript
{
  user: ObjectId → User (required, indexed),
  duration: Number (minutos, range: 1-120),
  mode: 'focus' | 'short-break' | 'long-break' (required),
  completedAt: Date (default: Date.now)
}
```

### Índices:
- `{ user: 1, completedAt: -1 }`
- `{ user: 1, mode: 1 }`

### Métodos Estáticos:
```javascript
// Obtener estadísticas agregadas
StudySession.getUserStats(userId, dateFrom)
```

---

## 5. Schedule.js - Horario Escolar

**Propósito:** Horario semanal de clases con prevención de solapamientos.

### Campos Principales:
```javascript
{
  user: ObjectId → User (required, indexed),
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' (required),
  startTime: String (format: 'HH:MM', ej: '09:00'),
  endTime: String (format: 'HH:MM', validado: > startTime),
  subject: String (required, max 100),
  room: String (optional, max 50),
  color: String (hex color, default: '#3788d8')
}
```

### Índices:
- `{ user: 1, day: 1, startTime: 1 }` (compuesto)

### Middleware Pre-save:
- **Prevención de solapamientos:** Valida que no haya clases que se superpongan en el mismo día.

---

## 🔗 Relaciones Entre Modelos

```
User (1)
  ├─→ Task (N) - Un usuario puede tener muchas tareas
  ├─→ Event (N) - Un usuario puede tener muchos eventos
  ├─→ StudySession (N) - Un usuario puede tener muchas sesiones
  └─→ Schedule (N) - Un usuario puede tener muchas clases
```

---

## ⚡ Características Avanzadas

### Validaciones Personalizadas:
- **User:** Email con regex, contraseña mínima, rangos en configuración
- **Task:** Fecha de vencimiento no puede ser pasada
- **Event:** Fecha de fin debe ser posterior a inicio
- **Schedule:** Formato de hora validado con regex, validación de solapamiento

### Timestamps Automáticos:
Todos los modelos incluyen:
- `createdAt`: Fecha de creación
- `updatedAt`: Fecha de última modificación

### Índices Optimizados:
- Índices simples en campos de referencia (`user`)
- Índices compuestos para consultas frecuentes
- Índice único en `User.email`

---

## 📖 Uso en Controladores

### Ejemplo - Crear Usuario:
```javascript
const User = require('../models/User');

const newUser = await User.create({
  email: 'estudiante@example.com',
  password: 'hashedPassword123'
  // Los demás campos usarán valores por defecto
});
```

### Ejemplo - Consultar Tareas de Usuario:
```javascript
const Task = require('../models/Task');

const tasks = await Task.find({
  user: userId,
  status: 'pending'
}).sort({ dueDate: 1 });
```

### Ejemplo - Obtener Estadísticas:
```javascript
const StudySession = require('../models/StudySession');

const stats = await StudySession.getUserStats(
  userId,
  new Date('2026-01-01')
);
```
