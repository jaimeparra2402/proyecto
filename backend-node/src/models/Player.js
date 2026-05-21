const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  comment: {
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  teamLeague: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], 
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  comments: [CommentSchema]
});

PlayerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Player', PlayerSchema);