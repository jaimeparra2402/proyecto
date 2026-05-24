const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose'); 
const connectDB = require('./api_server/models/db');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));


try {
  const appRouter = require('./app_server/routes/index'); 
  app.use('/', appRouter);
} catch (e) {
  console.log('Nota: app_server/routes/index.js no encontrado. Saltando por ahora.');
}


const playerRoutes = require('./api_server/routes/playerRoutes');
const userRoutes = require('./api_server/routes/userRoutes');
const externalRoutes = require('./api_server/routes/externalRoutes');

app.use('/api/noticias', playerRoutes); 
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
  const swaggerJsdoc = require('swagger-jsdoc');

  const swaggerSpec = swaggerJsdoc({
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Football Players API',
        version: '1.0.0',
        description: 'Documentación de la API de Jugadores y Noticias'
      },
      servers: [
        {
          url: 'http://localhost:8080',
          description: 'Servidor Local'
        }
      ]
    },
    apis: [
      path.join(__dirname, 'api_server/routes/*.js'),
      path.join(__dirname, 'api_server/models/*.js')
    ]
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/swagger-ui', (req, res) => res.redirect('/api-docs'));
  
  console.log('Swagger docs disponibles en /api-docs');
} catch (err) {
  console.error('Swagger failed to load:', err.message);
}

try {
  const errorHandler = require('./api_server/middleware/errorHandler');
  app.use(errorHandler);
} catch (e) {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  });
}

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Node app listening on port ${PORT}`);
});

module.exports = { app, server };