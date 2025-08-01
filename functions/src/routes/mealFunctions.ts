// functions/src/routes/mealFunctions.ts
import * as functions from "firebase-functions";
import openai from "../services/openai.js";
import { buildPromptFromFilters } from "./buildPromptFromFilters.js";

function normalizeFilters(filters: any = {}) {
  return {
    ...filters,
    preferences: Array.isArray(filters?.preferences)
      ? filters.preferences
      : filters?.preferences
      ? String(filters.preferences)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    dislikes: Array.isArray(filters?.dislikes)
      ? filters.dislikes
      : filters?.dislikes
      ? String(filters.dislikes)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    ingredients: Array.isArray(filters?.ingredients)
      ? filters.ingredients
      : filters?.ingredients
      ? String(filters.ingredients)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    macrosEnabled: filters?.macrosEnabled ?? false,
    budgetEnabled: filters?.budgetEnabled ?? false,
    cookingEnabled: filters?.cookingEnabled ?? false,
    prepEnabled: filters?.prepEnabled ?? false,
    ingredientsEnabled: filters?.ingredientsEnabled ?? false,
    requestedDishEnabled: filters?.requestedDishEnabled ?? false,
  };
}

// Helper: Safe JSON parsing
function safeParseJSON(content: string) {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) content = jsonMatch[0];
    return JSON.parse(content);
  } catch (err) {
    functions.logger.error("❌ JSON Parse Error", err, { raw: content });
    return null;
  }
}

// Helper: Check if banned foods exist
function containsBanned(plan: any[], bannedList: string[]) {
  if (!Array.isArray(plan) || bannedList.length === 0) return false;
  return plan.some(meal =>
    Array.isArray(meal.ingredients) &&
    meal.ingredients.some(ing =>
      bannedList.some(b => ing.item?.toLowerCase().includes(b.toLowerCase()))
    )
  );
}

// Single Meal
export const generateSingleMeal = functions.https.onCall(async (data) => {
  const filters = normalizeFilters(data.filters);
  const recentMealNames = data.recentMealNames?.join(", ") || "None";
  const filterPrompt = buildPromptFromFilters(filters);

  const prompt = `
You are a professional chef and your job is to curate delicious meals.
Do NOT generate any meal that is identical or very similar to these: ${recentMealNames}.
${filterPrompt}

Respond ONLY with valid JSON like this:
{
  "mealType": "Breakfast" | "Lunch" | "Dinner" | "Snack",
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
    if (!parsed?.name) throw new Error("Invalid single meal data");

    return parsed;
  } catch (error: any) {
    functions.logger.error("❌ Error generating single meal", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// Full Meal Plan with strict filters & retry
export const generateMealPlan = functions.https.onCall(async (data) => {
  const filters = normalizeFilters(data.filters);
  const recentMealNames = data.recentMealNames?.join(", ") || "None";
  const filterPrompt = buildPromptFromFilters(filters);
  const bannedFoods = filters.dislikes;

  let attempt = 0;
  let parsedPlan: any[] = [];

  while (attempt < 2) {
    attempt++;

    const prompt = `
You are a professional chef and your job is to curate delicious meals.
Do NOT generate any meal that is identical or very similar to these: ${recentMealNames}.
Create exactly ${filters.mealsPerDay} delicious and creative meals.
${filterPrompt}

Respond ONLY with valid JSON array like:
[
  {
    "mealType": "Breakfast" | "Lunch" | "Dinner" | "Snack",
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
  }
]`;

    try {
      const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      const rawOutput = res.choices[0].message?.content || "[]";
      functions.logger.info(`🔍 Raw GPT Meal Plan Output (Attempt ${attempt})`, rawOutput);

      parsedPlan = safeParseJSON(rawOutput);

      if (!Array.isArray(parsedPlan) || parsedPlan.length !== filters.mealsPerDay) {
        throw new Error(`Invalid meal count: expected ${filters.mealsPerDay}, got ${parsedPlan.length}`);
      }

      if (containsBanned(parsedPlan, bannedFoods)) {
        throw new Error(`Banned food detected: ${bannedFoods.join(", ")}`);
      }

      return parsedPlan;
    } catch (error: any) {
      functions.logger.error(`❌ Attempt ${attempt} failed`, error);
      if (attempt >= 2) {
        throw new functions.https.HttpsError("internal", error.message);
      }
    }
  }
});

export const generateRequestedMeal = functions.https.onCall(async (data) => {
  const filters = normalizeFilters(data.filters);
  const recentMealNames = data.recentMealNames?.join(", ") || "None";
  const filterPrompt = buildPromptFromFilters(filters);

  if (!filters.requestedDishEnabled || !filters.requestedDish) {
    throw new functions.https.HttpsError("invalid-argument", "Dish name is required.");
  }

  const prompt = `
You are a professional chef and nutritionist.
Do NOT generate any meal that is identical or very similar to these: ${recentMealNames}.
${filterPrompt}
The requested dish above is mandatory and takes priority over all macros or other filters. Adjust portions or sides to approach any macro targets, but never substitute a different meal even if the macros cannot be met exactly.
It must include:
- mealType (Breakfast, Lunch, Dinner, or Snack)
- name
- calories, protein, carbs, fat
- ingredients: array of { "item": string, "quantity": string }
- instructions: array of short, numbered steps

Respond ONLY with valid JSON object like:
{
  "mealType": "Breakfast" | "Lunch" | "Dinner" | "Snack",
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

    const rawOutput = res.choices[0].message?.content || "{}";
    functions.logger.info(`🔍 Raw GPT Requested Meal Output`, rawOutput);

    const parsed = safeParseJSON(rawOutput);
    if (!parsed?.name) throw new Error("Invalid requested meal data");

    return parsed;
  } catch (error: any) {
    functions.logger.error("❌ Error generating requested meal", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
