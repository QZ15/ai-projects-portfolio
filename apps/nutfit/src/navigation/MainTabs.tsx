import React, { lazy, Suspense } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

// Screens / Navigators
import DashboardScreen from "../screens/DashboardScreen";
import Scheduler from "../screens/Scheduler";
import ScheduleDetailsScreen from "../screens/ScheduleDetailsScreen";
import ScheduleSettings from "../screens/ScheduleSettings";
import MealStackNavigator from "./MealStackNavigator";
import WorkoutStackNavigator from "./WorkoutStackNavigator";
import SettingsNavigator from "./SettingsNavigator";

// Lazy screens
const Progress = lazy(() => import("../screens/Progress"));
const ProgressSettings = lazy(() => import("../screens/ProgressSettings"));

// Navigators
const Tab = createBottomTabNavigator();
const ScheduleStack = createNativeStackNavigator();
const ProgressStack = createNativeStackNavigator();

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

// --- Progress Stack ---
function ProgressStackNavigator() {
  return (
    <ProgressStack.Navigator screenOptions={{ headerShown: false }}>
      <ProgressStack.Screen name="ProgressHome">
        {() => (
          <Suspense fallback={null}>
            <Progress />
          </Suspense>
        )}
      </ProgressStack.Screen>
      <ProgressStack.Screen name="ProgressSettings">
        {() => (
          <Suspense fallback={null}>
            <ProgressSettings />
          </Suspense>
        )}
      </ProgressStack.Screen>
    </ProgressStack.Navigator>
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
        component={ProgressStackNavigator}
        options={{ title: "Progress" }}
      />
      <Tab.Screen name="Settings" component={SettingsNavigator} />
    </Tab.Navigator>
  );
}
