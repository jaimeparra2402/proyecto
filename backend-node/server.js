// Cargar variables de entorno
require('dotenv').config();

const express = require('express');
const connectDB = async () => {
  // Importamos la función de conexión que creamos en el paso anterior
  const dbConnect = require('./src/config/db');
  await dbConnect();
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

connectDB();

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: "online",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    message: 'Backend Node (TRWM) funcionando correctamente v1.0.2' 
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Ha ocurrido un error interno en el servidor'
  });
});

app.listen(PORT, () => {
  console.log(`⚡ Servidor Express corriendo en el puerto ${PORT}`);
});