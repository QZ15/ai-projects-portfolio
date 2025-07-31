// src/context/MealFilterContext.tsx
import React, { createContext, useContext, useState } from "react";

interface FilterSettings {
  fitnessGoal?: string;
  budgetLevel?: string;
  prepStyle?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  mealsPerDay?: number;
  cookingTime?: number;
  preferences: string[];
  dislikes: string[];
  ingredients: string[];
  requestedDish: string; // 🔹 Added for Request Meal feature
  macrosEnabled: boolean;
  budgetEnabled: boolean;
  cookingEnabled: boolean;
  prepEnabled: boolean;
  ingredientsEnabled: boolean;
  requestedDishEnabled: boolean;
}

const defaultFilters: FilterSettings = {
  fitnessGoal: "Maintain",
  budgetLevel: "Medium",
  prepStyle: "Standard",
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 70,
  mealsPerDay: 4,
  cookingTime: 30,
  preferences: [],
  dislikes: [],
  ingredients: [],
  requestedDish: "", // 🔹 Default empty
  macrosEnabled: true,
  budgetEnabled: true,
  cookingEnabled: true,
  prepEnabled: true,
  ingredientsEnabled: true,
  requestedDishEnabled: true,
};

const MealFilterContext = createContext<{
  filters: FilterSettings;
  setFilters: React.Dispatch<React.SetStateAction<FilterSettings>>;
}>({
  filters: defaultFilters,
  setFilters: () => {},
});

export const MealFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState(defaultFilters);
  return (
    <MealFilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </MealFilterContext.Provider>
  );
};

export const useMealFilters = () => useContext(MealFilterContext);
