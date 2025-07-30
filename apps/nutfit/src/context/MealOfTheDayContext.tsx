// src/context/MealOfTheDayContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateSingleMeal } from "../services/mealService";

const MealOfTheDayContext = createContext<any>(null);

export const MealOfTheDayProvider = ({ children }: { children: React.ReactNode }) => {
  const [mealOfTheDay, setMealOfTheDay] = useState<any>(null);

  const fallbackImages = {
    Breakfast: "https://images.unsplash.com/photo-1532980400857-e8d9d275d858?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Lunch: "https://images.unsplash.com/photo-1593114630390-e35acaa7d7d6?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Dinner: "https://images.unsplash.com/photo-1659480150417-25f9f0d5ca2e?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Snack: "https://images.unsplash.com/photo-1648471981428-ede812604400?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Default: "https://images.unsplash.com/photo-1626300006988-42a927fd80ee?q=80&w=771&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  const loadMealOfTheDay = async () => {
    try {
      const stored = await AsyncStorage.getItem("mealOfTheDay");
      const today = new Date().toISOString().split("T")[0];

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          setMealOfTheDay(parsed.meal);
          return;
        }
      }

      // Fetch new meal from AI
      const newMeal = await generateSingleMeal([], "Random healthy meal");
      if (!newMeal.image) {
        newMeal.image =
          fallbackImages[newMeal.mealType] || fallbackImages.Default;
      }

      const mealData = { date: today, meal: newMeal };
      await AsyncStorage.setItem("mealOfTheDay", JSON.stringify(mealData));
      setMealOfTheDay(newMeal);
    } catch (error) {
      console.error("❌ Error loading meal of the day:", error);
    }
  };

  useEffect(() => {
    loadMealOfTheDay();
  }, []);

  return (
    <MealOfTheDayContext.Provider value={{ mealOfTheDay }}>
      {children}
    </MealOfTheDayContext.Provider>
  );
};

export const useMealOfTheDay = () => useContext(MealOfTheDayContext);
