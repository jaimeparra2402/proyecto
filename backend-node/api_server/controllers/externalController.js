const Player = require('../models/Player');

// 1. BUSCAR JUGADORES EN LA API EXTERNA
exports.searchExternalPlayers = async (req, res) => {
  try {
    const { search, league, season } = req.query;
    if (!search) {
      return res.status(400).json({ status: 'fail', message: 'Missing search query' });
    }

    // La API exige una temporada concreta para buscar jugadores por texto
    const currentSeason = season || '2025'; 
    let url = `https://v3.football.api-sports.io/players?search=${encodeURIComponent(search)}&season=${currentSeason}`;
    
    if (league) url += `&league=${league}`;

    // Hacemos la petición HTTP hacia la API externa usando fetch nativo de Node
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.FOOTBALL_API_KEY || 'TU_CLAVE_AQUI',
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    });

    const data = await response.json();

    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(400).json({ status: 'fail', errors: data.errors });
    }

    const rawResponse = data.response || [];

    // Mapeamos y simplificamos el resultado para enviárselo mascadito a tu app de Ionic
    const formattedPlayers = rawResponse.map(item => ({
      name: `${item.player.firstname} ${item.player.lastname}`,
      team: item.statistics[0]?.team?.name || 'Desconocido',
      league: item.statistics[0]?.league?.name || 'Desconocida',
      position: item.statistics[0]?.games?.position || 'Desconocida',
      imageUrl: item.player.photo || 'https://via.placeholder.com/150',
      stats: {
        goals: item.statistics[0]?.goals?.total || 0,
        assists: item.statistics[0]?.goals?.assists || 0,
        matchesPlayed: item.statistics[0]?.games?.appearences || 0
      }
    }));

    res.status(200).json({ 
      status: 'success', 
      results: formattedPlayers.length,
      data: formattedPlayers 
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 2. IMPORTAR UNO O VARIOS JUGADORES DESDE IONIC A TU MONGODB
exports.importPlayers = async (req, res) => {
  try {
    const { players, latitude, longitude } = req.body;
    
    if (!players || !Array.isArray(players)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid or missing players array' });
    }

    // Procesamos tus datos de geolocalización (¡Excelente extra para la app!)
    const clientLat = latitude !== undefined ? parseFloat(latitude) : 0;
    const clientLng = longitude !== undefined ? parseFloat(longitude) : 0;

    const savedPlayers = [];
    
    // Recorremos el array de jugadores que el usuario seleccionó en Ionic para importar
    for (const p of players) {
      const newPlayer = new Player({
        name: p.name,
        team: p.team || 'Importado',
        league: p.league || 'API Externa',
        position: p.position || 'Desconocida',
        imageUrl: p.imageUrl || 'https://via.placeholder.com/150',
        stats: {
          goals: p.stats?.goals || 0,
          assists: p.stats?.assists || 0,
          matchesPlayed: p.stats?.matchesPlayed || 0
        },
        // Mantenemos tu genial sistema de geolocalización por si tu modelo lo soporta como punto GeoJSON
        location: {
          type: 'Point',
          coordinates: [clientLng, clientLat] 
        }
      });

      await newPlayer.save();
      savedPlayers.push(newPlayer);
    }
    
    res.status(201).json({ 
      status: 'success', 
      importedCount: savedPlayers.length, 
      data: savedPlayers 
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};