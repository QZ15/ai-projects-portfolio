// src/context/RecentMealsContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface RecentMealsContextProps {
  recentMeals: any[];
  addRecentMeal: (meal: any) => void;
  clearRecentMeals: () => void;
}

const RecentMealsContext = createContext<RecentMealsContextProps | null>(null);

export const RecentMealsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentMeals, setRecentMeals] = useState<any[]>([]);

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("recentMeals");
        if (stored) {
          setRecentMeals(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Error loading recent meals:", err);
      }
    })();
  }, []);

  // Save to storage whenever recentMeals changes
  const saveMeals = async (meals: any[]) => {
    try {
      await AsyncStorage.setItem("recentMeals", JSON.stringify(meals));
    } catch (err) {
      console.error("Error saving recent meals:", err);
    }
  };

  const addRecentMeal = (meal: any) => {
    setRecentMeals(prev => {
      // Prevent duplicates by name
      const filtered = prev.filter(m => m.name !== meal.name);
      const updated = [meal, ...filtered].slice(0, 10); // Keep max 10
      saveMeals(updated);
      return updated;
    });
  };

  const clearRecentMeals = () => {
    setRecentMeals([]);
    AsyncStorage.removeItem("recentMeals");
  };

  return (
    <RecentMealsContext.Provider value={{ recentMeals, addRecentMeal, clearRecentMeals }}>
      {children}
    </RecentMealsContext.Provider>
  );
};

export const useRecentMeals = () => {
  const ctx = useContext(RecentMealsContext);
  if (!ctx) throw new Error("useRecentMeals must be used inside RecentMealsProvider");
  return ctx;
};
