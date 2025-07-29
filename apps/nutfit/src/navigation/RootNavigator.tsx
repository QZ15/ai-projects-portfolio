import React, { useEffect, useState } from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingNavigator from "./OnboardingNavigator";
import MainTabs from "./MainTabs";
import useAuth from "../hooks/useAuth";
import NotFoundScreen from "../screens/NotFoundScreen";
import { navigationRef } from "./RootNavigation";

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  NotFound: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, loading, onboarded } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer ref={navigationRef} theme={DarkTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user || !onboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
        <Stack.Screen name="NotFound" component={NotFoundScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}