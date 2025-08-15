// src/navigation/SettingsNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../screens/SettingsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProgressSettings from "../screens/ProgressSettings";
import Subscription from "../screens/Subscription";

export type SettingsStackParamList = {
  SettingsMain: undefined;
  Profile: undefined;
  ProgressSettings: undefined;
  Subscription: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ProgressSettings" component={ProgressSettings} />
      <Stack.Screen name="Subscription" component={Subscription} />
    </Stack.Navigator>
  );
}
