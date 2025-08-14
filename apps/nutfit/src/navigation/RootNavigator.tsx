// src/navigation/RootNavigator.tsx
import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingNavigator from "./OnboardingNavigator";
import MainTabs from "./MainTabs";
import useAuth from "../hooks/useAuth";
import NotFoundScreen from "../screens/NotFoundScreen";
import { navigationRef } from "./RootNavigation";

export type RootStackParamList = {
  Auth: undefined;   // Onboarding/Login flow (when NOT signed in)
  Main: undefined;   // App tabs (when signed in)
  NotFound: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, loading } = useAuth(); // ignore onboarded here

  if (loading) return null;

  return (
    <NavigationContainer ref={navigationRef} theme={DarkTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={OnboardingNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
        <Stack.Screen name="NotFound" component={NotFoundScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
