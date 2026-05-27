require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./api_server/models/db');

// 🆕 PASO NUEVO: Importar e inicializar Firebase Admin SDK
const admin = require('firebase-admin');
try {
  // Cargamos el archivo JSON de credenciales de la raíz del proyecto
  const serviceAccount = require('./firebase-service-account.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin SDK inicializado correctamente');
} catch (error) {
  console.error('Error crítico al inicializar Firebase Admin:', error.message);
}

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const playerRoutes = require('./api_server/routes/playerRoutes');
const userRoutes = require('./api_server/routes/userRoutes');
const externalRoutes = require('./api_server/routes/externalRoutes');

app.use('/api/players', playerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/external', externalRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    ok: true,
    database: mongoose.connection.readyState === 1
  });
});

try {
  const swaggerUi = require('swagger-ui-express');
  const swaggerSpec = require('./api_server/models/swaggerSpec');

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { cacheControl: false }));
  app.get('/swagger-ui', (req, res) => res.redirect('/api-docs'));

  console.log('Swagger docs disponibles en http://localhost:3000/api-docs');
} catch (err) {
  console.error('Swagger failed to load:', err.message);
}

app.use((err, req, res, next) => {
  console.error("Error cazado en el servidor:", err.stack);

  if (err.code === 11000) {
    return res.status(400).json({
      status: 'fail',
      message: 'El registro ya existe en la base de datos.'
    });
  }

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Error interno del servidor'
  });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB conectado con éxito');
  } catch (err) {
    console.error('MongoDB no disponible:', err.message);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Node app listening on port ${PORT}`);
  });
};

startServer();

module.exports = { app };