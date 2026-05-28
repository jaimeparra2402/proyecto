const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: { type: String, default: 'Anónimo' },
  text: { 
    type: String, 
    required: true, 
    maxlength: 1000                               
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 5                                        
  },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  team: { type: String, required: true, trim: true },      
  league: { type: String, trim: true },
  position: { type: String, required: true },
  imageUrl: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },             
  stats: {
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    matchesPlayed: { type: Number, default: 0 }
  },
  comments: [commentSchema],                              
  createdAt: { type: Date, default: Date.now }             
});

playerSchema.index({ name: 'text', team: 'text' });

module.exports = mongoose.model('Player', playerSchema);