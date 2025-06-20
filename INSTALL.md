# 🚀 Guía de Instalación - Promibol

## 📋 Requisitos Previos

### 1. Node.js
- **Versión**: 16.x o superior
- **Descarga**: https://nodejs.org/

### 2. PostgreSQL
- **Versión**: 12.x o superior
- **Descarga**: https://www.postgresql.org/download/

#### Instalación en Windows:
1. Descarga el instalador desde: https://www.postgresql.org/download/windows/
2. Ejecuta el instalador
3. Anota la contraseña del usuario `postgres`
4. Mantén el puerto por defecto (5432)

#### Instalación en macOS:
```bash
# Con Homebrew
brew install postgresql
brew services start postgresql

# O descarga desde la web oficial
```

#### Instalación en Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 🛠️ Instalación Rápida

### Opción 1: Setup Automático (Recomendado)
```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd promibol

# Ejecutar setup automático
npm run setup:full
```

### Opción 2: Instalación Manual

#### 1. Clonar e instalar dependencias
```bash
git clone <tu-repositorio>
cd promibol
npm install
```

#### 2. Configurar base de datos PostgreSQL
```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE promibol;

# Salir de psql
\q
```

#### 3. Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar .env con tus credenciales
nano .env  # o usar tu editor preferido
```

**Contenido del archivo .env:**
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

## 🚀 Ejecutar la Aplicación

### Desarrollo
```bash
# Ejecutar frontend y backend simultáneamente
npm run dev
```

### Producción
```bash
# Construir frontend
npm run build

# Ejecutar solo backend
npm run server
```

## 📱 Acceso a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔑 Credenciales de Prueba

### Usuarios Artistas:
- **Email**: artista@promibol.com
- **Password**: password

- **Email**: carlos@promibol.com
- **Password**: password

- **Email**: lucia@promibol.com
- **Password**: password

### Usuario Cliente:
- **Email**: cliente@promibol.com
- **Password**: password

## 🛠️ Comandos Útiles

### Gestión de Base de Datos
```bash
# Inicializar base de datos (crear tablas y datos de prueba)
npm run db:init

# Ejecutar migraciones pendientes
npm run db:migrate

# Revertir última migración
npm run db:rollback <version>

# Resetear base de datos completamente
npm run db:reset
```

### Desarrollo
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Solo backend
npm run server

# Solo frontend
npm start

# Construir para producción
npm run build
```

## 🔧 Solución de Problemas

### Error: "connection refused" en PostgreSQL
```bash
# Verificar que PostgreSQL esté ejecutándose
# Windows:
services.msc  # Buscar "PostgreSQL" y asegurar que esté iniciado

# macOS:
brew services list | grep postgresql

# Linux:
sudo systemctl status postgresql
```

### Error: "database does not exist"
```bash
# Crear la base de datos
psql -U postgres -c "CREATE DATABASE promibol;"
```

### Error: "permission denied" en uploads
```bash
# Crear directorio de uploads
mkdir -p public/uploads
chmod 755 public/uploads
```

### Error: "JWT_SECRET not defined"
```bash
# Asegurar que el archivo .env existe y tiene JWT_SECRET
echo "JWT_SECRET=tu_secret_aqui" >> .env
```

## 📁 Estructura del Proyecto

```
promibol/
├── scripts/
│   ├── init-db.js      # Inicialización de base de datos
│   ├── migrate.js      # Sistema de migraciones
│   └── setup.js        # Setup automático
├── src/
│   ├── components/     # Componentes React
│   ├── pages/         # Páginas de la aplicación
│   ├── store/         # Redux store y slices
│   └── utils/         # Utilidades
├── public/
│   └── uploads/       # Archivos subidos
├── server.js          # Servidor Express
├── .env               # Variables de entorno
└── package.json       # Dependencias y scripts
```

## 🚀 Despliegue en Producción

### Variables de Entorno para Producción
```env
NODE_ENV=production
DB_HOST=tu_host_produccion
DB_PORT=5432
DB_NAME=promibol_prod
DB_USER=promibol_user
DB_PASSWORD=password_seguro
JWT_SECRET=secret_muy_seguro_y_largo
CORS_ORIGIN=https://tu-dominio.com
```

### Comandos de Despliegue
```bash
# Instalar dependencias de producción
npm ci --only=production

# Construir frontend
npm run build

# Ejecutar migraciones
npm run db:migrate

# Iniciar servidor
npm run server
```

## 📞 Soporte

Si encuentras problemas durante la instalación:

1. Verifica que todos los requisitos previos estén instalados
2. Revisa los logs de error
3. Asegúrate de que las credenciales de PostgreSQL sean correctas
4. Verifica que el puerto 5000 esté disponible

---

¡Disfruta usando Promibol! 🎨🎭🎵 