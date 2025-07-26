import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import MetricsScreen from '../screens/MetricsScreen';
import SplitScreen from '../screens/SplitScreen';

export type OnboardingStackParamList = {
  Login: undefined;
  Metrics: undefined;
  Split: { weight: string; bodyFat: string; goal: string };
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Metrics" component={MetricsScreen} />
      <Stack.Screen name="Split" component={SplitScreen} />
    </Stack.Navigator>
  );
}
