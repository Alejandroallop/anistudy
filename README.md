# AniStudy 🌸

**AniStudy** es una plataforma integral de gestión del estudio diseñada para optimizar la productividad mediante la gamificación y una estética inspirada en el anime (Zen/Modo Oscuro). La aplicación permite a los usuarios gestionar tareas (misiones), realizar seguimiento de su progreso académico y mantener ráfagas de estudio mediante herramientas como el temporizador Pomodoro.

---

## 🚀 Justificación del Stack Tecnológico

El stack técnico de AniStudy ha sido seleccionado cuidadosamente para garantizar escalabilidad, rendimiento y una experiencia de usuario fluida:

### **Backend: Node.js & Express**
*   **Ecosistema Robusto:** Node.js ofrece un ecosistema maduro con una gestión de dependencias eficiente mediante NPM.
*   **Asincronía:** La naturaleza no bloqueante de Node.js es ideal para manejar múltiples peticiones concurrentes, lo que garantiza una API rápida y eficiente.
*   **Arquitectura MVC:** Implementamos una estructura Modelo-Vista-Controlador para separar claramente la lógica de negocio, el acceso a datos y las rutas.

### **Base de Datos: MongoDB**
*   **Flexibilidad de Esquemas:** Al ser NoSQL, MongoDB permite una evolución ágil de los datos, algo crítico para el sistema de estadísticas dinámicas y logros de AniStudy.
*   **Escalabilidad:** Diseñada para crecer horizontalmente, asegurando que el rendimiento se mantenga incluso con un gran volumen de misiones y registros de usuario.

### **Frontend: Angular (v18+)**
*   **Arquitectura Modular:** El uso de componentes y servicios permite un código reutilizable y fácil de mantener.
*   **Tipado Estricto con TypeScript:** Minimiza errores en tiempo de desarrollo y mejora la legibilidad del código.
*   **Reactividad:** Gracias a las herramientas de Angular (como RxJS y Signals), AniStudy ofrece una interfaz dinámica que reacciona instantáneamente a las acciones del usuario.

---

## 🛠️ Despliegue Local

Siga estos pasos para ejecutar AniStudy en su entorno local:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Alejandroallop/anistudy.git
    cd anistudy
    ```

2.  **Instalar dependencias:**
    Instale las dependencias tanto en la raíz como en las carpetas de los servidores:
    ```bash
    npm install
    npm install --prefix backend
    npm install --prefix frontend
    ```

3.  **Configurar variables de entorno:**
    Cree un archivo `.env` dentro de la carpeta `backend` basado en el archivo `.env.example` (o los requerimientos del sistema):
    ```env
    PORT=3000
    MONGO_URI=tu_conexion_mongodb
    JWT_SECRET=tu_secreto_seguro
    ```

4.  **Poblar la base de datos (Seed):**
    Ejecute el script para insertar los datos iniciales y misiones:
    ```bash
    npm run seed --prefix backend
    ```

5.  **Ejecutar la aplicación:**
    Puede levantar ambos servidores simultáneamente desde la raíz del proyecto:
    ```bash
    npm run dev:all
    ```
    *   Backend disponible en: `http://localhost:3000`
    *   Frontend disponible en: `http://localhost:4200`

---

## ☁️ Cloud Deployment

La aplicación se encuentra actualmente desplegada y es accesible de forma pública a través del siguiente enlace:

🔗 **anistudy-frontend.vercel.app**

---


