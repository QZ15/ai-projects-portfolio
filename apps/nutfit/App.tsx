// App.tsx
import React from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { TodayMealsProvider } from "./src/context/TodayMealsContext";
import { FavoritesProvider } from "./src/context/FavoritesContext";
import { MealFilterProvider } from "./src/context/MealFilterContext"; // ✅ Import

export default function App() {
  return (
    <MealFilterProvider>  {/* ✅ Wrap filters at the top level */}
      <FavoritesProvider>
        <TodayMealsProvider>
          <RootNavigator />
        </TodayMealsProvider>
      </FavoritesProvider>
    </MealFilterProvider>
  );
}
