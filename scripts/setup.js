const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando Promibol...\n');

// Verificar si existe archivo .env
if (!fs.existsSync('.env')) {
  console.log('📝 Creando archivo .env...');
  const envContent = `# Configuración de la base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=promibol
DB_USER=postgres
DB_PASSWORD=tu_password_aqui

# Configuración del servidor
PORT=5000
NODE_ENV=development

# JWT Secret (cambiar en producción)
JWT_SECRET=promibol_jwt_secret_2024

# Configuración de CORS
CORS_ORIGIN=http://localhost:3000

# Configuración de uploads
UPLOAD_PATH=./public/uploads
MAX_FILE_SIZE=5242880
`;
  
  fs.writeFileSync('.env', envContent);
  console.log('✅ Archivo .env creado');
  console.log('⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales de PostgreSQL\n');
}

// Crear directorio de uploads si no existe
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  console.log('📁 Creando directorio de uploads...');
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Directorio de uploads creado');
}

// Verificar si PostgreSQL está instalado
try {
  console.log('🔍 Verificando PostgreSQL...');
  execSync('psql --version', { stdio: 'pipe' });
  console.log('✅ PostgreSQL detectado');
} catch (error) {
  console.log('❌ PostgreSQL no encontrado');
  console.log('📥 Por favor instala PostgreSQL desde: https://www.postgresql.org/download/');
  console.log('💡 En Windows, puedes usar: https://www.postgresql.org/download/windows/');
  process.exit(1);
}

// Instalar dependencias
console.log('\n📦 Instalando dependencias...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencias instaladas');
} catch (error) {
  console.log('❌ Error instalando dependencias');
  process.exit(1);
}

// Inicializar base de datos
console.log('\n🗄️  Inicializando base de datos...');
try {
  execSync('npm run db:init', { stdio: 'inherit' });
  console.log('✅ Base de datos inicializada');
} catch (error) {
  console.log('❌ Error inicializando base de datos');
  console.log('💡 Asegúrate de que:');
  console.log('   1. PostgreSQL esté ejecutándose');
  console.log('   2. Las credenciales en .env sean correctas');
  console.log('   3. La base de datos "promibol" exista');
  process.exit(1);
}

console.log('\n🎉 ¡Configuración completada!');
console.log('\n📋 Próximos pasos:');
console.log('   1. Edita el archivo .env con tus credenciales reales');
console.log('   2. Ejecuta: npm run dev');
console.log('   3. Abre http://localhost:3000 en tu navegador');
console.log('\n🔑 Credenciales de prueba:');
console.log('   - Artista: artista@promibol.com / password');
console.log('   - Cliente: cliente@promibol.com / password'); 