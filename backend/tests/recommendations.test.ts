import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import recommendationRoutes from '../../backend/routes/recommendations';

const app = express();
app.use(express.json());
app.use('/api', recommendationRoutes);

describe('API Routes', () => {
  it('GET /api/unknown should return 404 for unknown', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
  });

  it('POST /api/recommend should require craving', async () => {
    const res = await request(app).post('/api/recommend').send({ mood: 'happy' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Craving is required');
  });

  // Note: We skip the full generative test here because we lack the Google API key in the vitest environment
  // It will fall back gracefully due to our try/catch fallback behavior in the ai service.
  it('POST /api/recommend should hit fallback if API key is missing', async () => {
    const res = await request(app).post('/api/recommend').send({ craving: 'pizza', mood: 'bored' });
    expect(res.status).toBe(200);
    expect(res.body.meal.id).toBe('fallback-meal-1');
    expect(res.body.meal.name).toBe('Harvest Quinoa Bowl');
  });
});
