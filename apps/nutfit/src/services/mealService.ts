import { httpsCallable } from "firebase/functions";
import { functions } from "../services/firebase";

export async function generateMealPlan(calories, protein, carbs, fat, preferences) {
  const fnPlan = httpsCallable(functions, "generateMealPlanFunction");
  const res: any = await fnPlan({ calories, protein, carbs, fat, preferences });
  return res.data;
}

export async function generateSingleMeal(ingredients, preferences) {
  const fnSingle = httpsCallable(functions, "generateSingleMealFunction");
  const res: any = await fnSingle({ ingredients, preferences });
  return res.data;
}
