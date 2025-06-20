const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./src/utils/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

// Configuración de Multer para upload de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  }
});

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_jwt', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rutas de autenticación
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Verificar si el usuario ya existe
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role]
    );

    // Crear token
    const token = jwt.sign(
      { id: newUser.rows[0].id, email, role },
      process.env.JWT_SECRET || 'tu_secreto_jwt',
      { expiresIn: '24h' }
    );

    res.json({
      user: newUser.rows[0],
      token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Crear token
    const token = jwt.sign(
      { id: user.rows[0].id, email, role: user.rows[0].role },
      process.env.JWT_SECRET || 'tu_secreto_jwt',
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Rutas de artistas
app.get('/api/artists', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id, 
        u.email,
        ap.artist_name, 
        ap.bio, 
        ap.location,
        ap.website,
        ap.image_url,
        ap.tags
      FROM users u
      JOIN artist_profiles ap ON u.id = ap.user_id
      WHERE u.role = 'artist'
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo artistas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/artists/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id, 
        u.email,
        ap.artist_name, 
        ap.bio, 
        ap.location,
        ap.website,
        ap.image_url,
        ap.tags
      FROM users u
      JOIN artist_profiles ap ON u.id = ap.user_id
      WHERE u.id = $1 AND u.role = 'artist'
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artista no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo artista:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/artists/:id/events', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM events WHERE artist_id = $1 ORDER BY date DESC', 
      [req.params.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(`Error obteniendo eventos para el artista ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.put('/api/artists/profile', authenticateToken, async (req, res) => {
  try {
    const { artist_name, bio, location, website, tags } = req.body;
    const { id: user_id } = req.user;

    // Actualizar perfil (upsert)
    const profile = await pool.query(`
      INSERT INTO artist_profiles (user_id, artist_name, bio, location, website, tags)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id)
      DO UPDATE SET
        artist_name = EXCLUDED.artist_name,
        bio = EXCLUDED.bio,
        location = EXCLUDED.location,
        website = EXCLUDED.website,
        tags = EXCLUDED.tags
      RETURNING *;
    `, [user_id, artist_name, bio, location, website, tags]);

    // También actualizamos el nombre en la tabla users para consistencia
    await pool.query('UPDATE users SET name = $1 WHERE id = $2', [artist_name, user_id]);

    res.json(profile.rows[0]);
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Upload de imagen de perfil
app.post('/api/artists/upload-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const user_id = req.user.id;

    // Se necesita el nombre de la tabla de usuarios en caso de que creemos el perfil
    const userResult = await pool.query('SELECT name FROM users WHERE id = $1', [user_id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const artistName = userResult.rows[0].name;

    // Usamos UPSERT: si el perfil no existe, lo crea con la imagen. Si existe, solo actualiza la imagen.
    await pool.query(`
      INSERT INTO artist_profiles (user_id, artist_name, image_url)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id)
      DO UPDATE SET image_url = EXCLUDED.image_url;
    `, [user_id, artistName, imageUrl]);

    res.json({ imageUrl });
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Rutas de eventos
app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY date DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo eventos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const { title, date, location, description, category } = req.body;
    
    const result = await pool.query(`
      INSERT INTO events (title, date, location, description, category, artist_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, date, location, description, category, req.user.id]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creando evento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM events WHERE id = $1 AND artist_id = $2',
      [req.params.id, req.user.id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    
    res.json({ message: 'Evento eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando evento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Rutas de Reservas (Bookings)
const bookingsRouter = express.Router();
bookingsRouter.use(authenticateToken);

bookingsRouter.post('/', async (req, res) => {
  const { event_id } = req.body;
  const user_id = req.user.id;
  try {
    const newBooking = await pool.query(
      'INSERT INTO bookings (event_id, user_id, status) VALUES ($1, $2, $3) RETURNING *',
      [event_id, user_id, 'pending']
    );
    res.status(201).json(newBooking.rows[0]);
  } catch (error) {
    console.error('Error creando reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

bookingsRouter.get('/my-bookings', async (req, res) => {
  const user_id = req.user.id;
  try {
    const result = await pool.query(`
      SELECT b.id, b.status, b.created_at, e.title as event_title, e.date as event_date, e.location as event_location
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.user_id = $1
      ORDER BY e.date DESC
    `, [user_id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo mis reservas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear reserva (booking)
app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const { event_title, event_date, message, artist_id, client_id, status } = req.body;
    const result = await pool.query(
      `INSERT INTO bookings (event_id, user_id, status, created_at, updated_at)
       VALUES (NULL, $1, $2, NOW(), NOW()) RETURNING *`,
      [client_id, status || 'confirmed']
    );
    // Puedes guardar más detalles en otra tabla o en campos adicionales si lo deseas
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creando reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.use('/api/bookings', bookingsRouter);

// Crear carpeta de uploads si no existe
const fs = require('fs');
if (!fs.existsSync('public/uploads')) {
  fs.mkdirSync('public/uploads', { recursive: true });
}

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}); 