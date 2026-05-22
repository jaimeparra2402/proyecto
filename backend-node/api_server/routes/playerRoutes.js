const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const authController = require('../controllers/authController');

router.get('/', playerController.getPlayers);
router.get('/:id', playerController.getPlayerById);

router.use(authController.protect);

router.post('/:playerId/comments', playerController.addComment);

router.use(authController.restrictTo('admin'));

router.post('/', playerController.createPlayer);
router.put('/:id', playerController.updatePlayer);
router.delete('/:id', playerController.deletePlayer);
router.delete('/:playerId/comments/:commentId', playerController.deleteComment);

module.exports = router;