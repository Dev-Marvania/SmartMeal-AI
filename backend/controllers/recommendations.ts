import { Request, Response } from 'express';
import { generateRecommendation } from '../services/ai';

export async function getRecommendation(req: Request, res: Response) {
  const { craving, mood, time, profile } = req.body;
  if (!craving) {
    return res.status(400).json({ error: "Craving is required" });
  }

  try {
    const recommendation = await generateRecommendation(craving, mood, time, profile);
    res.json(recommendation);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'An error occurred during recommendation.' });
  }
}
