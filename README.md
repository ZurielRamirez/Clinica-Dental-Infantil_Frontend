# 🦷 Clínica Dental Infantil — Sistema de Gestión Odontopedriática

> **Plataforma web para la gestión de citas odontopedriáticas, control de expedientes clínicos y comunicación automatizada con tutores.**

---

##  Integrantes del Equipo
* **Ramírez Bautista Amisadai Zuriel**
* **Santiago Vásquez David Osmar**

---

##  Descripción de la Problemática
Las clínicas odontopedriáticas enfrentan frecuentemente una alta tasa de ausentismo y cancelaciones imprevistas debido al olvido de las citas por parte de los padres de familia. A esta problemática se le suma la complejidad administrativa de gestionar manualmente el historial clínico infantil, asociar tutores a múltiples pacientes y la carencia de un canal de comunicación automatizado.

---

##  Tecnologías Utilizadas

### **Frontend**
* **React.js** (v18+) — Librería principal para la construcción de interfaces de usuario interactivas basadas en componentes.
* **Vite** — Empaquetador y entorno de desarrollo rápido para módulos frontend.
* **Tailwind CSS** — Framework de utilidades CSS para el diseño responsivo y personalización visual.
* **React Router DOM** — Gestión de rutas en el cliente y navegación protegida por roles de usuario.
* **SweetAlert2** — Modales interactivos para confirmaciones, errores y alertas en interfaz.

### **Backend & Base de Datos**
* **Laravel 12** — Framework de PHP para el desarrollo de la API RESTful, autenticación y lógica de negocio.
* **PostgreSQL** — Sistema de gestión de base de datos relacional para la persistencia segura de expedientes y agendas.
* **Eloquent ORM** — Mapeo objeto-relacional y consultas optimizadas a la base de datos.

---

##  Enlaces del Proyecto

*  **Diseño en Figma (Wireframes & UI):** [Ver diseño en Figma](https://www.figma.com/proto/UslAP1R0S6tCbOXo4dbeYQ/Proyecto_prograweb?node-id=1-2&t=QGdAWBjZBB0jf4Ja-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A2)
*  **Repositorio en de frontend en GitHub:** [Ver repositorio](https://github.com/ZurielRamirez/Clinica-Dental-Infantil_Frontend.git)
*  **Repositorio en de backend en GitHub:** [Ver repositorio](https://github.com/ZurielRamirez/Clinica-Dental-Infantil-Backend.git)
*  **Tablero de Gestión (GitHub Projects):** [Ver tablero del proyecto](https://github.com/users/ZurielRamirez/projects/3/views/1)
*  **Link del proyecto en el VPS :** [Ver pagina del proyecto]( https://dentalinfantiloaxaca.xyz)
*  **Link de la API del proyecto :** [Ver API del proyecto]( https://api.dentalinfantiloaxaca.xyz/api/login)

---

##  Características Principales

### **Módulo Tutor / Padres de Familia**
* **Gestión de Pacientes:** Registro y administración de fichas médicas de los hijos (edad, alergias, observaciones).
* **Agendamiento de Citas:** Solicitud, consulta e historial de citas médicas.
* **Notificaciones:** Recepción de recordatorios y confirmaciones.

###  **Módulo Doctor / Odontopediatra**
* **Agenda del Día:** Visualización clara de pacientes agendados y su estado de consulta en tiempo real.
* **Registro Clínico:** Captura de tratamientos aplicados (selladores, flúor, resinas) y notas del expediente.
* **Comunicación Directa:** Simulación y envío de recordatorios vía WhatsApp, SMS y correo electrónico.

###  **Módulo Administrador**
* **Gestión de Usuarios:** Control de accesos y asignación de roles (Admin, Doctor, Tutor).
* **Tablas Server-Side:** Paginación, búsqueda interactiva y filtrado de datos directamente desde el servidor.

---
##  Instalación y Configuración Local

### **Requisitos Previos**
* Node.js (v18 o superior)
* npm o yarn
* PHP 8.2+ y Composer (para backend)

### **Pasos para ejecutar el Frontend:**

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/tu-usuario/clinica-dental-infantil.git](https://github.com/tu-usuario/clinica-dental-infantil.git)
   cd clinica-dental-infantil

2. **Instalar dependencias de Node:**
   ```bash
   npm install
   ```

3.  **Configurar variables de entorno:**
   ```bash
    VITE_API_BASE_URL=https://api.dentalinfantiloaxaca.xyz/api
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```