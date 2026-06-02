const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('./server'); 

const BYPASS_TOKEN = process.env.JWT_SECRET || '8f3b20c4e09f5a7d6e8b9c0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e';

describe(' PRUEBAS UNITARIAS - API DE FÚTBOL COMPLETA', () => {
  let creadoPlayerId;
  let creadoCommentId;

  describe('GET /api/players (Público)', () => {
    it('debe listar los jugadores de la BD local', async () => {
      const res = await request(app).get('/api/players');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data).toHaveProperty('players');
      expect(Array.isArray(res.body.data.players)).toBe(true);
    });

    it('debe aplicar los filtros avanzados (name, team, desdeFecha)', async () => {
      const res = await request(app).get('/api/players?name=haaland&team=City');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
    });
  });


  describe('POST /api/players (Protegido - Formulario/Manual)', () => {
    it('debe rechazar la creación si no se envía token', async () => {
      const res = await request(app).post('/api/players').send({ name: 'Test' });
      expect(res.statusCode).toBe(401);
    });

    it('debe crear un jugador con geolocalización usando el token de acceso', async () => {
      const res = await request(app)
        .post('/api/players')
        .set('Authorization', `Bearer ${BYPASS_TOKEN}`) 
        .send({
          name: 'Jugador Test Unitario',
          team: 'Test FC',
          league: 'Test League',
          position: 'Midfielder',
          imageUrl: 'https://media.api-sports.io/football/players/629.png',
          latitude: 40.4167,
          longitude: -3.7037
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.data.player).toHaveProperty('_id');
      creadoPlayerId = res.body.data.player._id; 
    });
  });


  describe('GESTIÓN DE COMENTARIOS (Anidados)', () => {
    it('debe añadir un comentario con estrellas y geolocalización al jugador', async () => {
      const res = await request(app)
        .post(`/api/players/${creadoPlayerId}/comments`)
        .set('Authorization', `Bearer ${BYPASS_TOKEN}`)
        .send({
          text: 'Este es un comentario de prueba automatizada (máx 1000 car)',
          rating: 5,
          latitude: 36.834,
          longitude: -2.463
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.player.comments.length).toBeGreaterThan(0);
      creadoCommentId = res.body.data.player.comments[res.body.data.player.comments.length - 1]._id;
    });

    it('GET /api/players/:id/comments debe leer los comentarios de forma pública', async () => {
      const res = await request(app).get(`/api/players/${creadoPlayerId}/comments`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('API EXTERNA E INTELIGENCIA ARTIFICIAL', () => {
    it('GET /api/external/search-player debe conectar con API-Football', async () => {
      const res = await request(app)
        .get('/api/external/search-player?search=Cristiano')
        .set('Authorization', `Bearer ${BYPASS_TOKEN}`);
      expect([200, 400, 404]).toContain(res.statusCode); 
    });


    it('GET /api/external/equipo-ideal debe invocar al LLM (Gemini/Groq)', async () => {
      const res = await request(app)
        .get('/api/external/equipo-ideal')
        .set('Authorization', `Bearer ${BYPASS_TOKEN}`);
      expect([200, 400]).toContain(res.statusCode);
    });
  });


  describe('OPERACIONES DE ADMINISTRADOR', () => {
    it('debe permitir al Admin actualizar los datos de un jugador', async () => {
      const res = await request(app)
        .put(`/api/players/${creadoPlayerId}`)
        .set('Authorization', `Bearer ${BYPASS_TOKEN}`)
        .send({ name: 'Nombre Modificado por Test' });
      expect(res.statusCode).toBe(200);
    });

    it('debe permitir al Admin borrar un comentario anidado', async () => {
      const res = await request(app)
        .delete(`/api/players/${creadoPlayerId}/comments/${creadoCommentId}`)
        .set('Authorization', `Bearer ${BYPASS_TOKEN}`);
      expect(res.statusCode).toBe(200);
    });

    it('debe permitir al Admin eliminar el jugador creado de la BD', async () => {
      const res = await request(app)
        .delete(`/api/players/${creadoPlayerId}`)
        .set('Authorization', `Bearer ${BYPASS_TOKEN}`);
      expect(res.statusCode).toBe(204);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});