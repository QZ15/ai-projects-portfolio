import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

interface WorkoutFilterSettings {
  fitnessGoal?: string;
  workoutType?: string;
  equipment: string[];
  daysPerWeek?: number;
  timePerWorkout?: number;
  muscleGroups: string[];
  excludedExercises: string[];
  requestedWorkout?: string;
  fitnessGoalEnabled: boolean;
  workoutTypeEnabled: boolean;
  equipmentEnabled: boolean;
  daysPerWeekEnabled: boolean;
  timePerWorkoutEnabled: boolean;
  muscleGroupsEnabled: boolean;
  excludedExercisesEnabled: boolean;
  requestedWorkoutEnabled: boolean;
}

const defaultFilters: WorkoutFilterSettings = {
  fitnessGoal: "Maintain",
  workoutType: "Strength",
  equipment: [],
  daysPerWeek: 3,
  timePerWorkout: 60,
  muscleGroups: [],
  excludedExercises: [],
  requestedWorkout: "",
  fitnessGoalEnabled: false,
  workoutTypeEnabled: false,
  equipmentEnabled: false,
  daysPerWeekEnabled: false,
  timePerWorkoutEnabled: false,
  muscleGroupsEnabled: false,
  excludedExercisesEnabled: false,
  requestedWorkoutEnabled: false,
};

interface Ctx {
  filters: WorkoutFilterSettings;
  setFilters: React.Dispatch<React.SetStateAction<WorkoutFilterSettings>>;
}

const WorkoutFilterContext = createContext<Ctx>({
  filters: defaultFilters,
  setFilters: () => {},
});

export const WorkoutFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<WorkoutFilterSettings>(defaultFilters);
  const uidRef = useRef<string | null>(auth.currentUser?.uid ?? null);

  const keyFor = (uid: string) => `@nutfit:${uid}:workoutFilters`;

  useEffect(() => {
    let unsub: (() => void) | undefined;
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (unsub) unsub();
      uidRef.current = user?.uid ?? null;
      setFilters(defaultFilters);
      if (!user) return;
      const uid = user.uid;
      const cacheKey = keyFor(uid);

      try {
        const raw = await AsyncStorage.getItem(cacheKey);
        if (raw) setFilters(JSON.parse(raw));
      } catch {}

      const ref = doc(db, "users", uid, "workoutFilters", "settings");
      unsub = onSnapshot(ref, (snap) => {
        if (snap.exists()) {
          const data = snap.data() as WorkoutFilterSettings;
          setFilters({ ...defaultFilters, ...data });
          AsyncStorage.setItem(cacheKey, JSON.stringify({ ...defaultFilters, ...data }));
        }
      });

      const snapDoc = await getDoc(ref);
      if (!snapDoc.exists()) {
        const legacy = await AsyncStorage.getItem("workoutFilters");
        if (legacy) {
          try {
            await setDoc(ref, JSON.parse(legacy), { merge: true });
          } catch {}
          await AsyncStorage.removeItem("workoutFilters");
        }
      }
    });
    return () => {
      if (unsub) unsub();
      unsubAuth();
    };
  }, []);

  useEffect(() => {
    const uid = uidRef.current;
    if (!uid) return;
    AsyncStorage.setItem(keyFor(uid), JSON.stringify(filters)).catch(() => {});
    const ref = doc(db, "users", uid, "workoutFilters", "settings");
    setDoc(ref, filters, { merge: true });
  }, [filters]);

  return (
    <WorkoutFilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </WorkoutFilterContext.Provider>
  );
};

export const useWorkoutFilters = () => useContext(WorkoutFilterContext);
