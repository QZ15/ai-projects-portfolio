// src/navigation/SettingsNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../screens/SettingsScreen";
import ProfileScreen from "../screens/ProfileScreen";

export type SettingsStackParamList = {
  SettingsMain: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
