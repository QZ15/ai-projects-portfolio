import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingNavigator from "./OnboardingNavigator";
import MainTabs from "./MainTabs";
import useAuth from "../hooks/useAuth";
import NotFoundScreen from "../screens/NotFoundScreen";
import { navigationRef } from "./RootNavigation";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, loading, onboarded } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer ref={navigationRef} theme={DarkTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user || !onboarded ? (
          <Stack.Screen name="Auth" component={OnboardingNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
        <Stack.Screen name="NotFound" component={NotFoundScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

