const express = require('express');
const router = express.Router();
const externalController = require('../controllers/externalController');
const aiController = require('../controllers/aiController'); // 👈 Importamos el nuevo controlador
const authController = require('../controllers/authController');

// Rutas de la API Externa de Fútbol
router.get('/search-player', authController.protect, externalController.searchExternalPlayers);
router.post('/import', authController.protect, externalController.importPlayers);

// Nueva Ruta de Inteligencia Artificial para el Equipo Ideal
router.get('/equipo-ideal', authController.protect, aiController.generateIdealTeam); // 👈 Añadimos la ruta

module.exports = router;