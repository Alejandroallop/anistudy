# Backend Express.js - Arquitectura MVC

Backend profesional desarrollado con Node.js y Express.js siguiendo el patrón MVC (Model-View-Controller).

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/         # Configuración de DB y variables de entorno
│   ├── controllers/    # Lógica de los endpoints
│   ├── models/         # Esquemas de Mongoose
│   ├── routes/         # Definición de rutas
│   ├── middlewares/    # Middleware personalizado
│   ├── utils/          # Funciones auxiliares
│   ├── app.js          # Configuración de Express
│   └── server.js       # Punto de entrada de la aplicación
├── .env.example        # Plantilla de variables de entorno
├── .eslintrc.json      # Configuración de ESLint
├── .prettierrc         # Configuración de Prettier
├── .gitignore          # Archivos ignorados por Git
└── package.json        # Dependencias y scripts
```

## 🚀 Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   Luego edita `.env` con tus valores reales.

## 💻 Scripts Disponibles

- **Modo Desarrollo:**
  ```bash
  npm run dev
  ```

- **Modo Producción:**
  ```bash
  npm start
  ```

- **Verificar Código (Linter):**
  ```bash
  npm run lint
  ```

- **Formatear Código:**
  ```bash
  npm run format
  ```

## 🛠️ Tecnologías

- **Express.js** - Framework web
- **Mongoose** - ODM para MongoDB
- **Helmet** - Seguridad HTTP
- **CORS** - Control de acceso entre orígenes
- **Morgan** - Logger HTTP
- **ESLint** - Linter
- **Prettier** - Formateador de código
- **Nodemon** - Recarga automática en desarrollo
- **Cross-env** - Variables de entorno multiplataforma

## 📝 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución | `development` o `production` |
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017/mydb` |
| `ALLOWED_ORIGINS` | Orígenes permitidos para CORS | `http://localhost:3000` |

## 🏗️ Próximos Pasos

1. Conectar a MongoDB en `src/config/database.js`
2. Crear modelos en `src/models/`
3. Implementar controladores en `src/controllers/`
4. Definir rutas en `src/routes/`
5. Añadir middlewares personalizados en `src/middlewares/`

## 📄 Licencia

ISC
