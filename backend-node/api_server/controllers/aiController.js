const { GoogleGenAI } = require('@google/genai');
const Player = require('../models/Player');

exports.generateIdealTeam = async (req, res) => {
  try {
    // 1. Obtener todos los jugadores insertados en nuestra base de datos local
    const localPlayers = await Player.find();

    if (localPlayers.length < 11) {
      return res.status(400).json({
        status: 'fail',
        message: `Necesitas tener al menos 11 jugadores en tu base de datos local para generar un equipo ideal. Actualmente tienes ${localPlayers.length}.`
      });
    }

    // 2. Formatear la lista de jugadores para que la IA la entienda a la perfección
    const playersListForAI = localPlayers.map(p => (
      `- Nombre: ${p.name}, Equipo: ${p.team}, Posición: ${p.position}, Goles: ${p.stats.goals}, Asistencias: ${p.stats.assists}, Partidos: ${p.stats.matchesPlayed}`
    )).join('\n');

    // 3. Inicializar el cliente de Google AI Studio con tu API Key
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 4. Diseñar las instrucciones exactas para el LLM
    const prompt = `
      Eres un director técnico de fútbol profesional de élite mundial. 
      A continuación te proporciono la lista de jugadores disponibles en mi base de datos local con sus respectivas estadísticas:
      
      ${playersListForAI}
      
      Por favor, analiza sus métricas y posiciones para armar el "Equipo Ideal" definitivo de 11 jugadores utilizando una formación táctica lógica (por ejemplo, 4-3-3 o 4-4-2).
      
      Quiero que me devuelvas la respuesta estrictamente en el siguiente formato JSON para que mi aplicación pueda parsearlo. No agregues texto introductorio ni conclusiones fuera del bloque JSON.
      
      Formato JSON requerido:
      {
        "formacion": "Ej: 4-3-3",
        "once_ideal": [
          { "nombre": "Nombre del jugador", "posicion": "Posición en el campo", "motivo": "Breve explicación técnica de por qué lo elegiste" }
        ],
        "analisis_tactico": "Una explicación global de cómo jugará este equipo ideal"
      }
    `;

    // 5. Llamar al modelo Gemini para generar el contenido
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // El modelo ultra-rápido e ideal para respuestas JSON estructuradas
      contents: prompt,
      // Le forzamos a que la salida obligatoriamente sea un JSON válido
      config: {
        responseMimeType: "application/json"
      }
    });

    // Parseamos la respuesta de la IA antes de enviársela al usuario
    const idealTeamResult = JSON.parse(response.text);

    res.status(200).json({
      status: 'success',
      data: idealTeamResult
    });

  } catch (error) {
    console.error('💥 Error en el generador de IA:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Error al generar el equipo ideal con el LLM: ' + error.message
    });
  }
};