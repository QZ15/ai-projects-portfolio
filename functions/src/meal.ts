import functions from "firebase-functions";

interface Ingredient { name: string; quantity: string; }
interface MacroBreakdown { calories: number; protein: number; carbs: number; fats: number; }
interface Meal {
  name: string;
  ingredients: Ingredient[];
  instructions: string;
  macros: MacroBreakdown;
  photoUrl?: string;
}

const sampleMeal: Meal = {
  name: "Grilled Chicken Salad",
  ingredients: [
    { name: "Chicken Breast", quantity: "200g" },
    { name: "Mixed Greens", quantity: "2 cups" },
  ],
  instructions: "Grill the chicken and serve over the greens.",
  macros: { calories: 400, protein: 35, carbs: 10, fats: 12 },
};

export const generateMealPlan = functions.https.onCall(async () => {
  return sampleMeal;
});

export const generateMealFromIngredients = functions.https.onCall(async () => {
  return sampleMeal;
});

export const estimateMealFromPhoto = functions.https.onCall(async () => {
  return sampleMeal;
});
