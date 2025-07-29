import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingNavigator from "./src/navigation/OnboardingNavigator";

export default function App() {
  const [initialRoute, setInitialRoute] = useState<"Onboarding" | "Login">("Onboarding");

  useEffect(() => {
    const checkOnboarding = async () => {
      const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");
      setInitialRoute(hasOnboarded ? "Login" : "Onboarding");
    };
    checkOnboarding();
  }, []);

  return (
    <NavigationContainer>
      <OnboardingNavigator/>
    </NavigationContainer>
  );
}
