import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs/promises';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Wait to initialize AI until requested so we don't crash without key
  let ai: GoogleGenAI | null = null;
  function getAI() {
    if (!ai) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is required");
      }
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
  }

  // --- API Routes ---
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/recommend', async (req, res) => {
    const { craving, mood, time, profile } = req.body;
    let meals: any[] = [];
    
    // Read static dataset first so we can use it in fallback
    try {
      const mealsDataStr = await fs.readFile(path.join(process.cwd(), 'src', 'data', 'meals.json'), 'utf-8');
      meals = JSON.parse(mealsDataStr);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to load static data.' });
    }

    try {
      const aiClient = getAI();

      const prompt = `
You are the SmartMeal AI recommendation engine. 
Based on the following user context and the provided mocked dataset of meals, pick the best healthy alternative for their craving.

USER CONTEXT:
Craving: ${craving}
Mood: ${mood}
Time: ${time}
Profile (Dietary Restrictions / Goals): ${profile ? JSON.stringify(profile) : 'None provided'}

MEALS DATASET:
${JSON.stringify(meals, null, 2)}

INSTRUCTIONS:
1. Select the single best meal id from the dataset that satisfies their craving but is a healthier alternative, fitting their mood and time context.
2. Provide a 2-3 sentence behavioral explanation ("Why this meal?") explaining why it fits their mood, time, and craving context, without focusing solely on calories. Keep it encouraging.
3. Return the exact name of the item they were craving to compare against (e.g., if they craved 'pizza', the betterThan field is 'pizza').

Return a JSON object matching this schema:
{
  "recommendedMealId": "the string id of the selected meal",
  "reasoning": "the 2-3 sentence explanation",
  "betterThan": "the exact original craving"
}
`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text();
      if (!responseText) {
        throw new Error("Empty response from AI");
      }

      const parsed = JSON.parse(responseText);
      const recommendedMeal = meals.find((m: any) => m.id === parsed.recommendedMealId);

      if (!recommendedMeal) {
         throw new Error("AI recommended an invalid meal id");
      }

      res.json({
        meal: recommendedMeal,
        reasoning: parsed.reasoning,
        betterThan: parsed.betterThan
      });
      
    } catch (error: any) {
      console.error("Error in /api/recommend:", error);
      // Fallback: No blank outputs - always show something, even on LLM error
      const fallback = meals.length > 0 ? meals[Math.floor(Math.random() * meals.length)] : null;
      if (fallback) {
        res.json({
          meal: fallback,
          reasoning: "We couldn't connect to our AI at the moment, but based on typical patterns, this is a nutritious and balanced alternative that satisfies your current mood and cravings.",
          betterThan: craving || 'your craving'
        });
      } else {
        res.status(500).json({ error: error.message || 'An error occurred during recommendation.' });
      }
    }
  });

  // --- Vite Middleware (Development) / Static Serving (Production) ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
