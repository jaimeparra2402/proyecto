const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const playerRoutes = require('./api_server/routes/playerRoutes'); 
const errorHandler = require('./api_server/middleware/errorHandler');
const connectDB = require('./api_server/models/db');
connectDB();

const app = express();

app.use(cors()); 
app.use(express.json()); 

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Futbolistas - Universidad de Almería',
      version: '1.0.0',
      description: 'Documentación técnica interactiva de los endpoints CRUD del proyecto común.',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://tu-servicio-cloud-run.run.app' 
          : `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
  },
  apis: ['./api_server/routes/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', ok: true, message: 'API Server Online' });
});

app.use('/api/players', playerRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    status: 'fail',
    error: 'Route not found',
    message: `La ruta ${req.originalUrl} no está definida en este servidor.`
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo con éxito en http://0.0.0.0:${PORT}`);
  });
}

module.exports = app;