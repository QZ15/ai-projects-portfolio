import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import MealPlanner from '../screens/MealPlanner';
import WorkoutPlannerScreen from '../screens/WorkoutPlannerScreen';
import Scheduler from '../screens/Scheduler';
import ProgressScreen from '../screens/ProgressScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#000' },
        tabBarActiveTintColor: '#fff',
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Dashboard') iconName = 'home';
          else if (route.name === 'Meals') iconName = 'fast-food';
          else if (route.name === 'Workouts') iconName = 'barbell';
          else if (route.name === 'Schedule') iconName = 'calendar';
          else if (route.name === 'Progress') iconName = 'stats-chart';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Meals" component={MealPlanner} />
      <Tab.Screen name="Workouts" component={WorkoutPlannerScreen} />
      <Tab.Screen name="Schedule" component={Scheduler} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
    </Tab.Navigator>
  );
}
