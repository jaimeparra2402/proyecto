const Player = require('../models/Player');

// 1. LISTADO COMPLETO Y BÚSQUEDA CON FILTROS (Público)
// Soporta filtrar por ?name=... & team=... & desdeFecha=YYYY-MM-DD
exports.getAllPlayers = async (req, res) => {
  try {
    const { name, team, desdeFecha } = req.query;
    let query = {};

    // Filtro por nombre (búsqueda parcial, insensible a mayúsculas)
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    // Filtro por equipo o liga
    if (team) {
      query.$or = [
        { team: { $regex: team, $options: 'i' } },
        { league: { $regex: team, $options: 'i' } }
      ];
    }

    // Filtro por fecha de alta en el sistema
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

// 2. OBTENER UN JUGADOR POR ID (Público)
exports.getPlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ status: 'fail', message: 'Jugador no encontrado' });
    
    res.status(200).json({ status: 'success', data: { player } });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// 3. INSERTAR JUGADOR desde Formulario o API Externa (Registrado)
exports.createPlayer = async (req, res) => {
  try {
    const newPlayer = await Player.create(req.body);
    res.status(201).json({ status: 'success', data: { player: newPlayer } });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// 4. EDITAR JUGADOR (Solo Administrador)
exports.updatePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!player) return res.status(404).json({ status: 'fail', message: 'Jugador no encontrado' });
    
    res.status(200).json({ status: 'success', data: { player } });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// 5. ELIMINAR JUGADOR (Solo Administrador)
exports.deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) return res.status(404).json({ status: 'fail', message: 'Jugador no encontrado' });
    
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// 6. AÑADIR COMENTARIO CON VALORACIÓN (Registrado)
exports.addComment = async (req, res) => {
  try {
    // 1. Recogemos también la latitud y longitud que mandará Ionic al comentar
    const { text, rating, latitude, longitude } = req.body; 
    const player = await Player.findById(req.params.id);
    
    if (!player) return res.status(404).json({ status: 'fail', message: 'Jugador no encontrado' });

    const newComment = {
      userId: req.user.id,
      author: req.user.username,
      text,
      rating,
      latitude,   // 👈 ¡Lo guardamos en el subdocumento del comentario!
      longitude   // 👈 ¡Lo guardamos en el subdocumento del comentario!
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
    // 1. Buscamos al jugador por su ID usando el modelo Player (que ya lo tienes importado)
    const player = await Player.findById(req.params.id);

    // 2. Si el jugador no existe, avisamos
    if (!player) {
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró ningún jugador con ese ID'
      });
    }

    // 3. Devolvemos DIRECTAMENTE el array de comentarios que tiene guardado dentro
    res.status(200).json({
      status: 'success',
      results: player.comments.length,
      data: player.comments // 👈 Aquí van los comentarios de Haaland ("hola", "mal", etc.)
    });

  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
};

// 7. BORRAR UN COMENTARIO ESPECÍFICO (Solo Administrador)
exports.deleteComment = async (req, res) => {
  try {
    const { playerId, commentId } = req.params;
    
    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ status: 'fail', message: 'Jugador no encontrado' });

    // Removemos el comentario del array
    player.comments.id(commentId).deleteOne();
    await player.save();

    res.status(200).json({ status: 'success', message: 'Comentario eliminado', data: { player } });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};