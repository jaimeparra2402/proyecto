const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const playerRoutes = require('./api_server/routes/playerRoutes');
const errorHandler = require('./api_server/middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Football Players API',
      version: '1.0.0',
      description: 'API for managing football players',
    },
    servers: [
      {
        url: process.env.SERVER_URL || `http://localhost:${process.env.PORT || 8080}`,
      },
    ],
  },
  apis: ['./api_server/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    ok: true,
    message: 'API Server Online',
  });
});

// Si estas rutas usan DB y fallan, puedes comentarlas por ahora
// app.use('/api/players', playerRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    error: 'Route not found',
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;