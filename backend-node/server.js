const express = require('express');
const errorHandler = require('./api_server/middleware/errorHandler');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}

module.exports = app;