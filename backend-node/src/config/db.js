const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MongoDB conectado correctamente: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error al conectar a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('Conexión de MongoDB perdida');
});

mongoose.connection.on('error', (err) => {
  console.error(`Error en la conexión de Mongoose: ${err}`);
});

module.exports = connectDB;