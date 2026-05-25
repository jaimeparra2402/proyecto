const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: String, required: true },       // ID de Firebase
  author: { type: String, required: true },       // Nombre/Email del autor
  text: { 
    type: String, 
    required: true, 
    maxlength: 1000                               // Máximo 1000 caracteres pedido por el proyecto
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 5                                        // Valoración de 0 a 5 estrellas
  },
  createdAt: { type: Date, default: Date.now }
});

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  team: { type: String, required: true, trim: true },      // Equipo o Liga para los filtros
  league: { type: String, trim: true },
  position: { type: String, required: true },
  imageUrl: { type: String, required: true },             // URL de la imagen (Cámara o API externa)
  stats: {
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    matchesPlayed: { type: Number, default: 0 }
  },
  comments: [commentSchema],                              // Comentarios incrustados
  createdAt: { type: Date, default: Date.now }             // Fecha de alta en el sistema (para filtros)
});

// Índice para mejorar las búsquedas por texto
playerSchema.index({ name: 'text', team: 'text' });

module.exports = mongoose.model('Player', playerSchema);