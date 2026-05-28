const express = require('express');
const router = express.Router();
const externalController = require('../controllers/externalController');
const aiController = require('../controllers/aiController'); 
const authController = require('../controllers/authController');

router.get('/search-player', externalController.searchExternalPlayers);

router.get('/equipo-ideal', authController.protect, aiController.generateIdealTeam); 

module.exports = router;