const request = require('supertest');
const express = require('express');

const app = express();
app.get('/health', (req, res) => res.status(200).json({ status: 'online' }));

describe('Pruebas Unitarias del API Server', () => {
  
  it('Debería responder con estado 200 y status online en la ruta /health', async () => {
    const res = await request(app)
      .get('/health')
      .send();
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'online');
  });

});