// src/context/TodayMealsContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";

const TodayMealsContext = createContext(null);

export const TodayMealsProvider = ({ children }) => {
  const [todayMeals, setTodayMeals] = useState<any[]>([]);
  const [lastReset, setLastReset] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem("todayMeals");
      const date = await AsyncStorage.getItem("lastReset");
      if (saved && date === dayjs().format("YYYY-MM-DD")) {
        setTodayMeals(JSON.parse(saved));
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const now = dayjs().format("YYYY-MM-DD");
    if (lastReset !== now) {
      setTodayMeals([]);
      setLastReset(now);
      AsyncStorage.setItem("lastReset", now);
    }
    AsyncStorage.setItem("todayMeals", JSON.stringify(todayMeals));
  }, [todayMeals]);

  const addToToday = (meal: any) => {
    setTodayMeals((prev) => {
      if (prev.find((m) => m.name === meal.name)) return prev;
      return [...prev, meal];
    });
  };

  const removeFromToday = (meal: any) => {
    setTodayMeals((prev) => prev.filter((m) => m.name !== meal.name));
  };

  return (
    <TodayMealsContext.Provider value={{ todayMeals, addToToday, removeFromToday }}>
      {children}
    </TodayMealsContext.Provider>
  );
};

export const useTodayMeals = () => {
  const ctx = useContext(TodayMealsContext);
  if (!ctx) throw new Error("useTodayMeals must be used inside TodayMealsProvider");
  return ctx;
};
