/**
 * Test de ejemplo para el endpoint de incidencias
 * Ejecutar con: npm test
 */

import request from 'supertest';
import app from '../app';
import prisma from '../db/client';

describe('Incidents API', () => {
  let authToken: string;

  // Antes de todos los tests, hacer login para obtener token
  beforeAll(async () => {
    const response = await request(app).post('/api/auth/login').send({
      username: 'admin',
      password: 'admin123',
    });

    authToken = response.body.token;
  });

  // Después de todos los tests, cerrar la conexión a Prisma
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/incidents', () => {
    it('debería devolver 401 sin token de autenticación', async () => {
      const response = await request(app).get('/api/incidents');

      expect(response.status).toBe(401);
    });

    it('debería listar incidencias con autenticación', async () => {
      const response = await request(app)
        .get('/api/incidents')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('incidents');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.incidents)).toBe(true);
    });

    it('debería filtrar incidencias por cliente', async () => {
      const response = await request(app)
        .get('/api/incidents?clientId=1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(response.body.incidents.every((inc: any) => inc.client_id === 1)).toBe(true);
    });
  });

  describe('GET /api/incidents/summary', () => {
    it('debería devolver resumen de incidencias', async () => {
      const response = await request(app)
        .get('/api/incidents/summary')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('summary');
      expect(response.body.summary).toHaveProperty('total');
      expect(response.body.summary).toHaveProperty('byStatus');
      expect(response.body.summary).toHaveProperty('timeStats');
    });
  });
});
