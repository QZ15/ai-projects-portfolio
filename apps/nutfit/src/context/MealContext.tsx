import React, { createContext, useContext, useState } from "react";
import { Alert } from "react-native";
import { generateMealPlan } from "../services/mealService";

interface MealContextProps {
  planMeals: any[];
  loading: boolean;
  generatePlan: (preferences?: string) => Promise<void>;
  clearPlan: () => void;
}

const MealContext = createContext<MealContextProps>({
  planMeals: [],
  loading: false,
  generatePlan: async () => {},
  clearPlan: () => {},
});

export const MealProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [planMeals, setPlanMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generatePlan = async (preferences?: string) => {
    try {
      setLoading(true);
      const plan = await generateMealPlan(2000, 150, 200, 70, preferences || "balanced");
      setPlanMeals(plan);
    } catch (err) {
      Alert.alert("Error", "Could not generate meal plan.");
    } finally {
      setLoading(false);
    }
  };

  const clearPlan = () => setPlanMeals([]);

  return (
    <MealContext.Provider value={{ planMeals, loading, generatePlan, clearPlan }}>
      {children}
    </MealContext.Provider>
  );
};

export const useMealContext = () => useContext(MealContext);
