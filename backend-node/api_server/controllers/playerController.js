const Player = require('../models/Player');

exports.getAllPlayers = async (req, res) => {
  try {
    const { name, team, desdeFecha } = req.query;
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (team) {
      query.$or = [
        { team: { $regex: team, $options: 'i' } },
        { league: { $regex: team, $options: 'i' } }
      ];
    }

    if (desdeFecha) {
      query.createdAt = { $gte: new Date(desdeFecha) };
    }

    const players = await Player.find(query).sort('-createdAt');
    
    res.status(200).json({
      status: 'success',
      results: players.length,
      data: { players }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getPlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ status: 'fail', message: 'Jugador no encontrado' });
    
    res.status(200).json({ status: 'success', data: { player } });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

exports.createPlayer = async (req, res) => {
  try {
    const newPlayer = await Player.create(req.body);
    res.status(201).json({ status: 'success', data: { player: newPlayer } });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

exports.updatePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!player) return res.status(404).json({ status: 'fail', message: 'Jugador no encontrado' });
    
    res.status(200).json({ status: 'success', data: { player } });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

exports.deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) return res.status(404).json({ status: 'fail', message: 'Jugador no encontrado' });
    
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text, rating, latitude, longitude, author } = req.body; 
    const player = await Player.findById(req.params.id);
    
    if (!player) return res.status(404).json({ status: 'fail', message: 'Jugador no encontrado' });

    const newComment = {
      author: author || 'Anónimo',
      text,
      rating,
      latitude,   
      longitude   
    };

    player.comments.push(newComment);
    await player.save();

    res.status(201).json({ status: 'success', data: { player } });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

exports.getCommentsByPlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró ningún jugador con ese ID'
      });
    }

    res.status(200).json({
      status: 'success',
      results: player.comments.length,
      data: player.comments 
    });

  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { playerId, commentId } = req.params;
    
    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ status: 'fail', message: 'Jugador no encontrado' });

    player.comments.id(commentId).deleteOne();
    await player.save();

    res.status(200).json({ status: 'success', message: 'Comentario eliminado', data: { player } });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};