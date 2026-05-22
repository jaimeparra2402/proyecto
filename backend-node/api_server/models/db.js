const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/futbol_db';
    await mongoose.connect(dbURI, {
      serverSelectionTimeoutMS: 1000
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed, continuing without DB:', err.message);
  }
};

module.exports = connectDB;