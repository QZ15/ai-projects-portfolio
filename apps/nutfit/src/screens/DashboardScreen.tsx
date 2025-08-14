// src/screens/DashboardScreen.tsx
import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { useProfile } from "../context/ProfileContext";
import { useTodayMeals } from "../context/TodayMealsContext";
import { useWeekWorkouts } from "../context/WeekWorkoutsContext";
import { useProgress } from "../context/ProgressContext";

export default function DashboardScreen() {
  const navigation = useNavigation<any>();

  // Profile (name/goal/etc.)
  const { profile } = useProfile();

  // Meals (consume only completed)
  const { todayMeals } = useTodayMeals();
  const consumedCalories = useMemo(
    () =>
      todayMeals
        .filter((m: any) => m.completed)
        .reduce((sum: number, m: any) => sum + (Number(m.calories) || 0), 0),
    [todayMeals]
  );
  const completedCount = todayMeals.filter((m) => m.completed).length;
  const nextMeal = todayMeals.find((m) => !m.completed);

  // Workouts (today’s workout preview)
  const { weekWorkouts } = useWeekWorkouts();
  const todaysWorkout = weekWorkouts?.[0];

  // Progress (latest weight)
  const { weightData } = useProgress();
  const latestWeight = weightData.length ? weightData[weightData.length - 1].weight : undefined;
  const latestWeightDate = weightData.length ? weightData[weightData.length - 1].date : undefined;
  const netChange =
    weightData.length >= 2
      ? +(weightData[weightData.length - 1].weight - weightData[0].weight).toFixed(1)
      : 0;

  const greetName = profile?.name?.trim() || "there";

  // Images
  const mealFallbackImages: Record<string, string> = {
    Breakfast: "https://images.unsplash.com/photo-1532980400857-e8d9d275d858?q=80&w=687&auto=format&fit=crop",
    Lunch:     "https://images.unsplash.com/photo-1593114630390-e35acaa7d7d6?q=80&w=764&auto=format&fit=crop",
    Dinner:    "https://images.unsplash.com/photo-1659480150417-25f9f0d5ca2e?q=80&w=765&auto=format&fit=crop",
    Snack:     "https://images.unsplash.com/photo-1648471981428-ede812604400?q=80&w=687&auto=format&fit=crop",
    Default:   "https://images.unsplash.com/photo-1626300006988-42a927fd80ee?q=80&w=771&auto=format&fit=crop",
  };
  const nextMealImage = nextMeal
    ? nextMeal.image ||
      mealFallbackImages[nextMeal.mealType as keyof typeof mealFallbackImages] ||
      mealFallbackImages.Default
    : undefined;

  const workoutFallbackImages: Record<string, string> = {
    Push: "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?q=80&w=1073&auto=format&fit=crop",
    Pull: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1170&auto=format&fit=crop",
    Legs: "https://images.unsplash.com/photo-1604233098531-90b71b1b17a6?q=80&w=1170&auto=format&fit=crop",
    Arms: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1170&auto=format&fit=crop",
    Core: "https://images.unsplash.com/photo-1437935690510-49ce2c715aee?q=80&w=1632&auto=format&fit=crop",
    "Full Body": "https://images.unsplash.com/photo-1434754205268-ad3b5f549b11?q=80&w=1174&auto=format&fit=crop",
    Default: "https://images.unsplash.com/photo-1604335788369-94f349ae5243?q=80&w=1170&auto=format&fit=crop",
  };
  const workoutKey = todaysWorkout?.primaryMuscleGroup || todaysWorkout?.workoutType;
  const todaysWorkoutImage =
    todaysWorkout?.image ||
    workoutFallbackImages[workoutKey as keyof typeof workoutFallbackImages] ||
    workoutFallbackImages.Default;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <View>
            <Text className="text-white text-[28px] font-bold">Welcome back,</Text>
            <Text className="text-white text-[28px] font-bold -mt-1">{greetName}!</Text>
          </View>
          <TouchableOpacity
            className="p-2 bg-neutral-900 rounded-xl"
            onPress={() => navigation.navigate("Settings")}
          >
            <Ionicons name="settings-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* TODAY’S SUMMARY */}
        <Text className="text-gray-300 text-sm font-semibold mb-3">TODAY’S SUMMARY</Text>

        {/* Calories Consumed (only completed meals) */}
        <TouchableOpacity
          className="bg-neutral-900 p-4 rounded-2xl mb-3 flex-row justify-between items-center"
          onPress={() => navigation.navigate("Meals")}
        >
          <View>
            <Text className="text-white text-2xl font-bold">{Math.round(consumedCalories)}</Text>
            <Text className="text-gray-400 text-xs -mt-1">kcal</Text>
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-white font-semibold">Calories Consumed</Text>
            <Text className="text-gray-400 text-xs">
              {completedCount}/{todayMeals.length} meals completed
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>

        {/* Current Weight */}
        <TouchableOpacity
          className="bg-neutral-900 p-4 rounded-2xl mb-6 flex-row justify-between items-center"
          onPress={() => navigation.navigate("Progress")}
        >
          <View>
            <Text className="text-white text-2xl font-bold">
              {latestWeight !== undefined ? latestWeight : "—"}
            </Text>
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-white font-semibold">Current Weight</Text>
            <Text className="text-gray-400 text-xs">
              {latestWeightDate
                ? `Updated ${dayjs(latestWeightDate).format("MMM D")}${
                    netChange ? ` • Net ${netChange > 0 ? "+" : ""}${netChange} lbs` : ""
                  }`
                : "No entries yet"}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>

        {/* NEXT MEAL */}
        <Text className="text-gray-300 text-sm font-semibold mt-2 mb-3">NEXT MEAL</Text>
        {nextMeal ? (
          <TouchableOpacity
            className="bg-neutral-900 rounded-2xl overflow-hidden mb-6"
            onPress={() =>
              navigation.navigate("Meals", {
                screen: "MealDetails",
                params: { meal: nextMeal },
              })
            }
          >
            {nextMealImage ? (
              <Image source={{ uri: nextMealImage }} className="w-full h-40" resizeMode="cover" />
            ) : null}
            <View className="p-4">
              <Text className="text-white text-lg font-semibold">{nextMeal.name}</Text>
              <Text className="text-gray-400 text-sm mt-1">
                {nextMeal.calories ?? 0} kcal • {nextMeal.protein ?? 0}g P •{" "}
                {nextMeal.carbs ?? 0}g C • {nextMeal.fat ?? 0}g F
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View className="bg-neutral-900 p-4 rounded-2xl mb-6">
            <Text className="text-white font-semibold">All meals completed 🎉</Text>
            <Text className="text-gray-400 text-sm mt-1">Great job staying on track today.</Text>
          </View>
        )}

        {/* TODAY’S WORKOUT — now styled like Next Meal and opens details */}
        <Text className="text-gray-300 text-sm font-semibold mt-2 mb-3">TODAY’S WORKOUT</Text>
        {todaysWorkout ? (
          <TouchableOpacity
            className="bg-neutral-900 rounded-2xl overflow-hidden mb-6"
            onPress={() =>
              navigation.navigate("Workouts", {
                screen: "WorkoutDetails",
                params: { workout: todaysWorkout },
              })
            }
          >
            {todaysWorkoutImage ? (
              <Image source={{ uri: todaysWorkoutImage }} className="w-full h-40" resizeMode="cover" />
            ) : null}
            <View className="p-4">
              <Text className="text-white text-lg font-semibold">
                {todaysWorkout.name || "Workout"}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">
                {dayjs().format("ddd, MMM D")} • Plan ready
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View className="bg-neutral-900 p-4 rounded-2xl mb-6">
            <Text className="text-white font-semibold">No workout scheduled</Text>
            <Text className="text-gray-400 text-sm mt-1">Head to Workouts to plan your session.</Text>
          </View>
        )}

        {/* QUICK ACTIONS (bottom) */}
        <Text className="text-gray-300 text-sm font-semibold mb-3">QUICK ACTIONS</Text>

        <TouchableOpacity
          className="bg-neutral-900 p-4 rounded-2xl mb-3 flex-row items-center"
          onPress={() => navigation.navigate("Meals")}
        >
          <Ionicons name="fast-food-outline" size={20} color="#fff" />
          <Text className="text-white ml-3 font-semibold">View Today’s Meal Plan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-neutral-900 p-4 rounded-2xl mb-3 flex-row items-center"
          onPress={() => navigation.navigate("Workouts")}
        >
          <Ionicons name="barbell-outline" size={20} color="#fff" />
          <Text className="text-white ml-3 font-semibold">Start Today’s Workout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-neutral-900 p-4 rounded-2xl mb-3 flex-row items-center"
          onPress={() => navigation.navigate("Schedule")}
        >
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text className="text-white ml-3 font-semibold">Open Scheduler</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-neutral-900 p-4 rounded-2xl flex-row items-center"
          onPress={() => navigation.navigate("Progress")}
        >
          <Ionicons name="stats-chart-outline" size={20} color="#fff" />
          <Text className="text-white ml-3 font-semibold">Log Today’s Stats</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
