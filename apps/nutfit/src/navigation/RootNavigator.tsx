// src/navigation/RootNavigator.tsx
import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";
import OnboardingNavigator from "./OnboardingNavigator";
import MainTabs from "./MainTabs";
import useAuth from "../hooks/useAuth";
import NotFoundScreen from "../screens/NotFoundScreen";
import CheckoutSuccess from "../screens/CheckoutSuccess";
import CheckoutCanceled from "../screens/CheckoutCanceled";
import { navigationRef } from "./RootNavigation";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      CheckoutSuccess: "success",
      CheckoutCanceled: "cancel",
    },
  },
};

export default function RootNavigator() {
  const { user, loading } = useAuth(); // ignore onboarded here

  if (loading) return null;

  return (
    <NavigationContainer ref={navigationRef} theme={DarkTheme} linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={OnboardingNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
        <Stack.Screen name="NotFound" component={NotFoundScreen} />
        <Stack.Screen name="CheckoutSuccess" component={CheckoutSuccess} />
        <Stack.Screen name="CheckoutCanceled" component={CheckoutCanceled} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
