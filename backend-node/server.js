require('dotenv').config();
const express = require('express');
const connectDB = require('./api_server/config/db');
const apiPlayerRoutes = require('./api_server/routes/playerRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

connectDB();

app.use('/api/players', apiPlayerRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: "online" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

app.listen(PORT, () => {});