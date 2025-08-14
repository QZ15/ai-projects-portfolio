import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Progress from "../screens/Progress";
import ProgressSettings from "../screens/ProgressSettings";

export type ProgressStackParamList = {
  ProgressHome: undefined;
  ProgressSettings: undefined;
};

const Stack = createNativeStackNavigator<ProgressStackParamList>();

export default function ProgressStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProgressHome" component={Progress} />
      <Stack.Screen name="ProgressSettings" component={ProgressSettings} />
    </Stack.Navigator>
  );
}
