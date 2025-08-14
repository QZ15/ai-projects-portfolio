// src/navigation/OnboardingNavigator.tsx
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Onboarding from "../screens/Onboarding";
import LoginScreen from "../screens/LoginScreen";

export type OnboardingStackParamList = {
  Onboarding: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigator() {
  const [initial, setInitial] = useState<keyof OnboardingStackParamList | null>(null);

  useEffect(() => {
    (async () => {
      const has = await AsyncStorage.getItem("hasOnboarded");
      setInitial(has === "true" ? "Login" : "Onboarding");
    })();
  }, []);

  if (!initial) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initial}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
