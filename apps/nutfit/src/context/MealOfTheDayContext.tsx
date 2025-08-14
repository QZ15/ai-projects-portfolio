// src/context/MealOfTheDayContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { generateSingleMeal } from "../services/mealService";

const MealOfTheDayContext = createContext<any>(null);

export const MealOfTheDayProvider = ({ children }: { children: React.ReactNode }) => {
  const [mealOfTheDay, setMealOfTheDay] = useState<any>(null);
  const uidRef = useRef<string | null>(auth.currentUser?.uid ?? null);

  const keyFor = (uid: string) => `@nutfit:${uid}:mealOfTheDay`;

  const fallbackImages = {
    Breakfast: "https://images.unsplash.com/photo-1532980400857-e8d9d275d858?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Lunch: "https://images.unsplash.com/photo-1593114630390-e35acaa7d7d6?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Dinner: "https://images.unsplash.com/photo-1659480150417-25f9f0d5ca2e?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Snack: "https://images.unsplash.com/photo-1648471981428-ede812604400?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Default: "https://images.unsplash.com/photo-1626300006988-42a927fd80ee?q=80&w=771&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  const loadMealOfTheDay = async (uid: string | null) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const cacheKey = uid ? keyFor(uid) : "mealOfTheDay";
      const ref = uid ? doc(db, "users", uid, "mealOfTheDay", "state") : null;

      if (ref) {
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data()?.date === today) {
          const meal = snap.data()?.meal || null;
          if (meal && !meal.image)
            meal.image = fallbackImages[meal.mealType] || fallbackImages.Default;
          setMealOfTheDay(meal);
          await AsyncStorage.setItem(cacheKey, JSON.stringify({ date: today, meal }));
          return;
        }
      }

      const stored = await AsyncStorage.getItem(cacheKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          const meal = parsed.meal || null;
          if (meal && !meal.image)
            meal.image = fallbackImages[meal.mealType] || fallbackImages.Default;
          setMealOfTheDay(meal);
          if (ref) await setDoc(ref, parsed, { merge: true });
          return;
        }
      }

      const newMeal = await generateSingleMeal({}, []);
      if (newMeal) {
        if (!newMeal.image)
          newMeal.image = fallbackImages[newMeal.mealType] || fallbackImages.Default;
        const mealData = { date: today, meal: newMeal };
        if (ref) await setDoc(ref, mealData, { merge: true });
        await AsyncStorage.setItem(cacheKey, JSON.stringify(mealData));
        setMealOfTheDay(newMeal);
      }
    } catch (error) {
      console.error("❌ Error loading meal of the day:", error);
    }
  };

  useEffect(() => {
    let unsub: (() => void) | undefined;
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (unsub) unsub();
      uidRef.current = user?.uid ?? null;
      await loadMealOfTheDay(uidRef.current);
      if (!user) return;
      const uid = user.uid;
      const cacheKey = keyFor(uid);
      const ref = doc(db, "users", uid, "mealOfTheDay", "state");
      unsub = onSnapshot(ref, (snap) => {
        const today = new Date().toISOString().split("T")[0];
        const data = snap.data();
        if (data?.date === today) {
          const meal = data.meal || null;
          if (meal && !meal.image)
            meal.image = fallbackImages[meal.mealType] || fallbackImages.Default;
          setMealOfTheDay(meal);
          AsyncStorage.setItem(cacheKey, JSON.stringify(data));
        }
      });
    });
    return () => {
      if (unsub) unsub();
      unsubAuth();
    };
  }, []);

  return (
    <MealOfTheDayContext.Provider value={{ mealOfTheDay }}>
      {children}
    </MealOfTheDayContext.Provider>
  );
};

export const useMealOfTheDay = () => useContext(MealOfTheDayContext);
