import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Workout { name: string; [key: string]: any }
interface Ctx { recentWorkouts: Workout[]; addRecentWorkout: (w: Workout) => void; clearRecentWorkouts: () => void; }

const RecentWorkoutsContext = createContext<Ctx | null>(null);

export const RecentWorkoutsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("recentWorkouts");
      if (stored) setRecentWorkouts(JSON.parse(stored));
    })();
  }, []);

  const save = (items: Workout[]) => AsyncStorage.setItem("recentWorkouts", JSON.stringify(items)).catch(() => {});

  const addRecentWorkout = (w: Workout) => {
    setRecentWorkouts((prev) => {
      const filtered = prev.filter((m) => m.name !== w.name);
      const next = [w, ...filtered].slice(0, 10);
      save(next);
      return next;
    });
  };

  const clearRecentWorkouts = () => {
    setRecentWorkouts([]);
    AsyncStorage.removeItem("recentWorkouts");
  };

  return (
    <RecentWorkoutsContext.Provider value={{ recentWorkouts, addRecentWorkout, clearRecentWorkouts }}>
      {children}
    </RecentWorkoutsContext.Provider>
  );
};

export const useRecentWorkouts = () => {
  const ctx = useContext(RecentWorkoutsContext);
  if (!ctx) throw new Error("useRecentWorkouts must be used within provider");
  return ctx;
};
