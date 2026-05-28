const express = require('express');
const router = express.Router();
const externalController = require('../controllers/externalController');
const aiController = require('../controllers/aiController'); 
const authController = require('../controllers/authController');

// Rutas de la API Externa de Fútbol
router.get('/search-player', externalController.searchExternalPlayers);
router.post('/import', authController.protect, externalController.importPlayers);

// Nueva Ruta de Inteligencia Artificial para el Equipo Ideal
router.get('/equipo-ideal', authController.protect, aiController.generateIdealTeam); 

module.exports = router;