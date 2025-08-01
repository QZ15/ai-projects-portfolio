import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Workout {
  name: string;
  [key: string]: any;
}

interface Ctx {
  weekWorkouts: Workout[];
  addToWeek: (w: Workout) => void;
  removeFromWeek: (w: Workout) => void;
}

const WeekWorkoutsContext = createContext<Ctx | null>(null);

export const WeekWorkoutsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weekWorkouts, setWeekWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("weekWorkouts");
      if (saved) setWeekWorkouts(JSON.parse(saved));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("weekWorkouts", JSON.stringify(weekWorkouts));
  }, [weekWorkouts]);

  const addToWeek = (w: Workout) => {
    setWeekWorkouts((prev) => (prev.find((m) => m.name === w.name) ? prev : [...prev, w]));
  };

  const removeFromWeek = (w: Workout) => {
    setWeekWorkouts((prev) => prev.filter((m) => m.name !== w.name));
  };

  return (
    <WeekWorkoutsContext.Provider value={{ weekWorkouts, addToWeek, removeFromWeek }}>
      {children}
    </WeekWorkoutsContext.Provider>
  );
};

export const useWeekWorkouts = () => {
  const ctx = useContext(WeekWorkoutsContext);
  if (!ctx) throw new Error("useWeekWorkouts must be used within provider");
  return ctx;
};
