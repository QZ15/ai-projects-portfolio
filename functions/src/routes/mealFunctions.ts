// functions/src/routes/mealFunctions.ts
import * as functions from "firebase-functions";
import openai from "../services/openai.js";

function safeParseJSON(content: string) {
  try {
    // Extract only JSON block if GPT returns extra text
    const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) content = jsonMatch[0];

    const parsed = JSON.parse(content);
    return parsed;
  } catch (err) {
    console.error("❌ JSON Parse Error:", err, "\nRaw Content:", content);
    return null;
  }
}

// --- Single Meal ---
export const generateSingleMeal = functions.https.onCall(async (data) => {
  const { ingredients, preferences } = data;

  const prompt = `
You are a meal generator.
Create 1 healthy meal based on: ${ingredients?.length ? ingredients.join(", ") : "any ingredients"}.
Preferences: ${preferences || "None"}.

Respond ONLY with valid JSON object (no text outside JSON):
{
  "name": "Grilled Chicken with Rice",
  "calories": 450,
  "protein": 35,
  "carbs": 40,
  "fat": 12,
  "ingredients": ["Chicken breast", "Rice", "Olive oil", "Garlic"],
  "instructions": "Grill chicken, cook rice, combine, season."
}`;

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const parsed = safeParseJSON(res.choices[0].message?.content || "{}");
    if (!parsed || !parsed.name) throw new Error("Invalid single meal data");
    return parsed;
  } catch (error: any) {
    console.error("❌ Error generating single meal:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// --- Full Meal Plan ---
export const generateMealPlan = functions.https.onCall(async (data) => {
  const { calories, protein, carbs, fat, preferences } = data;

  const prompt = `
You are a meal plan generator.
Create a meal plan for a full day: Breakfast, Lunch, Dinner, Snack.
Target macros: ${calories} kcal, ${protein}g P, ${carbs}g C, ${fat}g F.
Preferences: ${preferences || "None"}.

Respond ONLY with valid JSON array (no text outside JSON):
[
  {
    "mealType": "Breakfast",
    "name": "Spinach Omelette with Toast",
    "calories": 400,
    "protein": 30,
    "carbs": 20,
    "fat": 15,
    "ingredients": ["Eggs", "Spinach", "Toast", "Olive oil"],
    "instructions": "Beat eggs, cook with spinach, toast bread."
  },
  {
    "mealType": "Lunch",
    "name": "Grilled Salmon with Quinoa",
    "calories": 500,
    "protein": 35,
    "carbs": 45,
    "fat": 18,
    "ingredients": ["Salmon", "Quinoa", "Olive oil", "Garlic"],
    "instructions": "Grill salmon, cook quinoa, serve together."
  },
  {
    "mealType": "Dinner",
    "name": "Chicken Stir-Fry",
    "calories": 600,
    "protein": 40,
    "carbs": 50,
    "fat": 20,
    "ingredients": ["Chicken breast", "Mixed vegetables", "Soy sauce"],
    "instructions": "Cook chicken, add vegetables, stir-fry with soy sauce."
  },
  {
    "mealType": "Snack",
    "name": "Greek Yogurt with Berries",
    "calories": 200,
    "protein": 15,
    "carbs": 20,
    "fat": 5,
    "ingredients": ["Greek yogurt", "Berries", "Honey"],
    "instructions": "Mix all ingredients in a bowl."
  }
]`;

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const parsed = safeParseJSON(res.choices[0].message?.content || "[]");
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Invalid or empty meal plan");
    return parsed;
  } catch (error: any) {
    console.error("❌ Error generating meal plan:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
