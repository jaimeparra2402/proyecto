const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/futbol_db';
    
    await mongoose.connect(dbURI, {
      serverSelectionTimeoutMS: 3000
    });
  } catch (err) {
    console.error('Database connection skipped:', err.message);
  }
};

module.exports = connectDB;