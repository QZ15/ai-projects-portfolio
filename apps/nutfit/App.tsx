import React from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { MealOfTheDayProvider } from "./src/context/MealOfTheDayContext";
import { FavoritesProvider } from "./src/context/FavoritesContext";
import { TodayMealsProvider } from "./src/context/TodayMealsContext";
import { MealFilterProvider } from "./src/context/MealFilterContext";
import { RecentMealsProvider } from "./src/context/RecentMealsContext";
import { WorkoutFilterProvider } from "./src/context/WorkoutFilterContext";
import { WorkoutFavoritesProvider } from "./src/context/WorkoutFavoritesContext";
import { TodayWorkoutsProvider } from "./src/context/TodayWorkoutsContext";
import { RecentWorkoutsProvider } from "./src/context/RecentWorkoutsContext";

export default function App() {
  return (
    <MealFilterProvider>
      <WorkoutFilterProvider>
        <FavoritesProvider>
          <WorkoutFavoritesProvider>
            <TodayMealsProvider>
              <TodayWorkoutsProvider>
                <MealOfTheDayProvider>
                  <RecentMealsProvider>
                    <RecentWorkoutsProvider>
                      <RootNavigator />
                    </RecentWorkoutsProvider>
                  </RecentMealsProvider>
                </MealOfTheDayProvider>
              </TodayWorkoutsProvider>
            </TodayMealsProvider>
          </WorkoutFavoritesProvider>
        </FavoritesProvider>
      </WorkoutFilterProvider>
    </MealFilterProvider>
  );
}
