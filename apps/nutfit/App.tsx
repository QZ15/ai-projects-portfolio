import React from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { MealFilterProvider } from "./src/context/MealFilterContext";

export default function App() {
  return (
    <MealFilterProvider>
      <RootNavigator />
    </MealFilterProvider>
  );
}
