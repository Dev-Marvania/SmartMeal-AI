import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;
export function getAI() {
  if (!ai) {
    const key = "AIzaSyA25dcx8IToPEPMmbQ_JJuEVK97okEetgU"; // User's provided API key
    ai = new GoogleGenAI({ apiKey: key });
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

  // --- FOOD VALIDATION ---
  try {
    const valPrompt = `Evaluate if the following text represents a real food, dish, beverage, or edible ingredient: "${craving}". Return a JSON object with a single boolean property "isFood". Ensure it is strictly valid JSON. Example: {"isFood": true}`;
    const valResponse = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: valPrompt,
      config: { responseMimeType: "application/json" }
    });
    
    if (valResponse.text) {
      const parsedVal = JSON.parse(valResponse.text);
      if (parsedVal.isFood === false) {
        return {
          meal: {
            id: "unknown-dish-fallback",
            name: "Chef's Signature Lean Bowl",
            restaurant: "SmartMeal Kitchen",
            distance: "1.0 km",
            calories: 420,
            protein: 24,
            carbs: 50,
            fat: 14,
            tags: ["surprise", "healthy", "signature"],
            image: "https://images.unsplash.com/photo-1548943487-a2e4f43b4850?w=800&q=80"
          },
          reasoning: `We couldn't recognize "${craving}" as a real food! Instead, we've carefully selected our Chef's Signature Lean Bowl to perfectly match your ${mood} mood for ${time}.`,
          betterThan: "Unknown Request"
        };
      }
    }
  } catch (valError) {
    console.warn("Food validation failed, proceeding anyway", valError);
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
    "tags": ["string"]
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

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from AI");
    }

    const parsed = JSON.parse(responseText);

    if (!parsed.meal || !parsed.meal.name) {
      throw new Error("AI generated invalid meal data");
    }

    // Base fallback image
    parsed.meal.image = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80";

    // Request Gemini to generate a unique image
    try {
      const imagePrompt = `A delicious, mouth-watering professional food photography shot of a ${parsed.meal.name}. It is a healthy meal consisting of ${parsed.meal.calories} calories with a focus on fresh ingredients.`;
      const imageResponse = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: imagePrompt }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          }
        }
      });

      let base64EncodeString = "";
      const candidates = imageResponse.candidates;
      if (candidates && candidates.length > 0 && candidates[0].content && candidates[0].content.parts) {
         for (const part of candidates[0].content.parts) {
           if (part.inlineData) {
             base64EncodeString = part.inlineData.data;
             break;
           }
         }
      }

      if (base64EncodeString) {
        parsed.meal.image = `data:image/png;base64,${base64EncodeString}`;
      }
    } catch (imageError: any) {
      console.warn("Image generation failed, using fallback image.", imageError.message);
    }

    return parsed;
  } catch (error: any) {
    console.warn("AI generation failed, using fallback.", error.message);
    const msg = error?.message?.toLowerCase() || "";
    let reasoning = "Our smart chef is taking a little break right now, but based on typical patterns, this is a nutritious and balanced alternative that perfectly satisfies your cravings.";
    
    if (msg.includes("api key") || msg.includes("api_key_invalid") || msg.includes("invalid_argument")) {
      reasoning = "It looks like your recipe for success is missing a valid Gemini API Key! Please double-check the key in your Settings. In the meantime, enjoy this highly-rated alternative.";
    } else if (msg.includes("429") || msg.includes("quota") || msg.includes("rate limit") || msg.includes("exhausted")) {
      reasoning = "Wow, our AI kitchen is super busy right now and we've hit our request limit! Please try again in a few minutes. For now, here's a reliable, healthy favorite.";
    } else if (msg.includes("timeout") || msg.includes("deadline")) {
      reasoning = "Our AI chef was taking a little too long to cook up your custom recommendation. While we wait, we selected this fantastic, quick option for you.";
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
