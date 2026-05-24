const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Proyecto Común - Football API',
    version: '1.0.0',
    description: 'API para la gestión de jugadores, comentarios y usuarios.'
  },
  servers: [
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
    { name: 'Usuarios', description: 'Registro e inicio de sesión' },
    { name: 'Jugadores', description: 'CRUD de jugadores y comentarios' },
    { name: 'Externa', description: 'Búsqueda e importación desde API externa' }
  ],
  paths: {
    '/api/users/register': {
      post: {
        tags: ['Usuarios'],
        summary: 'Registrar nuevo usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' },
                  role: { type: 'string', enum: ['user', 'admin'] }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Usuario creado y token generado' },
          400: { description: 'Error de validación' }
        }
      }
    },
    '/api/users/login': {
      post: {
        tags: ['Usuarios'],
        summary: 'Inicio de sesión',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Token JWT generado' },
          401: { description: 'Credenciales incorrectas' }
        }
      }
    },
    '/api/noticias': {
      get: {
        tags: ['Jugadores'],
        summary: 'Listar jugadores con filtros opcionales',
        parameters: [
          { in: 'query', name: 'name', schema: { type: 'string' }, description: 'Filtrar por nombre' },
          { in: 'query', name: 'teamLeague', schema: { type: 'string' }, description: 'Filtrar por equipo/liga' },
          { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date' }, description: 'Filtrar por fecha de alta' }
        ],
        responses: {
          200: { description: 'Lista de jugadores' },
          500: { description: 'Error interno' }
        }
      },
      post: {
        tags: ['Jugadores'],
        summary: 'Crear jugador (solo admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'teamLeague', 'imageUrl', 'latitude', 'longitude'],
                properties: {
                  name: { type: 'string' },
                  teamLeague: { type: 'string' },
                  imageUrl: { type: 'string' },
                  latitude: { type: 'number' },
                  longitude: { type: 'number' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Jugador creado' },
          401: { description: 'No autenticado' },
          403: { description: 'Sin permisos' }
        }
      }
    },
    '/api/noticias/{id}': {
      get: {
        tags: ['Jugadores'],
        summary: 'Obtener jugador por ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Jugador encontrado' },
          404: { description: 'No encontrado' }
        }
      },
      put: {
        tags: ['Jugadores'],
        summary: 'Actualizar jugador (solo admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  teamLeague: { type: 'string' },
                  imageUrl: { type: 'string' },
                  latitude: { type: 'number' },
                  longitude: { type: 'number' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Jugador actualizado' },
          404: { description: 'No encontrado' }
        }
      },
      delete: {
        tags: ['Jugadores'],
        summary: 'Eliminar jugador (solo admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Jugador eliminado' },
          404: { description: 'No encontrado' }
        }
      }
    },
    '/api/noticias/{playerId}/comments': {
      post: {
        tags: ['Jugadores'],
        summary: 'Añadir comentario a un jugador',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'playerId', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['author', 'comment', 'rating', 'latitude', 'longitude'],
                properties: {
                  author: { type: 'string' },
                  comment: { type: 'string', maxLength: 1000 },
                  rating: { type: 'number', minimum: 0, maximum: 5 },
                  latitude: { type: 'number' },
                  longitude: { type: 'number' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Comentario añadido' },
          401: { description: 'No autenticado' },
          404: { description: 'Jugador no encontrado' }
        }
      }
    },
    '/api/noticias/{playerId}/comments/{commentId}': {
      delete: {
        tags: ['Jugadores'],
        summary: 'Eliminar comentario (solo admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'path', name: 'playerId', required: true, schema: { type: 'string' } },
          { in: 'path', name: 'commentId', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Comentario eliminado' },
          404: { description: 'No encontrado' }
        }
      }
    },
    '/api/external/search': {
      get: {
        tags: ['Externa'],
        summary: 'Buscar jugadores en API externa',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'search', required: true, schema: { type: 'string' } },
          { in: 'query', name: 'league', schema: { type: 'string' } },
          { in: 'query', name: 'season', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Resultados de la búsqueda externa' },
          400: { description: 'Falta el parámetro search' }
        }
      }
    },
    '/api/external/import': {
      post: {
        tags: ['Externa'],
        summary: 'Importar jugadores desde API externa',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['players'],
                properties: {
                  players: { type: 'array', items: { type: 'object' } },
                  latitude: { type: 'number' },
                  longitude: { type: 'number' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Jugadores importados correctamente' },
          400: { description: 'Array de jugadores inválido' }
        }
      }
    }
  }
};

module.exports = swaggerSpec;