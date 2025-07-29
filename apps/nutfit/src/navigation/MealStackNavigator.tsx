import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MealPlanner from "../screens/MealPlanner";
import MealDetailsScreen from "../screens/MealDetailsScreen";
import MealPlanDetailsScreen from "../screens/MealPlanDetailsScreen";
import MealPlanFiltersScreen from "../screens/MealPlanFiltersScreen";
import SelectIngredientsScreen from "../screens/SelectIngredientsScreen";

export type MealStackParamList = {
  MealPlanner: undefined;
  MealDetails: { meal: any };
  MealPlanDetails: { plan: any[] };
  MealPlanFilters: undefined;
  SelectIngredients: undefined;
};

const Stack = createNativeStackNavigator<MealStackParamList>();

export default function MealStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MealPlanner" component={MealPlanner} />
      <Stack.Screen name="MealDetails" component={MealDetailsScreen} />
      <Stack.Screen name="MealPlanDetails" component={MealPlanDetailsScreen} />
      <Stack.Screen name="MealPlanFilters" component={MealPlanFiltersScreen} />
      <Stack.Screen name="SelectIngredients" component={SelectIngredientsScreen} />
    </Stack.Navigator>
  );
}
