const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'promibol',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Tabla para controlar migraciones
const MIGRATIONS_TABLE = 'schema_migrations';

async function createMigrationsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
        id SERIAL PRIMARY KEY,
        version VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      );
    `);
  } catch (error) {
    console.error('Error creando tabla de migraciones:', error);
    throw error;
  }
}

async function getExecutedMigrations() {
  try {
    const result = await pool.query(`SELECT version FROM ${MIGRATIONS_TABLE} ORDER BY id`);
    return result.rows.map(row => row.version);
  } catch (error) {
    console.error('Error obteniendo migraciones ejecutadas:', error);
    return [];
  }
}

async function executeMigration(version, name, sql) {
  try {
    console.log(`🔄 Ejecutando migración: ${version} - ${name}`);
    
    // Ejecutar la migración
    await pool.query(sql);
    
    // Registrar la migración como ejecutada
    await pool.query(
      `INSERT INTO ${MIGRATIONS_TABLE} (version, name) VALUES ($1, $2)`,
      [version, name]
    );
    
    console.log(`✅ Migración ${version} ejecutada exitosamente`);
  } catch (error) {
    console.error(`❌ Error ejecutando migración ${version}:`, error);
    throw error;
  }
}

async function runMigrations() {
  try {
    console.log('🔄 Iniciando proceso de migraciones...');
    
    // Crear tabla de migraciones si no existe
    await createMigrationsTable();
    
    // Obtener migraciones ya ejecutadas
    const executedMigrations = await getExecutedMigrations();
    
    // Definir migraciones disponibles
    const migrations = [
      {
        version: '001',
        name: 'Initial Schema',
        sql: `
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

          -- Tabla de perfiles de artistas
          CREATE TABLE IF NOT EXISTS artist_profiles (
            user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            bio TEXT,
            specialty VARCHAR(255),
            portfolio_url VARCHAR(255),
            profile_image VARCHAR(255),
            social_media JSONB DEFAULT '{}',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );

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

          -- Tabla de reservas
          CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
        `
      },
      {
        version: '002',
        name: 'Add Indexes',
        sql: `
          CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
          CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
          CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
          CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
          CREATE INDEX IF NOT EXISTS idx_events_artist_id ON events(artist_id);
          CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);
          CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
        `
      },
      {
        version: '003',
        name: 'Add Triggers',
        sql: `
          CREATE OR REPLACE FUNCTION update_updated_at_column()
          RETURNS TRIGGER AS $$
          BEGIN
              NEW.updated_at = NOW();
              RETURN NEW;
          END;
          $$ language 'plpgsql';

          CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

          CREATE TRIGGER update_artist_profiles_updated_at BEFORE UPDATE ON artist_profiles
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

          CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

          CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `
      },
      {
        version: '004',
        name: 'Add Event Status',
        sql: `
          ALTER TABLE events ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed'));
          CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
        `
      },
      {
        version: '005',
        name: 'Add User Profile Fields',
        sql: `
          ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
          ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(255);
          ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS experience_years INTEGER;
          ALTER TABLE artist_profiles ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2);
        `
      }
    ];
    
    // Ejecutar migraciones pendientes
    let executedCount = 0;
    for (const migration of migrations) {
      if (!executedMigrations.includes(migration.version)) {
        await executeMigration(migration.version, migration.name, migration.sql);
        executedCount++;
      } else {
        console.log(`ℹ️  Migración ${migration.version} ya ejecutada, saltando...`);
      }
    }
    
    if (executedCount === 0) {
      console.log('✅ No hay migraciones pendientes');
    } else {
      console.log(`✅ Se ejecutaron ${executedCount} migraciones`);
    }
    
  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Función para revertir migración específica
async function rollbackMigration(version) {
  try {
    console.log(`🔄 Revirtiendo migración: ${version}`);
    
    // Obtener información de la migración
    const result = await pool.query(
      `SELECT name FROM ${MIGRATIONS_TABLE} WHERE version = $1`,
      [version]
    );
    
    if (result.rows.length === 0) {
      console.log(`❌ Migración ${version} no encontrada`);
      return;
    }
    
    const migrationName = result.rows[0].name;
    
    // Definir rollbacks (en orden inverso)
    const rollbacks = {
      '005': `
        ALTER TABLE artist_profiles DROP COLUMN IF EXISTS hourly_rate;
        ALTER TABLE artist_profiles DROP COLUMN IF EXISTS experience_years;
        ALTER TABLE users DROP COLUMN IF EXISTS avatar;
        ALTER TABLE users DROP COLUMN IF EXISTS phone;
      `,
      '004': `
        DROP INDEX IF EXISTS idx_events_status;
        ALTER TABLE events DROP COLUMN IF EXISTS status;
      `,
      '003': `
        DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
        DROP TRIGGER IF EXISTS update_events_updated_at ON events;
        DROP TRIGGER IF EXISTS update_artist_profiles_updated_at ON artist_profiles;
        DROP TRIGGER IF EXISTS update_users_updated_at ON users;
        DROP FUNCTION IF EXISTS update_updated_at_column();
      `,
      '002': `
        DROP INDEX IF EXISTS idx_bookings_user_id;
        DROP INDEX IF EXISTS idx_bookings_event_id;
        DROP INDEX IF EXISTS idx_events_artist_id;
        DROP INDEX IF EXISTS idx_events_category;
        DROP INDEX IF EXISTS idx_events_date;
        DROP INDEX IF EXISTS idx_users_role;
        DROP INDEX IF EXISTS idx_users_email;
      `,
      '001': `
        DROP TABLE IF EXISTS bookings CASCADE;
        DROP TABLE IF EXISTS events CASCADE;
        DROP TABLE IF EXISTS artist_profiles CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
      `
    };
    
    const rollbackSQL = rollbacks[version];
    if (!rollbackSQL) {
      console.log(`❌ No hay rollback definido para la migración ${version}`);
      return;
    }
    
    // Ejecutar rollback
    await pool.query(rollbackSQL);
    
    // Eliminar registro de migración
    await pool.query(
      `DELETE FROM ${MIGRATIONS_TABLE} WHERE version = $1`,
      [version]
    );
    
    console.log(`✅ Migración ${version} revertida exitosamente`);
  } catch (error) {
    console.error(`❌ Error revirtiendo migración ${version}:`, error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const command = process.argv[2];
  const version = process.argv[3];
  
  if (command === 'rollback' && version) {
    rollbackMigration(version)
      .then(() => {
        console.log('🎉 ¡Rollback completado!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('💥 Error en rollback:', error);
        process.exit(1);
      });
  } else {
    runMigrations()
      .then(() => {
        console.log('🎉 ¡Migraciones completadas!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('💥 Error en migraciones:', error);
        process.exit(1);
      });
  }
}

module.exports = { runMigrations, rollbackMigration }; 