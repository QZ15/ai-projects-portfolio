import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import MealPlannerScreen from '../screens/MealPlannerScreen';
import WorkoutPlannerScreen from '../screens/WorkoutPlannerScreen';
import SchedulerScreen from '../screens/SchedulerScreen';
import ProgressScreen from '../screens/ProgressScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: '#000' }, tabBarActiveTintColor: '#fff' }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Meals" component={MealPlannerScreen} />
      <Tab.Screen name="Workouts" component={WorkoutPlannerScreen} />
      <Tab.Screen name="Schedule" component={SchedulerScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
    </Tab.Navigator>
  );
}
