const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Football Players API',
      version: '1.0.0'
    }
  },
  apis: []
});

app.get('/', (req, res) => {
  res.send('Backend running');
});

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}`);
});