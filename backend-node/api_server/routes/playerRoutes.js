const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const authController = require('../controllers/authController');

// =======================================================
// 🟢 ACCESO PÚBLICO (Usuarios NO registrados y registrados)
// =======================================================

// 1 y 2. Listado completo y buscar jugadores (¡LIBRE! Sin authController.protect)
router.get('/', playerController.getAllPlayers);

// Ver el detalle de un jugador al pinchar en él (¡LIBRE!)
router.get('/:id', playerController.getPlayer);


// =======================================================
// 🔒 ACCESO PROTEGIDO (Solo usuarios logueados en Firebase)
// =======================================================

// Insertar nuevo jugador desde formulario o API externa
router.post('/', authController.protect, playerController.createPlayer);

// Añadir comentarios con valoración (0-5 estrellas)
router.post('/:id/comments', authController.protect, playerController.addComment);
router.get('/:id/comments', playerController.getCommentsByPlayer); 
// =======================================================
// 👑 ACCESO DE ADMINISTRADOR (Solo rol 'admin')
// =======================================================
router.put('/:id', authController.protect, authController.restrictTo('admin'), playerController.updatePlayer);
router.delete('/:id', authController.protect, authController.restrictTo('admin'), playerController.deletePlayer);
router.delete('/:playerId/comments/:commentId', authController.protect, authController.restrictTo('admin'), playerController.deleteComment);

module.exports = router;