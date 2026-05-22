const Player = require('../models/Player');

exports.searchExternalPlayers = async (req, res) => {
  try {
    const { search, league, season } = req.query;
    if (!search) {
      return res.status(400).json({ status: 'fail', message: 'Missing search query' });
    }

    const currentSeason = season || '2025'; 
    let url = `https://v3.football.api-sports.io/players?search=${encodeURIComponent(search)}&season=${currentSeason}`;
    
    if (league) url += `&league=${league}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.FOOTBALL_API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    });

    const data = await response.json();

    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(400).json({ status: 'fail', errors: data.errors });
    }

    res.status(200).json({ status: 'success', data: data.response || [] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.importPlayers = async (req, res) => {
  try {
    const { players, latitude, longitude } = req.body;
    
    if (!players || !Array.isArray(players)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid or missing players array' });
    }

    const clientLat = latitude !== undefined ? parseFloat(latitude) : 0;
    const clientLng = longitude !== undefined ? parseFloat(longitude) : 0;

    const savedPlayers = [];
    
    for (const p of players) {
      const newPlayer = new Player({
        name: p.name,
        teamLeague: p.teamLeague || 'Importado de API Externa',
        imageUrl: p.imageUrl || 'https://via.placeholder.com/150',
        location: {
          type: 'Point',
          coordinates: [clientLng, clientLat] 
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