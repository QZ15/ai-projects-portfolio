// src/services/mealService.ts
import { httpsCallable } from "firebase/functions";
import { functions } from "../services/firebase";

export async function generateMealPlan(filters, recentMealNames) {
  const fnPlan = httpsCallable(functions, "generateMealPlanFunction");
  const res: any = await fnPlan({ filters, recentMealNames });
  return res.data;
}

export async function generateSingleMeal(filters, recentMealNames) {
  const fnSingle = httpsCallable(functions, "generateSingleMealFunction");
  const res: any = await fnSingle({ filters, recentMealNames });
  return res.data;
}

export async function generateRequestedMeal(filters, recentMealNames) {
  const fnRequested = httpsCallable(functions, "generateRequestedMealFunction");
  const res: any = await fnRequested({ filters, recentMealNames });
  return res.data;
}
