const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const authController = require('../controllers/authController');

router.route('/')
  .get(playerController.getPlayers)
  .post(authController.protect, playerController.createPlayer);

router.route('/:id')
  .get(playerController.getPlayerById)
  .put(authController.protect, authController.restrictTo('admin'), playerController.updatePlayer)
  .delete(authController.protect, authController.restrictTo('admin'), playerController.deletePlayer);

router.route('/:playerId/comments')
  .post(authController.protect, playerController.addComment);

router.route('/:playerId/comments/:commentId')
  .delete(authController.protect, authController.restrictTo('admin'), playerController.deleteComment);

module.exports = router;