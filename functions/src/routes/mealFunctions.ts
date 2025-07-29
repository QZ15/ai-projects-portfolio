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

Respond ONLY with valid JSON:
{
  "name": "Grilled Chicken with Rice",
  "calories": 450,
  "protein": 35,
  "carbs": 40,
  "fat": 12,
  "ingredients": [
    {"item": "Chicken breast", "quantity": "200g"},
    {"item": "Rice", "quantity": "150g"},
    {"item": "Olive oil", "quantity": "1 tbsp"},
    {"item": "Garlic", "quantity": "2 cloves"}
  ],
  "instructions": [
    "Preheat grill to medium-high heat.",
    "Season chicken with salt, pepper, and garlic.",
    "Grill chicken for 6-7 minutes each side until cooked through.",
    "Cook rice according to package instructions.",
    "Serve chicken over rice, drizzle with olive oil."
  ]
}`;

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const parsed = safeParseJSON(res.choices[0].message?.content || "{}");
    if (!parsed || !parsed.name) throw new Error("Invalid single meal data");
    return parsed;
  } catch (error: any) {
    console.error("❌ Error generating single meal:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});


// --- Full Meal Plan with Filters ---
export const generateMealPlan = functions.https.onCall(async (data) => {
  const { calories, protein, carbs, fat, preferences, dislikes, mealsPerDay } = data;

  const prompt = `
You are a professional meal planning assistant.
Create a full-day meal plan with exactly ${mealsPerDay} meals.
Target macros: ${calories} kcal, ${protein}g P, ${carbs}g C, ${fat}g F.
Ensure total macros meet the target values within ±5% for calories, protein, carbs, and fat.
Preferences: ${preferences || "None"}.
Absolutely exclude the following foods: ${dislikes}. These ingredients must NOT appear in any meal.
If they are common in certain meals, substitute them with similar nutritional replacements.

For EACH meal, include:
- mealType: "Breakfast", "Lunch", "Dinner", or "Snack"
- name: Full descriptive dish name (e.g. "Grilled Salmon with Quinoa")
- calories: number
- protein: number
- carbs: number
- fat: number
- ingredients: array of objects with { "item": string, "quantity": string }
- instructions: array of short, numbered steps

Respond ONLY with valid JSON array of meals, like this:
[
  {
    "mealType": "Breakfast",
    "name": "Spinach Omelette with Toast",
    "calories": 400,
    "protein": 30,
    "carbs": 20,
    "fat": 15,
    "ingredients": [
      {"item": "Eggs", "quantity": "3 large"},
      {"item": "Spinach", "quantity": "1 cup"},
      {"item": "Whole grain toast", "quantity": "2 slices"}
    ],
    "instructions": [
      "Beat the eggs with salt and pepper.",
      "Sauté spinach in a pan with olive oil.",
      "Pour eggs over spinach and cook until set.",
      "Toast bread and serve alongside."
    ]
  }
]`;

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const parsed = safeParseJSON(res.choices[0].message?.content || "[]");
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Empty meal plan");
    }
    return parsed;
  } catch (error: any) {
    console.error("❌ Error generating meal plan:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
