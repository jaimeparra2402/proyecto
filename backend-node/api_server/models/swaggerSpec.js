const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Proyecto Comun',
    version: '1.0.0',
    description: 'Documentación interactiva de la API para la gestión de jugadores y usuarios.'
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  paths: {
    '/api/users/login': {
      post: {
        tags: ['Usuarios'],
        summary: 'Inicio de sesión',
        responses: { 200: { description: 'Token JWT generado' } }
      }
    },
    '/api/players': {
      get: {
        tags: ['Jugadores'],
        summary: 'Listar y buscar jugadores',
        responses: { 200: { description: 'Lista de jugadores devuelta' } }
      },
      post: {
        tags: ['Jugadores'],
        summary: 'Crear jugador',
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'Jugador creado' } }
      }
    }
  }
};

module.exports = swaggerSpec;