import React, { lazy, Suspense } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

// Screens
import DashboardScreen from "../screens/DashboardScreen";
import Scheduler from "../screens/Scheduler";
import ScheduleDetailsScreen from "../screens/ScheduleDetailsScreen";
import ScheduleSettings from "../screens/ScheduleSettings";
const Progress = lazy(() => import("../screens/Progress"));
import SettingsScreen from "../screens/SettingsScreen";
import MealStackNavigator from "./MealStackNavigator";
import WorkoutStackNavigator from "./WorkoutStackNavigator";

// Navigators
const Tab = createBottomTabNavigator();
const ScheduleStack = createNativeStackNavigator();

// --- Schedule Stack ---
function ScheduleStackNavigator() {
  return (
    <ScheduleStack.Navigator screenOptions={{ headerShown: false }}>
      <ScheduleStack.Screen name="Scheduler" component={Scheduler} />
      <ScheduleStack.Screen name="ScheduleDetails" component={ScheduleDetailsScreen} />
      <ScheduleStack.Screen name="ScheduleSettings" component={ScheduleSettings} />
    </ScheduleStack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#000" },
        tabBarActiveTintColor: "#fff",
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";
          if (route.name === "Dashboard") iconName = "home";
          else if (route.name === "Meals") iconName = "fast-food";
          else if (route.name === "Workouts") iconName = "barbell";
          else if (route.name === "Schedule") iconName = "calendar";
          else if (route.name === "Progress") iconName = "stats-chart";
          else if (route.name === "Settings") iconName = "settings";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Meals" component={MealStackNavigator} />
      <Tab.Screen name="Workouts" component={WorkoutStackNavigator} />
      <Tab.Screen name="Schedule" component={ScheduleStackNavigator} />
      <Tab.Screen
        name="Progress"
        children={() => (
          <Suspense fallback={null}>
            <Progress />
          </Suspense>
        )}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
