import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Workout {
  name: string;
  [key: string]: any;
}

interface Ctx {
  favorites: Workout[];
  toggleFavorite: (w: Workout) => void;
  isFavorite: (w: Workout) => boolean;
}

const WorkoutFavoritesContext = createContext<Ctx | null>(null);

export const WorkoutFavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Workout[]>([]);

  useEffect(() => {
    AsyncStorage.getItem("workoutFavorites").then((data) => {
      if (data) setFavorites(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("workoutFavorites", JSON.stringify(favorites)).catch(() => {});
  }, [favorites]);

  const toggleFavorite = (w: Workout) => {
    setFavorites((prev) => {
      const exists = prev.find((m) => m.name === w.name);
      if (exists) return prev.filter((m) => m.name !== w.name);
      return [...prev, w];
    });
  };

  const isFavorite = (w: Workout) => favorites.some((m) => m.name === w.name);

  return (
    <WorkoutFavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </WorkoutFavoritesContext.Provider>
  );
};

export const useWorkoutFavorites = () => {
  const ctx = useContext(WorkoutFavoritesContext);
  if (!ctx) throw new Error("useWorkoutFavorites must be used within provider");
  return ctx;
};
