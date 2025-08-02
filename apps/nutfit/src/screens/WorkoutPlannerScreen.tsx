import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  LayoutAnimation,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { generateWorkoutPlan, generateSingleWorkout } from "../services/workoutService";
import { useWorkoutFilters } from "../context/WorkoutFilterContext";
import { useWorkoutFavorites } from "../context/WorkoutFavoritesContext";
import { useWeekWorkouts } from "../context/WeekWorkoutsContext";
import { useRecentWorkouts } from "../context/RecentWorkoutsContext";
import { useCompletedWorkouts } from "../context/CompletedWorkoutsContext";

export default function WorkoutPlannerScreen() {
  const navigation = useNavigation<any>();
  const { filters } = useWorkoutFilters();
  const { favorites, toggleFavorite, isFavorite } = useWorkoutFavorites();
  const { weekWorkouts, addToWeek, removeFromWeek } = useWeekWorkouts();
  const { recentWorkouts, addRecentWorkout } = useRecentWorkouts();
  const { completedWorkouts } = useCompletedWorkouts();
  const [loading, setLoading] = useState<string | null>(null);
  const [planWorkouts, setPlanWorkouts] = useState<any[]>([]);
  const [showAIPlan, setShowAIPlan] = useState(true);
  const [showWeek, setShowWeek] = useState(true);
  const [showFavorites, setShowFavorites] = useState(true);
  const [showRecent, setShowRecent] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showAITools, setShowAITools] = useState(true);
  const [showWorkoutOfDay, setShowWorkoutOfDay] = useState(true);

  const fallbackImages: Record<string, string> = {
    Push: "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Pull: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Legs: "https://images.unsplash.com/photo-1604233098531-90b71b1b17a6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Arms: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Core: "https://images.unsplash.com/photo-1437935690510-49ce2c715aee?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Full Body": "https://images.unsplash.com/photo-1434754205268-ad3b5f549b11?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Default: "https://images.unsplash.com/photo-1604335788369-94f349ae5243?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  const withFallbackImage = (w: any) => {
    const key = w.primaryMuscleGroup || w.workoutType;
    return {
      ...w,
      primaryMuscleGroup: key,
      image: w.image || fallbackImages[key] || fallbackImages.Default,
    };
  };

  const workoutImage = (w: any) =>
    w?.image ||
    fallbackImages[w?.primaryMuscleGroup || w?.workoutType] ||
    fallbackImages.Default;

  const renderWorkoutRow = (workout: any) => {
    const normalized = withFallbackImage(workout);
    const inWeek = weekWorkouts.some((w) => w.name === normalized.name);
    return (
      <TouchableOpacity
        key={normalized.name}
        className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
        onPress={() => navigation.navigate("WorkoutDetails", { workout: normalized })}
      >
        <View style={{ flex: 1 }}>
          <Text className="text-white font-medium">{normalized.name}</Text>
          <Text className="text-gray-400 text-xs mt-0.5">
            {normalized.workoutType} • {normalized.duration ?? 0} min
          </Text>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(normalized)}>
          <Ionicons
            name={isFavorite(normalized) ? "heart" : "heart-outline"}
            size={20}
            color={isFavorite(normalized) ? "white" : "#FFFFFF"}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => (inWeek ? removeFromWeek(normalized) : addToWeek(normalized))}
        >
          <Ionicons
            name={inWeek ? "remove-circle-outline" : "add-circle-outline"}
            size={22}
            color={inWeek ? "white" : "#FFFFFF"}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const buildActiveFilters = () => {
    const {
      fitnessGoal,
      workoutType,
      equipment,
      daysPerWeek,
      timePerWorkout,
      muscleGroups,
      excludedExercises,
      requestedWorkout,
      fitnessGoalEnabled,
      workoutTypeEnabled,
      equipmentEnabled,
      daysPerWeekEnabled,
      timePerWorkoutEnabled,
      muscleGroupsEnabled,
      excludedExercisesEnabled,
      requestedWorkoutEnabled,
    } = filters as any;

    const active: any = {};
    if (fitnessGoalEnabled) active.fitnessGoal = fitnessGoal;
    if (workoutTypeEnabled) active.workoutType = workoutType;
    if (equipmentEnabled) active.equipment = equipment;
    if (daysPerWeekEnabled) active.daysPerWeek = daysPerWeek;
    if (timePerWorkoutEnabled) active.timePerWorkout = timePerWorkout;
    if (muscleGroupsEnabled) active.muscleGroups = muscleGroups;
    if (excludedExercisesEnabled) active.excludedExercises = excludedExercises;
    if (requestedWorkoutEnabled) active.requestedWorkout = requestedWorkout;
    return active;
  };

  const handleAIPlan = async () => {
    try {
      setLoading("plan");
      const active = buildActiveFilters();
      const plan = await generateWorkoutPlan(active);
      if (Array.isArray(plan)) {
        const primary = active.muscleGroups?.[0];
        setPlanWorkouts(
          plan.map((w: any) => withFallbackImage({ ...w, primaryMuscleGroup: w.primaryMuscleGroup || primary }))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const handleSingleWorkout = async () => {
    try {
      setLoading("single");
      const active = buildActiveFilters();
      const w = await generateSingleWorkout(active);
      if (w) {
        const primary = active.muscleGroups?.[0];
        const normalized = withFallbackImage({ ...w, primaryMuscleGroup: w.primaryMuscleGroup || primary });
        addRecentWorkout(normalized);
        navigation.navigate("WorkoutDetails", { workout: normalized });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const workoutOfTheDay = weekWorkouts[0];

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Workout Planner</Text>
          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.easeInEaseOut();
              setShowAITools(!showAITools);
            }}
          >
            <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {showAITools && (
          <View className="mb-6">
            {/* AI Workout Plan */}
            <TouchableOpacity
              className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
              onPress={handleAIPlan}
              disabled={!!loading}
            >
              <View className="flex-row items-center flex-1">
                <Ionicons name="barbell-outline" size={20} color="#fff" />
                <View className="ml-3">
                  <Text className="text-white text-base font-semibold">
                    {loading === "plan" ? "Generating..." : "AI Workout Plan"}
                  </Text>
                  <Text className="text-gray-400 text-xs mt-0.5">Generate a multi-day plan</Text>
                </View>
              </View>
              <View style={{ width: 1, height: "100%", backgroundColor: "#3F3F46", marginHorizontal: 20 }} />
              <View className="flex-row items-center">
                <TouchableOpacity onPress={() => navigation.navigate("WorkoutPlanFilters")}>
                  <Ionicons name="settings-outline" size={20} color="#6B7280" style={{ marginRight: 8 }} />
                </TouchableOpacity>
                {loading === "plan" ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Ionicons name="chevron-forward" size={18} color="#6B7280" />
                )}
              </View>
            </TouchableOpacity>

            {/* Single Workout */}
            <TouchableOpacity
              className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center"
              onPress={handleSingleWorkout}
              disabled={!!loading}
            >
              <View className="flex-row items-center flex-1">
                <Ionicons name="flash-outline" size={20} color="#fff" />
                <View className="ml-3">
                  <Text className="text-white text-base font-semibold">
                    {loading === "single" ? "Generating..." : "Single Workout"}
                  </Text>
                  <Text className="text-gray-400 text-xs mt-0.5">Generate a workout for today</Text>
                </View>
              </View>
              <View style={{ width: 1, height: "100%", backgroundColor: "#3F3F46", marginHorizontal: 20 }} />
              <View className="flex-row items-center">
                <TouchableOpacity onPress={() => navigation.navigate("SingleWorkoutFilters")}>
                  <Ionicons name="settings-outline" size={20} color="#6B7280" style={{ marginRight: 8 }} />
                </TouchableOpacity>
                {loading === "single" ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Ionicons name="chevron-forward" size={18} color="#6B7280" />
                )}
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Workout of the Day */}
        {workoutOfTheDay && (
          <>
            <TouchableOpacity
              onPress={() => {
                LayoutAnimation.easeInEaseOut();
                setShowWorkoutOfDay(!showWorkoutOfDay);
              }}
              className="flex-row justify-between items-center"
            >
              <Text className="text-white text-lg font-semibold mb-3">Workout of the Day</Text>
              <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
            </TouchableOpacity>
            {showWorkoutOfDay && (
              <TouchableOpacity
                className="bg-neutral-900 rounded-2xl overflow-hidden mb-3"
                onPress={() =>
                  navigation.navigate("WorkoutDetails", {
                    workout: withFallbackImage(workoutOfTheDay),
                  })
                }
              >
                <Image
                  source={{ uri: workoutImage(workoutOfTheDay) }}
                  className="w-full h-40"
                  resizeMode="cover"
                />
                <View className="p-4">
                  <Text className="text-white text-lg font-semibold">{workoutOfTheDay.name}</Text>
                  <Text className="text-gray-400 text-sm mt-1">
                    {workoutOfTheDay.workoutType} • {workoutOfTheDay.duration ?? 0} min
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* This Week's Workouts */}
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            setShowWeek(!showWeek);
          }}
          className="flex-row justify-between items-center"
        >
          <Text className="text-white text-lg font-semibold mt-6 mb-3">
            This Weeks Workouts ({weekWorkouts.length})
          </Text>
          <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
        {showWeek && (
          <View style={{ maxHeight: weekWorkouts.length > 4 ? 300 : undefined }}>
            <ScrollView>{weekWorkouts.map(renderWorkoutRow)}</ScrollView>
          </View>
        )}

        {/* AI Workout Plan */}
        {planWorkouts.length > 0 && (
          <>
            <TouchableOpacity
              onPress={() => {
                LayoutAnimation.easeInEaseOut();
                setShowAIPlan(!showAIPlan);
              }}
              className="flex-row justify-between items-center"
            >
              <Text className="text-white text-lg font-semibold mt-6 mb-3">AI Workout Plan</Text>
              <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
            </TouchableOpacity>
            {showAIPlan && (
              <View style={{ maxHeight: planWorkouts.length > 4 ? 300 : undefined }}>
                <ScrollView>{planWorkouts.map(renderWorkoutRow)}</ScrollView>
              </View>
            )}
          </>
        )}

        {/* Favorites */}
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            setShowFavorites(!showFavorites);
          }}
          className="flex-row justify-between items-center"
        >
          <Text className="text-white text-lg font-semibold mt-6 mb-3">
            Favorites ({favorites.length})
          </Text>
          <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
        {showFavorites && (
          <View style={{ maxHeight: favorites.length > 4 ? 300 : undefined }}>
            <ScrollView>{favorites.map(renderWorkoutRow)}</ScrollView>
          </View>
        )}

        {/* Recent Workouts */}
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            setShowRecent(!showRecent);
          }}
          className="flex-row justify-between items-center"
        >
          <Text className="text-white text-lg font-semibold mt-6 mb-3">
            Recent Workouts ({recentWorkouts.length})
          </Text>
          <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
        {showRecent && (
          <View style={{ maxHeight: recentWorkouts.length > 4 ? 300 : undefined }}>
            <ScrollView>{recentWorkouts.map(renderWorkoutRow)}</ScrollView>
          </View>
        )}

        {/* Completed Workouts */}
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            setShowCompleted(!showCompleted);
          }}
          className="flex-row justify-between items-center"
        >
          <Text className="text-white text-lg font-semibold mt-6 mb-3">
            Completed Workouts ({completedWorkouts.length})
          </Text>
          <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
        {showCompleted && (
          <View style={{ maxHeight: completedWorkouts.length > 4 ? 300 : undefined }}>
            <ScrollView>{completedWorkouts.map(renderWorkoutRow)}</ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
