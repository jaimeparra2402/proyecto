const express = require('express');
const router = express.Router();
const externalController = require('../controllers/externalController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.get('/search', externalController.searchExternalPlayers);
router.post('/import', externalController.importPlayers);

module.exports = router;