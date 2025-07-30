// src/services/mealService.ts
import { httpsCallable } from "firebase/functions";
import { functions } from "../services/firebase";

// ✅ Meal Plan now includes dislikes + mealsPerDay
export async function generateMealPlan(calories, protein, carbs, fat, preferences, dislikes, mealsPerDay) {
  const fnPlan = httpsCallable(functions, "generateMealPlanFunction");
  const res: any = await fnPlan({ calories, protein, carbs, fat, preferences, dislikes, mealsPerDay });
  return res.data;
}

// ✅ Single Meal stays the same
export async function generateSingleMeal(ingredients, preferences) {
  const fnSingle = httpsCallable(functions, "generateSingleMealFunction");
  const res: any = await fnSingle({ ingredients, preferences });
  return res.data;
}
