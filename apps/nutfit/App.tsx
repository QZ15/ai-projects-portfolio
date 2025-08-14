import React from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { MealOfTheDayProvider } from "./src/context/MealOfTheDayContext";
import { FavoritesProvider } from "./src/context/FavoritesContext";
import { TodayMealsProvider } from "./src/context/TodayMealsContext";
import { MealFilterProvider } from "./src/context/MealFilterContext";
import { RecentMealsProvider } from "./src/context/RecentMealsContext";
import { WorkoutFilterProvider } from "./src/context/WorkoutFilterContext";
import { WorkoutFavoritesProvider } from "./src/context/WorkoutFavoritesContext";
import { WeekWorkoutsProvider } from "./src/context/WeekWorkoutsContext";
import { RecentWorkoutsProvider } from "./src/context/RecentWorkoutsContext";
import { CompletedWorkoutsProvider } from "./src/context/CompletedWorkoutsContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ProgressProvider } from "./src/context/ProgressContext";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MealFilterProvider>
        <WorkoutFilterProvider>
          <FavoritesProvider>
            <WorkoutFavoritesProvider>
              <TodayMealsProvider>
                <WeekWorkoutsProvider>
                  <CompletedWorkoutsProvider>
                    <MealOfTheDayProvider>
                      <RecentMealsProvider>
                        <RecentWorkoutsProvider>
                          <ProgressProvider>
                            <RootNavigator />
                          </ProgressProvider>
                        </RecentWorkoutsProvider>
                      </RecentMealsProvider>
                    </MealOfTheDayProvider>
                  </CompletedWorkoutsProvider>
                </WeekWorkoutsProvider>
              </TodayMealsProvider>
            </WorkoutFavoritesProvider>
          </FavoritesProvider>
        </WorkoutFilterProvider>
      </MealFilterProvider>
    </GestureHandlerRootView>
  );
}
