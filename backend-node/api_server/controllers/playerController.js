const Player = require('../models/Player');

exports.getPlayers = async (req, res) => {
  try {
    const { name, teamLeague, startDate } = req.query;
    let query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (teamLeague) query.teamLeague = { $regex: teamLeague, $options: 'i' };
    if (startDate) query.createdAt = { $gte: new Date(startDate) };
    const players = await Player.find(query);
    res.status(200).json({ status: 'success', data: players });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ status: 'fail', message: 'Not found' });
    res.status(200).json({ status: 'success', data: player });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.createPlayer = async (req, res) => {
  try {
    const { name, teamLeague, imageUrl, latitude, longitude } = req.body;
    if (!name || !teamLeague || !imageUrl || !latitude || !longitude) {
      return res.status(400).json({ status: 'fail', message: 'Missing fields' });
    }
    const newPlayer = new Player({
      name,
      teamLeague,
      imageUrl,
      location: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] }
    });
    await newPlayer.save();
    res.status(201).json({ status: 'success', data: newPlayer });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updatePlayer = async (req, res) => {
  try {
    const { name, teamLeague, imageUrl, latitude, longitude } = req.body;
    let updateData = { name, teamLeague, imageUrl };
    if (latitude && longitude) {
      updateData.location = { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] };
    }
    const player = await Player.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!player) return res.status(404).json({ status: 'fail', message: 'Not found' });
    res.status(200).json({ status: 'success', data: player });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) return res.status(404).json({ status: 'fail', message: 'Not found' });
    res.status(200).json({ status: 'success', message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { author, comment, rating } = req.body;
    const player = await Player.findById(req.params.playerId);
    if (!player) return res.status(404).json({ status: 'fail', message: 'Not found' });
    player.comments.push({ author, comment, rating });
    await player.save();
    res.status(201).json({ status: 'success', data: player.comments });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { playerId, commentId } = req.params;
    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ status: 'fail', message: 'Not found' });
    const comment = player.comments.id(commentId);
    if (!comment) return res.status(404).json({ status: 'fail', message: 'Not found' });
    comment.deleteOne();
    await player.save();
    res.status(200).json({ status: 'success', message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};