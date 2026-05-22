const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/futbol_db';
    await mongoose.connect(dbURI);
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = connectDB;