import React from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { MealOfTheDayProvider } from "./src/context/MealOfTheDayContext";
import { FavoritesProvider } from "./src/context/FavoritesContext";
import { TodayMealsProvider } from "./src/context/TodayMealsContext";
import { MealFilterProvider } from "./src/context/MealFilterContext";

export default function App() {
  return (
    <MealFilterProvider>
      <FavoritesProvider>
        <TodayMealsProvider>
          <MealOfTheDayProvider>
            <RootNavigator />
          </MealOfTheDayProvider>
        </TodayMealsProvider>
      </FavoritesProvider>
    </MealFilterProvider>
  );
}
