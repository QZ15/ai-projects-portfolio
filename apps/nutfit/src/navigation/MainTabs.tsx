import React, { lazy, Suspense } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import MealPlanner from '../screens/MealPlanner';
import WorkoutPlannerScreen from '../screens/WorkoutPlannerScreen';
import Scheduler from '../screens/Scheduler';
const Progress = lazy(() => import('../screens/Progress'));
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0D0D0D' },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: { paddingBottom: 2 },
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Dashboard') iconName = 'home';
          else if (route.name === 'Meals') iconName = 'fast-food';
          else if (route.name === 'Workouts') iconName = 'barbell';
          else if (route.name === 'Schedule') iconName = 'calendar';
          else if (route.name === 'Progress') iconName = 'stats-chart';
          else if (route.name === 'Settings') iconName = 'settings';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Meals" component={MealPlanner} />
      <Tab.Screen name="Workouts" component={WorkoutPlannerScreen} />
      <Tab.Screen name="Schedule" component={Scheduler} />
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
