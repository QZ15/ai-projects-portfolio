import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Workout { name: string; [key: string]: any }
interface Ctx { completedWorkouts: Workout[]; addCompletedWorkout: (w: Workout) => void }

const CompletedWorkoutsContext = createContext<Ctx | null>(null);

export const CompletedWorkoutsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [completedWorkouts, setCompletedWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("completedWorkouts");
      if (stored) setCompletedWorkouts(JSON.parse(stored));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("completedWorkouts", JSON.stringify(completedWorkouts)).catch(() => {});
  }, [completedWorkouts]);

  const addCompletedWorkout = (w: Workout) => {
    setCompletedWorkouts((prev) => {
      const filtered = prev.filter((m) => m.name !== w.name);
      return [w, ...filtered].slice(0, 10);
    });
  };

  return (
    <CompletedWorkoutsContext.Provider value={{ completedWorkouts, addCompletedWorkout }}>
      {children}
    </CompletedWorkoutsContext.Provider>
  );
};

export const useCompletedWorkouts = () => {
  const ctx = useContext(CompletedWorkoutsContext);
  if (!ctx) throw new Error("useCompletedWorkouts must be used within provider");
  return ctx;
};
