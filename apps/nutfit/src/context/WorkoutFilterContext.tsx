import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("workoutFilters");
        if (stored) setFilters(JSON.parse(stored));
      } catch {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("workoutFilters", JSON.stringify(filters)).catch(() => {});
  }, [filters]);

  return (
    <WorkoutFilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </WorkoutFilterContext.Provider>
  );
};

export const useWorkoutFilters = () => useContext(WorkoutFilterContext);
