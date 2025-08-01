import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WorkoutPlannerScreen from "../screens/WorkoutPlannerScreen";
import WorkoutDetailsScreen from "../screens/WorkoutDetailsScreen";
import WorkoutPlanFiltersScreen from "../screens/WorkoutPlanFiltersScreen";
import RequestWorkoutScreen from "../screens/RequestWorkoutScreen";
import SingleWorkoutFiltersScreen from "../screens/SingleWorkoutFiltersScreen";

export type WorkoutStackParamList = {
  WorkoutPlanner: undefined;
  WorkoutDetails: { workout: any };
  WorkoutPlanFilters: undefined;
  RequestWorkout: undefined;
  SingleWorkoutFilters: undefined;
};

const Stack = createNativeStackNavigator<WorkoutStackParamList>();

export default function WorkoutStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkoutPlanner" component={WorkoutPlannerScreen} />
      <Stack.Screen name="WorkoutDetails" component={WorkoutDetailsScreen} />
      <Stack.Screen name="WorkoutPlanFilters" component={WorkoutPlanFiltersScreen} />
      <Stack.Screen name="RequestWorkout" component={RequestWorkoutScreen} />
      <Stack.Screen name="SingleWorkoutFilters" component={SingleWorkoutFiltersScreen} />
    </Stack.Navigator>
  );
}
