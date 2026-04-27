import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;
export function getAI() {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

export async function generateRecommendation(craving: string, mood: string, time: string, profile: any) {
  let aiClient;
  try {
    aiClient = getAI();
  } catch (e: any) {
    console.warn("AI Init failed, using fallback.", e.message);
    return {
      meal: {
        id: "fallback-meal-1",
        name: "Harvest Quinoa Bowl",
        restaurant: "Vitality Kitchen",
        distance: "1.5 km",
        calories: 450,
        protein: 20,
        carbs: 55,
        fat: 15,
        tags: ["healthy", "balanced", "quick"],
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80"
      },
      reasoning: "It looks like the Gemini API Key is missing. You can fix this by going to the Settings menu -> Secrets and setting a valid GEMINI_API_KEY! In the meantime, enjoy this highly-rated alternative.",
      betterThan: craving || 'your craving'
    };
  }

  const prompt = `
You are the SmartMeal AI recommendation engine. 
Based on the following user context, generate a personalized, healthy meal recommendation that satisfies their craving but acts as a healthier alternative.

USER CONTEXT:
Craving: ${craving}
Mood: ${mood}
Time: ${time}
Profile (Dietary Restrictions / Goals): ${profile ? JSON.stringify(profile) : 'None provided'}

INSTRUCTIONS:
1. Invent a specific, appetizing healthy meal that acts as a great alternative to the user's craving.
2. Invent a realistic-sounding healthy restaurant name.
3. Generate realistic macronutrients (calories, protein, carbs, fat) appropriate for their goals.
4. Provide a 2-3 sentence behavioral explanation ("Why this meal?") explaining why it fits their mood, time, and craving context, without focusing solely on calories. Keep it encouraging.
5. Choose ONE of the following image URLs that best fits the meal:
   - https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80 (Salmon/Poke)
   - https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80 (Salad/Green)
   - https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80 (Pizza/Flatbread)
   - https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80 (Sushi/Rolls)
   - https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80 (Burger/Sandwich)
   - https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80 (Noodles/Stir-fry)
   - https://images.unsplash.com/photo-1525351484163-8a39d8e411b4?w=800&q=80 (Avocado Toast/Breakfast)
   - https://images.unsplash.com/photo-1548943487-a2e4f43b4850?w=800&q=80 (Paneer/Tofu Bowl)
   - https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80 (Wrap/Burrito)
   - https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80 (Yogurt/Dessert/Sweet)

Return a JSON object matching this schema:
{
  "meal": {
    "id": "unique string",
    "name": "string (e.g., Spicy Grilled Chicken Wrap)",
    "restaurant": "string (e.g., The Green Leaf)",
    "distance": "string (e.g., 1.2 km)",
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "tags": ["string"],
    "image": "string (one of the provided predefined URLs)"
  },
  "reasoning": "the 2-3 sentence explanation",
  "betterThan": "the exact original craving"
}
`;

  try {
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

    if (!parsed.meal || !parsed.meal.name) {
      throw new Error("AI generated invalid meal data");
    }

    return parsed;
  } catch (error: any) {
    console.warn("AI generation failed or key invalid, using fallback.", error.message);
    const msg = error.message.toLowerCase();
    let reasoning = "We couldn't connect to our AI at the moment, but based on typical patterns, this is a nutritious and balanced alternative that satisfies your current mood and cravings.";
    if (msg.includes("api key") || msg.includes("api_key_invalid")) {
      reasoning = "It looks like the provided Gemini API key is missing or invalid. Please open the Settings menu, go to the Secrets panel, and add your valid GEMINI_API_KEY. In the meantime, here is a highly-rated alternative!";
    }
    return {
      meal: {
        id: "fallback-meal-1",
        name: "Harvest Quinoa Bowl",
        restaurant: "Vitality Kitchen",
        distance: "1.5 km",
        calories: 450,
        protein: 20,
        carbs: 55,
        fat: 15,
        tags: ["healthy", "balanced", "quick"],
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80"
      },
      reasoning: reasoning,
      betterThan: craving || 'your craving'
    };
  }
}
