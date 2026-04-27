import { Request, Response } from 'express';
import { generateRecommendation } from '../services/ai';

export async function getRecommendation(req: Request, res: Response) {
  const { craving, mood, time, profile } = req.body;
  if (!craving || typeof craving !== 'string' || craving.trim().length === 0) {
    return res.status(400).json({ error: "Craving is required and must be a valid string." });
  }

  // Basic security sanitization (truncate extremely long inputs to prevent DOS/prompt injection limits)
  const safeCraving = craving.substring(0, 100);
  const safeMood = typeof mood === 'string' ? mood.substring(0, 50) : '';
  const safeTime = typeof time === 'string' ? time.substring(0, 50) : '';

  try {
    const recommendation = await generateRecommendation(safeCraving, safeMood, safeTime, profile);
    res.json(recommendation);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'An error occurred during recommendation.' });
  }
}
