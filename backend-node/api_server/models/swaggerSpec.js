const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Proyecto Común - Football API',
    version: '1.0.0',
    description: 'API para la gestión de jugadores, estadísticas, comentarios e Inteligencia Artificial.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor Local de Desarrollo'
    },
    {
      url: 'https://backend-node-1089195621635.europe-west1.run.app',
      description: 'Cloud Run'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  tags: [
    { name: 'Jugadores', description: 'CRUD de jugadores, comentarios y valoraciones en MongoDB local' },
    { name: 'Externa', description: 'Búsqueda e importación desde API-Football' },
    { name: 'IA (Inteligencia Artificial)', description: 'Generación de contenido inteligente con LLMs (Gemini/Groq)' }
  ],
  paths: {
    '/api/players': {
      get: {
        tags: ['Jugadores'],
        summary: 'Listar jugadores con filtros avanzados de búsqueda',
        description: 'PÚBLICO: Permite listar todos los jugadores locales o buscar filtrando por nombre, equipo/liga y fecha de alta sin estar autenticado.',
        parameters: [
          { in: 'query', name: 'name', schema: { type: 'string' }, description: 'Filtrar por nombre del jugador (búsqueda parcial)' },
          { in: 'query', name: 'team', schema: { type: 'string' }, description: 'Filtrar por equipo o liga' },
          { in: 'query', name: 'desdeFecha', schema: { type: 'string', format: 'date' }, description: 'Filtrar altas desde una fecha (YYYY-MM-DD)' }
        ],
        responses: {
          200: { description: 'Lista de jugadores devuelta con éxito' },
          500: { description: 'Error interno del servidor' }
        }
      },
      post: {
        tags: ['Jugadores'],
        summary: 'Insertar nuevo jugador desde formulario o manual',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'team', 'position', 'imageUrl'],
                properties: {
                  name: { type: 'string' },
                  team: { type: 'string' },
                  league: { type: 'string' },
                  position: { type: 'string' },
                  imageUrl: { type: 'string' },
                  stats: {
                    type: 'object',
                    properties: {
                      goals: { type: 'number', default: 0 },
                      assists: { type: 'number', default: 0 },
                      matchesPlayed: { type: 'number', default: 0 }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Jugador creado correctamente' },
          401: { description: 'No autenticado o token de Firebase ausente' }
        }
      }
    },
    '/api/players/{id}': {
      get: {
        tags: ['Jugadores'],
        summary: 'Obtener los datos y estadísticas de un jugador por ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'ID de MongoDB del jugador' }],
        responses: {
          200: { description: 'Jugador encontrado' },
          404: { description: 'No se encontró ningún jugador con ese ID' }
        }
      },
      put: {
        tags: ['Jugadores'],
        summary: 'Editar datos de un jugador (Solo Administrador)',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  team: { type: 'string' },
                  position: { type: 'string' },
                  imageUrl: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Jugador actualizado con éxito' },
          403: { description: 'Acceso denegado. Se requieren permisos de administrador.' }
        }
      },
      delete: {
        tags: ['Jugadores'],
        summary: 'Eliminar un jugador del sistema (Solo Administrador)',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          204: { description: 'Jugador eliminado correctamente' },
          403: { description: 'Acceso denegado. Se requieren permisos de administrador.' }
        }
      }
    },
    '/api/players/{id}/comments': {
      get: {
        tags: ['Jugadores'],
        summary: 'Obtener todos los comentarios de un jugador específico',
        description: 'Acceso público. Devuelve la lista de comentarios asociados al ID de un futbolista.',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            description: 'ID de MongoDB del jugador del que quieres ver los comentarios',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Lista de comentarios recuperada con éxito',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    results: { type: 'number', example: 1 },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          _id: { type: 'string', example: '660a1b2c3d4e5f6a7b8c9d01' },
                          player: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0de' },
                          username: { type: 'string', example: 'usuario@correo.com' },
                          text: { type: 'string', example: '¡Qué buen rendimiento tiene este jugador!' },
                          rating: { type: 'number', example: 5 },
                          createdAt: { type: 'string', example: '2026-05-25T20:15:00.000Z' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          500: {
            description: 'Error interno del servidor'
          }
        }
      },
      post: {
        tags: ['Jugadores'],
        summary: 'Añadir un comentario y valoración (0-5 estrellas) a un jugador',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'ID del jugador a comentar' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['text', 'rating'],
                properties: {
                  text: { type: 'string', maxLength: 1000 },
                  rating: { type: 'number', minimum: 0, maximum: 5 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Comentario y estrellas guardados correctamente' },
          401: { description: 'Token inválido o ausente' }
        }
      }
    },
    '/api/players/{playerId}/comments/{commentId}': {
      delete: {
        tags: ['Jugadores'],
        summary: 'Borrar un comentario específico de un jugador (Solo Administrador)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'playerId', required: true, schema: { type: 'string' } },
          { in: 'path', name: 'commentId', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Comentario purgado con éxito' },
          403: { description: 'Acceso denegado' }
        }
      }
    },
    '/api/external/search-player': {
      get: {
        tags: ['Externa'],
        summary: 'Buscar futbolistas reales en la API Externa (API-Football)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'search', required: true, schema: { type: 'string' }, description: 'Nombre del futbolista (Mínimo 3 letras)' },
          { in: 'query', name: 'league', schema: { type: 'string' } },
          { in: 'query', name: 'season', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Resultados devueltos y pre-formateados listos para importar' },
          400: { description: 'Falta el parámetro obligatorio search' }
        }
      }
    },
    '/api/external/import': {
      post: {
        tags: ['Externa'],
        summary: 'Importar uno o varios jugadores seleccionados a la base de datos local',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['players'],
                properties: {
                  players: { 
                    type: 'array', 
                    items: { type: 'object' }
                  },
                  latitude: { type: 'number' },
                  longitude: { type: 'number' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Jugadores clonados e insertados con éxito en MongoDB local' },
          400: { description: 'Estructura o array de jugadores erróneo' }
        }
      }
    },
    '/api/external/equipo-ideal': {
      get: {
        tags: ['IA (Inteligencia Artificial)'],
        summary: 'Solicitar la generación de un "Equipo Ideal" basado en tus jugadores locales',
        description: 'Extrae los jugadores de MongoDB, analiza estadísticas mediante el LLM de Google Gemini y redacta un once táctico ideal en formato JSON.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { 
            description: 'Estrategia de equipo ideal calculada por la IA',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        formacion: { type: 'string' },
                        once_ideal: { type: 'array', items: { type: 'object' } },
                        analisis_tactico: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          },
          400: { description: 'Insuficientes jugadores en la BD (Se requieren al menos 11)' }
        }
      }
    }
  }
};

module.exports = swaggerSpec;