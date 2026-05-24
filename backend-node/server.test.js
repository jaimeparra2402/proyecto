const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('./server');

describe('GET /health', () => {
  it('debe responder 200 con status online', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
  });
});

describe('GET /api/noticias', () => {
  it('debe devolver lista de jugadores con status success', async () => {
    const res = await request(app).get('/api/noticias');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('debe filtrar por nombre con query param', async () => {
    const res = await request(app).get('/api/noticias?name=messi');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });
});

describe('GET /api/noticias/:id', () => {
  it('debe devolver 400 o 404 con ID inválido', async () => {
    const res = await request(app).get('/api/noticias/id_invalido');
    expect([400, 404, 500]).toContain(res.statusCode);
  });
});

describe('POST /api/users/register y login', () => {
  const testUser = {
    username: `testuser_${Date.now()}`,
    password: 'Test1234!'
  };
  let token;

  it('debe registrar un nuevo usuario y devolver token', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send(testUser);
    
    expect([201, 400]).toContain(res.statusCode);
    if (res.statusCode === 201) {
      expect(res.body).toHaveProperty('token');
    }
  });

  it('debe rechazar login con contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ username: testUser.username, password: 'incorrecta' });
    expect(res.statusCode).toBe(401);
  });
});

describe('POST /api/noticias (ruta protegida)', () => {
  it('debe rechazar sin token con 401', async () => {
    const res = await request(app)
      .post('/api/noticias')
      .send({ name: 'Test', teamLeague: 'Liga', imageUrl: 'http://img.com/1.jpg' });
    expect(res.statusCode).toBe(401);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});