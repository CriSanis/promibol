# 🎨 Promibol - Plataforma de Promoción de Artistas Bolivianos

Una plataforma web moderna y completa para la promoción de artistas nacionales bolivianos, conectando talentos con el público y facilitando la organización de eventos culturales.

## ✨ Características Principales

### 🎭 **Gestión de Artistas**
- Perfiles completos de artistas con biografías y especialidades
- Sistema de upload de imágenes de perfil
- Gestión de redes sociales y portafolios
- Dashboard personalizado para artistas

### 🎪 **Gestión de Eventos**
- Calendario de eventos culturales
- Sistema de reservas y confirmaciones
- Filtros por categoría y fecha
- Gestión completa de eventos por artistas

### 🔐 **Sistema de Autenticación**
- Registro e inicio de sesión seguro
- Roles diferenciados (Artista/Cliente)
- Autenticación JWT
- Protección de rutas

### 🔍 **Búsqueda y Filtros**
- Búsqueda en tiempo real
- Filtros por categoría artística
- Filtros por fecha para eventos
- Interfaz intuitiva de filtrado

### 📱 **Diseño Responsive**
- Interfaz moderna y atractiva
- Diseño adaptable a móviles y desktop
- Animaciones y transiciones suaves
- Paleta de colores vibrante

### 🔔 **Sistema de Notificaciones**
- Notificaciones en tiempo real
- Diferentes tipos de alertas (éxito, error, info)
- Auto-cierre configurable
- Interfaz no intrusiva

## 🛠️ Stack Tecnológico

### **Frontend**
- **React 18** - Biblioteca de interfaz de usuario
- **Redux Toolkit** - Gestión de estado global
- **React Router** - Navegación entre páginas
- **Tailwind CSS** - Framework de estilos
- **Axios** - Cliente HTTP

### **Backend**
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación por tokens
- **Multer** - Manejo de uploads de archivos
- **bcryptjs** - Hash de contraseñas

