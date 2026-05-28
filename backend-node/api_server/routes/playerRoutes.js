const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const authController = require('../controllers/authController');


router.get('/', playerController.getAllPlayers);

router.get('/:id', playerController.getPlayer);



router.post('/', authController.protect, playerController.createPlayer);

router.post('/:id/comments',  playerController.addComment);
router.get('/:id/comments', playerController.getCommentsByPlayer); 
// =======================================================
// 👑 ACCESO DE ADMINISTRADOR (Solo rol 'admin')
// =======================================================
router.put('/:id', authController.protect, authController.restrictTo('admin'), playerController.updatePlayer);
router.delete('/:id', authController.protect, authController.restrictTo('admin'), playerController.deletePlayer);
router.delete('/:playerId/comments/:commentId', authController.protect, authController.restrictTo('admin'), playerController.deleteComment);

module.exports = router;