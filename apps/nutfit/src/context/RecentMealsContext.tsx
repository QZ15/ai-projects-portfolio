// src/context/RecentMealsContext.tsx
import React, { createContext, useContext, useState } from "react";

const RecentMealsContext = createContext<any>(null);

export const RecentMealsProvider = ({ children }) => {
  const [recentMeals, setRecentMeals] = useState<any[]>([]);

    const addRecentMeal = (meal: any) => {
        setRecentMeals((prev) => {
            // Check if meal name already exists (case-insensitive)
            const exists = prev.some(
            (m) => m.name.trim().toLowerCase() === meal.name.trim().toLowerCase()
            );
            if (exists) return prev; // Don't add duplicates

            const updated = [meal, ...prev];
            return updated.slice(0, 10);
        });
    };


  return (
    <RecentMealsContext.Provider value={{ recentMeals, addRecentMeal }}>
      {children}
    </RecentMealsContext.Provider>
  );
};

export const useRecentMeals = () => {
  const ctx = useContext(RecentMealsContext);
  if (!ctx) {
    throw new Error("useRecentMeals must be used inside RecentMealsProvider");
  }
  return ctx;
};
