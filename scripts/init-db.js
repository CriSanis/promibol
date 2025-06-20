const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'promibol',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

async function initDatabase() {
  try {
    console.log('🔄 Inicializando base de datos...');
    
    // Forzar la eliminación de tablas para un reinicio limpio
    await pool.query('DROP TABLE IF EXISTS bookings CASCADE;');
    await pool.query('DROP TABLE IF EXISTS events CASCADE;');
    await pool.query('DROP TABLE IF EXISTS artist_profiles CASCADE;');
    await pool.query('DROP TABLE IF EXISTS users CASCADE;');
    console.log('🧹 Tablas anteriores eliminadas.');

    // Crear tablas
    await pool.query(`
      -- Tabla de usuarios
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('artist', 'client')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      -- Tabla de perfiles de artistas
      CREATE TABLE IF NOT EXISTS artist_profiles (
        user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        artist_name VARCHAR(255) NOT NULL,
        bio TEXT,
        location VARCHAR(100),
        website VARCHAR(255),
        image_url VARCHAR(255),
        tags TEXT[],
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      -- Tabla de eventos
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        artist_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      -- Tabla de reservas
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Crear índices para mejor rendimiento
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
      CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
      CREATE INDEX IF NOT EXISTS idx_events_artist_id ON events(artist_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
    `);

    // Crear triggers para updated_at
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await pool.query(`DROP TRIGGER IF EXISTS update_users_updated_at ON users;`);
    await pool.query(`
      CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await pool.query(`DROP TRIGGER IF EXISTS update_artist_profiles_updated_at ON artist_profiles;`);
    await pool.query(`
      CREATE TRIGGER update_artist_profiles_updated_at BEFORE UPDATE ON artist_profiles
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await pool.query(`DROP TRIGGER IF EXISTS update_events_updated_at ON events;`);
    await pool.query(`
      CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await pool.query(`DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;`);
    await pool.query(`
      CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('✅ Tablas y Triggers creados/actualizados exitosamente');

    // Insertar datos de prueba
    await insertSampleData();

    console.log('✅ Base de datos inicializada completamente');
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

async function insertSampleData() {
  try {
    console.log('🔄 Insertando datos de prueba...');
    
    // Limpiar tablas para asegurar un estado limpio en cada ejecución
    await pool.query('TRUNCATE TABLE bookings, events, artist_profiles, users RESTART IDENTITY CASCADE;');
    console.log('🧹 Tablas existentes limpiadas.');

    // Verificar si ya existen datos
    const existingUsers = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(existingUsers.rows[0].count) > 0) {
      console.log('ℹ️  Ya existen datos en la base de datos, saltando inserción de datos de prueba');
      return;
    }

    // Insertar usuarios de prueba
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password', 10);

    const usersToInsert = [
      {
        user: { name: 'María Juana', email: 'juana@promibol.com', password: hashedPassword, role: 'artist' },
        profile: { artist_name: 'Maria Juana', bio: 'Grupo folklórico de renombre, fusionando tradición y modernidad.', location: 'Cochabamba', website: 'https://mariajuanabo.com', image_url: 'https://i.scdn.co/image/ab6761610000e5eb9b5b6a7b7d1e8c6c5a6e4b5f', tags: ['folklore', 'fusión'] }
      },
      {
        user: { name: 'Octavia', email: 'octavia@promibol.com', password: hashedPassword, role: 'artist' },
        profile: { artist_name: 'Octavia', bio: 'Banda de rock icónica de Bolivia, con una trayectoria de más de 30 años.', location: 'La Paz', website: 'https://octavia.bo', image_url: 'https://lastfm.freetls.fastly.net/i/u/ar0/a29699661f4c4f3ca441a58145ebd6d9.jpg', tags: ['rock', 'pop', 'alternativo'] }
      },
      {
        user: { name: 'Chila Jatun', email: 'chila@promibol.com', password: hashedPassword, role: 'artist' },
        profile: { artist_name: 'Chila Jatun', bio: 'El legado de los Kjarkas, llevando el folklore boliviano a nuevas generaciones.', location: 'Cochabamba', website: 'https://chilajatun.com', image_url: 'https://e.snmc.io/i/1200/s/4c235174092b3c1f506821369325c341/10574011', tags: ['folklore', 'caporal', 'tinku'] }
      },
      {
        user: { name: 'Cliente Ejemplo', email: 'cliente@promibol.com', password: hashedPassword, role: 'client' },
        profile: null
      }
    ];

    const artistIds = [];

    for (const { user, profile } of usersToInsert) {
      const result = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
        [user.name, user.email, user.password, user.role]
      );
      const userId = result.rows[0].id;

      if (user.role === 'artist' && profile) {
        artistIds.push(userId);
        await pool.query(
          'INSERT INTO artist_profiles (user_id, artist_name, bio, location, website, image_url, tags) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [userId, profile.artist_name, profile.bio, profile.location, profile.website, profile.image_url, profile.tags]
        );
      }
    }

    // Insertar eventos de prueba
    const events = [
      {
        title: 'Concierto Acústico: Octavia',
        date: '2024-08-15',
        location: 'Teatro Municipal Alberto Saavedra Pérez, La Paz',
        description: 'Una noche íntima con los grandes éxitos de Octavia en formato acústico.',
        category: 'Rock',
        artist_id: artistIds[1], // Octavia
        image_url: 'https://www.opinion.com.bo/media/opinion/images/2020/07/24/2020072421314999679.jpg'
      },
      {
        title: 'Festival del Charango: Chila Jatun',
        date: '2024-09-05',
        location: 'Palacio de los Deportes, Cochabamba',
        description: 'Chila Jatun presenta su nuevo disco en un festival lleno de folklore y energía.',
        category: 'Folklore',
        artist_id: artistIds[2], // Chila Jatun
        image_url: 'https://imagenes.unitel.bo/unitel-2022/uploads/2023/04/04/642c4c82c2a29.jpeg'
      },
      {
        title: 'Noche de Taquiraris: Maria Juana',
        date: '2024-09-22',
        location: 'Feria Exposición, Santa Cruz',
        description: 'Maria Juana celebra a Santa Cruz con un repertorio lleno de taquiraris y carnavalitos.',
        category: 'Folklore',
        artist_id: artistIds[0], // Maria Juana
        image_url: 'https://i.ytimg.com/vi/Id8p_91iEdE/maxresdefault.jpg'
      }
    ];

    for (const event of events) {
      await pool.query(
        'INSERT INTO events (title, date, location, description, category, artist_id, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [event.title, event.date, event.location, event.description, event.category, event.artist_id, event.image_url]
      );
    }

    console.log('✅ Datos de prueba insertados correctamente');
  } catch (error) {
    console.error('❌ Error insertando datos de prueba:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('🎉 ¡Base de datos inicializada exitosamente!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { initDatabase }; 