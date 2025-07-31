// src/context/MealFilterContext.tsx
import React, { createContext, useContext, useState } from "react";

interface FilterSettings {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealsPerDay: number;
  preferences: string[];
  dislikes: string[];
  requestedDish: string; // 🔹 Added for Request Meal feature
  ingredientsEnabled: boolean;
  requestedDishEnabled: boolean;
}

const defaultFilters: FilterSettings = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 70,
  mealsPerDay: 4,
  preferences: [],
  dislikes: [],
  requestedDish: "", // 🔹 Default empty
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
