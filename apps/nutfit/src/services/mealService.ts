// src/services/mealService.ts
import { httpsCallable } from "firebase/functions";
import { functions } from "../services/firebase";
import { checkUsageLimit } from "../lib/limits";

export async function generateMealPlan(filters, recentMealNames) {
  await checkUsageLimit("meal");
  const fnPlan = httpsCallable(functions, "generateMealPlanFunction");
  const res: any = await fnPlan({ filters, recentMealNames });
  return res.data;
}

export async function generateSingleMeal(filters, recentMealNames) {
  await checkUsageLimit("meal");
  const fnSingle = httpsCallable(functions, "generateSingleMealFunction");
  const res: any = await fnSingle({ filters, recentMealNames });
  return res.data;
}

export async function generateRequestedMeal(filters, recentMealNames) {
  await checkUsageLimit("meal");
  const fnRequested = httpsCallable(functions, "generateRequestedMealFunction");
  const res: any = await fnRequested({ filters, recentMealNames });
  return res.data;
}