### **Herramientas de Desarrollo**
- **Create React App** - Configuración de React
- **Concurrently** - Ejecución simultánea de procesos
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Prefijos CSS automáticos

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** (v16 o superior) - [Descargar](https://nodejs.org/)
- **PostgreSQL** (v12 o superior) - [Descargar](https://www.postgresql.org/download/)
- npm o yarn

### 🛠️ Instalación Rápida (Recomendado)

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/promibol.git
cd promibol

# 2. Ejecutar setup automático
npm run setup:full
```

### 📋 Instalación Manual

#### 1. Clonar e instalar dependencias
```bash
git clone https://github.com/tu-usuario/promibol.git
cd promibol
npm install
```

#### 2. Configurar PostgreSQL
```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE promibol;

# Salir
\q
```

#### 3. Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar con tus credenciales
nano .env  # o usar tu editor preferido
```

**Contenido del archivo `.env`:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=promibol
DB_USER=postgres
DB_PASSWORD=tu_password_aqui
PORT=5000
NODE_ENV=development
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
CORS_ORIGIN=http://localhost:3000
UPLOAD_PATH=./public/uploads
MAX_FILE_SIZE=5242880
```

#### 4. Inicializar base de datos
```bash
npm run db:init
```

#### 5. Ejecutar la aplicación
```bash
# Desarrollo (frontend + backend)
npm run dev

# Solo backend
npm run server

# Solo frontend
npm start
```

## 🗄️ Gestión de Base de Datos

### Comandos Disponibles
```bash
# Inicializar base de datos (crear tablas y datos de prueba)
npm run db:init

# Ejecutar migraciones pendientes
npm run db:migrate

# Revertir migración específica
npm run db:rollback <version>

# Resetear base de datos completamente
npm run db:reset
```

### Datos de Prueba Incluidos
- **3 artistas** con perfiles completos
- **3 eventos** de diferentes categorías
- **1 usuario cliente** para pruebas

### Credenciales de Prueba
- **Artista**: artista@promibol.com / password
- **Cliente**: cliente@promibol.com / password

## 📱 Acceso a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔧 Solución de Problemas Comunes

### Error de conexión a PostgreSQL
```bash
# Verificar que PostgreSQL esté ejecutándose
# Windows: services.msc (buscar PostgreSQL)
# macOS: brew services list | grep postgresql
# Linux: sudo systemctl status postgresql
```

### Error "database does not exist"
```bash
psql -U postgres -c "CREATE DATABASE promibol;"
```

### Error de permisos en uploads
```bash
mkdir -p public/uploads
chmod 755 public/uploads
```

📖 **Para más detalles, consulta la [Guía Completa de Instalación](INSTALL.md)**

## 📁 Estructura del Proyecto

```
promibol/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Navigation.js
│   │   ├── SearchAndFilters.js
│   │   ├── NotificationContainer.js
│   │   └── ProtectedRoute.js
│   ├── pages/              # Páginas principales
│   │   ├── HomePage.js
│   │   ├── ArtistsPage.js
│   │   ├── EventsPage.js
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   └── ArtistDashboard.js
│   ├── store/              # Redux store
│   │   ├── store.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── artistsSlice.js
│   │       ├── eventsSlice.js
│   │       └── uiSlice.js
│   ├── utils/              # Utilidades
│   │   └── db.js
│   └── App.js
├── server.js               # Servidor Express
├── public/                 # Archivos estáticos
│   └── uploads/           # Imágenes subidas
└── package.json
```

## 🔧 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión

### Artistas
- `GET /api/artists` - Obtener todos los artistas
- `GET /api/artists/:id` - Obtener artista específico
- `PUT /api/artists/profile` - Actualizar perfil de artista
- `POST /api/artists/upload-image` - Subir imagen de perfil

### Eventos
- `GET /api/events` - Obtener todos los eventos
- `POST /api/events` - Crear nuevo evento
- `DELETE /api/events/:id` - Eliminar evento

## 🎯 Funcionalidades Implementadas

### ✅ Completado
- [x] Backend completo con Express y PostgreSQL
- [x] Autenticación JWT real
- [x] Gestión de estado con Redux Toolkit
- [x] Navegación con React Router
- [x] Sistema de upload de imágenes
- [x] Búsqueda y filtros avanzados
- [x] Sistema de notificaciones
- [x] Diseño responsive
- [x] Dashboard de artistas
- [x] Gestión de eventos
- [x] Protección de rutas

### 🚧 En Desarrollo
- [ ] Sistema de pagos
- [ ] Analytics y métricas
- [ ] Chat en tiempo real
- [ ] Sistema de reseñas
- [ ] Notificaciones push
- [ ] App móvil

## 🎨 Diseño y UX

### Paleta de Colores
- **Primarios**: Rosa (`pink-500/600`), Púrpura (`purple-600/700`)
- **Secundarios**: Amarillo (`yellow-400/500`), Naranja (`orange-500/600`)
- **Neutros**: Grises para texto y fondos

### Componentes Visuales
- Cards con efectos hover
- Gradientes atractivos
- Animaciones suaves
- Iconografía moderna

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt
- Autenticación JWT
- Validación de formularios
- Sanitización de datos
- Protección CSRF
- Headers de seguridad

## 📊 Base de Datos

### Tablas Principales
- `users` - Usuarios del sistema
- `artist_profiles` - Perfiles de artistas
- `events` - Eventos culturales
- `bookings` - Reservas de eventos

## 🚀 Despliegue

### Producción
```bash
# Build del frontend
npm run build

# Configurar variables de producción
NODE_ENV=production
DB_HOST=tu_host_produccion
JWT_SECRET=secreto_super_seguro_produccion

# Iniciar servidor
npm run server
```

### Docker (Próximamente)
```bash
docker-compose up -d
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [TuUsuario](https://github.com/TuUsuario)

## 🙏 Agradecimientos

- Comunidad artística boliviana
- Contribuidores del proyecto
- Herramientas open source utilizadas

## 📞 Contacto

- **Email**: tu-email@ejemplo.com
- **GitHub**: [@TuUsuario](https://github.com/TuUsuario)
- **LinkedIn**: [Tu Perfil](https://linkedin.com/in/tu-perfil)

---

⭐ **¡Dale una estrella al proyecto si te gustó!**
