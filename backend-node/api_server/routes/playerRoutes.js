const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.route('/')
  .get(playerController.getPlayers)
  .post(playerController.createPlayer);

router.route('/:id')
  .get(playerController.getPlayerById)
  .put(playerController.updatePlayer)
  .delete(playerController.deletePlayer);

router.route('/:playerId/comments')
  .post(playerController.addComment);

router.route('/:playerId/comments/:commentId')
  .delete(playerController.deleteComment);

module.exports = router;