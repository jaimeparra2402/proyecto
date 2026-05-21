const Player = require('../models/Player');

exports.searchExternalPlayers = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ status: 'fail', message: 'Missing search query' });
    }
    const response = await fetch(`https://v3.football.api-sports.io/players?search=${search}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.FOOTBALL_API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    });
    const data = await response.json();
    res.status(200).json({ status: 'success', data: data.response || [] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.importPlayers = async (req, res) => {
  try {
    const { players } = req.body;
    if (!players || !Array.isArray(players)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid or missing players array' });
    }
    const savedPlayers = [];
    for (const p of players) {
      const newPlayer = new Player({
        name: p.name,
        teamLeague: p.teamLeague,
        imageUrl: p.imageUrl,
        location: {
          type: 'Point',
          coordinates: [parseFloat(p.longitude || 0), parseFloat(p.latitude || 0)]
        }
      });
      await newPlayer.save();
      savedPlayers.push(newPlayer);
    }
    res.status(201).json({ status: 'success', importedCount: savedPlayers.length, data: savedPlayers });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};