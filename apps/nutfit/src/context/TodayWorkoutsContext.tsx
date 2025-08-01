import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";

interface Workout {
  name: string;
  [key: string]: any;
}

interface Ctx {
  todayWorkouts: Workout[];
  addToToday: (w: Workout) => void;
  removeFromToday: (w: Workout) => void;
}

const TodayWorkoutsContext = createContext<Ctx | null>(null);

export const TodayWorkoutsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todayWorkouts, setTodayWorkouts] = useState<Workout[]>([]);
  const [lastReset, setLastReset] = useState<string>("");

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("todayWorkouts");
      const date = await AsyncStorage.getItem("workoutLastReset");
      const now = dayjs().format("YYYY-MM-DD");
      if (date === now && saved) setTodayWorkouts(JSON.parse(saved));
      setLastReset(date || now);
    })();
  }, []);

  useEffect(() => {
    const now = dayjs().format("YYYY-MM-DD");
    if (lastReset !== now) {
      setTodayWorkouts([]);
      setLastReset(now);
      AsyncStorage.setItem("workoutLastReset", now);
    }
    AsyncStorage.setItem("todayWorkouts", JSON.stringify(todayWorkouts));
  }, [todayWorkouts, lastReset]);

  const addToToday = (w: Workout) => {
    setTodayWorkouts((prev) => (prev.find((m) => m.name === w.name) ? prev : [...prev, w]));
  };

  const removeFromToday = (w: Workout) => {
    setTodayWorkouts((prev) => prev.filter((m) => m.name !== w.name));
  };

  return (
    <TodayWorkoutsContext.Provider value={{ todayWorkouts, addToToday, removeFromToday }}>
      {children}
    </TodayWorkoutsContext.Provider>
  );
};

export const useTodayWorkouts = () => {
  const ctx = useContext(TodayWorkoutsContext);
  if (!ctx) throw new Error("useTodayWorkouts must be used within provider");
  return ctx;
};
