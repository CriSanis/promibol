const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando sistema para Promibol...\n');

let allChecksPassed = true;

// Verificar Node.js
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
  
  if (majorVersion >= 16) {
    console.log(`✅ Node.js ${nodeVersion} (Requerido: v16+)`);
  } else {
    console.log(`❌ Node.js ${nodeVersion} (Requerido: v16+)`);
    allChecksPassed = false;
  }
} catch (error) {
  console.log('❌ Node.js no encontrado');
  allChecksPassed = false;
}

// Verificar npm
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ npm ${npmVersion}`);
} catch (error) {
  console.log('❌ npm no encontrado');
  allChecksPassed = false;
}

// Verificar PostgreSQL
try {
  const pgVersion = execSync('psql --version', { encoding: 'utf8' }).trim();
  console.log(`✅ PostgreSQL ${pgVersion}`);
} catch (error) {
  console.log('❌ PostgreSQL no encontrado');
  console.log('💡 Instala PostgreSQL desde: https://www.postgresql.org/download/');
  allChecksPassed = false;
}

// Verificar archivo .env
if (fs.existsSync('.env')) {
  console.log('✅ Archivo .env encontrado');
  
  // Verificar variables críticas
  const envContent = fs.readFileSync('.env', 'utf8');
  const requiredVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'];
  const missingVars = [];
  
  requiredVars.forEach(varName => {
    if (!envContent.includes(`${varName}=`)) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length === 0) {
    console.log('✅ Variables de entorno configuradas');
  } else {
    console.log(`⚠️  Variables faltantes: ${missingVars.join(', ')}`);
  }
} else {
  console.log('❌ Archivo .env no encontrado');
  console.log('💡 Ejecuta: cp env.example .env');
  allChecksPassed = false;
}

// Verificar directorio de uploads
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (fs.existsSync(uploadsDir)) {
  console.log('✅ Directorio de uploads existe');
} else {
  console.log('⚠️  Directorio de uploads no existe');
  console.log('💡 Se creará automáticamente al ejecutar la aplicación');
}

// Verificar dependencias
if (fs.existsSync('node_modules')) {
  console.log('✅ Dependencias instaladas');
} else {
  console.log('❌ Dependencias no instaladas');
  console.log('💡 Ejecuta: npm install');
  allChecksPassed = false;
}

// Verificar conexión a base de datos
console.log('\n🔌 Probando conexión a base de datos...');
try {
  require('dotenv').config();
  const { Pool } = require('pg');
  
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'promibol',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
  });
  
  pool.query('SELECT NOW()', (err, result) => {
    if (err) {
      console.log('❌ Error conectando a base de datos');
      console.log('💡 Verifica:');
      console.log('   - PostgreSQL esté ejecutándose');
      console.log('   - Las credenciales en .env sean correctas');
      console.log('   - La base de datos "promibol" exista');
      allChecksPassed = false;
    } else {
      console.log('✅ Conexión a base de datos exitosa');
    }
    pool.end();
    
    // Verificar puertos disponibles
    console.log('\n🌐 Verificando puertos...');
    try {
      const net = require('net');
      
      // Verificar puerto 3000 (React)
      const reactServer = net.createServer();
      reactServer.listen(3000, () => {
        reactServer.close();
        console.log('✅ Puerto 3000 disponible (React)');
        
        // Verificar puerto 5000 (Express)
        const expressServer = net.createServer();
        expressServer.listen(5000, () => {
          expressServer.close();
          console.log('✅ Puerto 5000 disponible (Express)');
          
          // Resumen final
          console.log('\n📋 Resumen:');
          if (allChecksPassed) {
            console.log('🎉 ¡Sistema listo para Promibol!');
            console.log('\n🚀 Para ejecutar:');
            console.log('   npm run dev');
          } else {
            console.log('⚠️  Algunos problemas detectados');
            console.log('\n🔧 Para solucionar:');
            console.log('   npm run setup:full');
          }
          
          console.log('\n📖 Para más información:');
          console.log('   - README.md');
          console.log('   - INSTALL.md');
        });
      });
    } catch (error) {
      console.log('⚠️  No se pudo verificar disponibilidad de puertos');
    }
  });
} catch (error) {
  console.log('❌ Error cargando módulos de base de datos');
  console.log('💡 Ejecuta: npm install');
  allChecksPassed = false;
} 