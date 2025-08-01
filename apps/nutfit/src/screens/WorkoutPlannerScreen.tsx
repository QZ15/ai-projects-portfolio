import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  LayoutAnimation,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { generateWorkoutPlan, generateSingleWorkout, generateRequestedWorkout } from "../services/workoutService";
import { useWorkoutFilters } from "../context/WorkoutFilterContext";
import { useWorkoutFavorites } from "../context/WorkoutFavoritesContext";
import { useTodayWorkouts } from "../context/TodayWorkoutsContext";
import { useRecentWorkouts } from "../context/RecentWorkoutsContext";

export default function WorkoutPlannerScreen() {
  const navigation = useNavigation();
  const { filters } = useWorkoutFilters();
  const { favorites, toggleFavorite, isFavorite } = useWorkoutFavorites();
  const { todayWorkouts, addToToday, removeFromToday } = useTodayWorkouts();
  const { recentWorkouts, addRecentWorkout } = useRecentWorkouts();
  const [loading, setLoading] = useState<string | null>(null);
  const [planWorkouts, setPlanWorkouts] = useState<any[]>([]);
  const [singleWorkout, setSingleWorkout] = useState<any | null>(null);
  const [requestedWorkout, setRequestedWorkout] = useState<any | null>(null);
  const [showAIPlan, setShowAIPlan] = useState(true);
  const [showToday, setShowToday] = useState(true);
  const [showFavorites, setShowFavorites] = useState(true);
  const [showRecent, setShowRecent] = useState(true);
  const [showAITools, setShowAITools] = useState(true);
  const [showWorkoutOfDay, setShowWorkoutOfDay] = useState(true);

  const renderWorkoutRow = (workout: any) => {
    const inToday = todayWorkouts.some((w) => w.name === workout.name);
    return (
      <TouchableOpacity
        key={workout.name}
        className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
        onPress={() => navigation.navigate("WorkoutDetails", { workout })}
      >
        <View style={{ flex: 1 }}>
          <Text className="text-white font-medium">{workout.name}</Text>
          <Text className="text-gray-400 text-xs mt-0.5">
            {workout.workoutType} • {workout.duration ?? 0} min
          </Text>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(workout)}>
          <Ionicons
            name={isFavorite(workout) ? "heart" : "heart-outline"}
            size={20}
            color={isFavorite(workout) ? "white" : "#FFFFFF"}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => (inToday ? removeFromToday(workout) : addToToday(workout))}>
          <Ionicons
            name={inToday ? "remove-circle-outline" : "add-circle-outline"}
            size={22}
            color={inToday ? "white" : "#FFFFFF"}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const handleAIPlan = async () => {
    try {
      setLoading("plan");
      const plan = await generateWorkoutPlan(filters);
      if (Array.isArray(plan)) {
        setPlanWorkouts(plan);
        plan.forEach(addRecentWorkout);
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
      const w = await generateSingleWorkout(filters);
      setSingleWorkout(w);
      if (w) addRecentWorkout(w);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const handleRequestedWorkout = async () => {
    try {
      setLoading("requested");
      const w = await generateRequestedWorkout(filters);
      setRequestedWorkout(w);
      if (w) addRecentWorkout(w);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const workoutOfTheDay = requestedWorkout || singleWorkout || planWorkouts[0];

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Workout Planner</Text>
          <TouchableOpacity onPress={() => navigation.navigate("WorkoutPlanFilters")}> 
            <Ionicons name="settings-outline" size={22} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* AI Tools */}
        <TouchableOpacity
          onPress={() => { LayoutAnimation.easeInEaseOut(); setShowAITools(!showAITools); }}
          className="flex-row justify-between items-center"
        >
          <Text className="text-white text-lg font-semibold mb-3">AI Tools</Text>
          <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
        {showAITools && (
          <View className="mb-6">
            <TouchableOpacity
              className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
              onPress={handleAIPlan}
            >
              <View className="flex-row items-center">
                <Ionicons name="barbell-outline" size={20} color="#fff" />
                <View className="ml-3">
                  <Text className="text-white text-base font-semibold">AI Workout Plan</Text>
                  <Text className="text-gray-400 text-xs mt-0.5">Generate a workout plan with AI</Text>
                </View>
              </View>
              {loading === "plan" ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Ionicons name="chevron-forward" size={18} color="#6B7280" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
              onPress={handleSingleWorkout}
            >
              <View className="flex-row items-center">
                <Ionicons name="flash-outline" size={20} color="#fff" />
                <View className="ml-3">
                  <Text className="text-white text-base font-semibold">Single Workout</Text>
                  <Text className="text-gray-400 text-xs mt-0.5">Generate a workout for today</Text>
                </View>
              </View>
              {loading === "single" ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Ionicons name="chevron-forward" size={18} color="#6B7280" />
              )}
            </TouchableOpacity>

            <View className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center">
              <View className="flex-row items-center flex-1">
                <Ionicons name="create-outline" size={20} color="#fff" />
                <View className="ml-3">
                  <Text className="text-white text-base font-semibold">Request Workout</Text>
                  <Text className="text-gray-400 text-xs mt-0.5">Generate by name</Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity onPress={() => navigation.navigate("RequestWorkout")}
                  style={{ marginRight: 12 }}>
                  <Ionicons name="settings-outline" size={20} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRequestedWorkout}>
                  {loading === "requested" ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Ionicons name="chevron-forward" size={18} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Workout of the Day */}
        {workoutOfTheDay && (
          <>
            <TouchableOpacity
              onPress={() => { LayoutAnimation.easeInEaseOut(); setShowWorkoutOfDay(!showWorkoutOfDay); }}
              className="flex-row justify-between items-center"
            >
              <Text className="text-white text-lg font-semibold mb-3">Workout of the Day</Text>
              <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
            </TouchableOpacity>
            {showWorkoutOfDay && renderWorkoutRow(workoutOfTheDay)}
          </>
        )}

        {/* Recent Workouts */}
        <TouchableOpacity
          onPress={() => { LayoutAnimation.easeInEaseOut(); setShowRecent(!showRecent); }}
          className="flex-row justify-between items-center"
        >
          <Text className="text-white text-lg font-semibold mt-6 mb-3">
            Recent Workouts ({recentWorkouts.length})
          </Text>
          <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
        {showRecent && recentWorkouts.map(renderWorkoutRow)}

        {/* AI Workout Plan */}
        {planWorkouts.length > 0 && (
          <>
            <TouchableOpacity
              onPress={() => { LayoutAnimation.easeInEaseOut(); setShowAIPlan(!showAIPlan); }}
              className="flex-row justify-between items-center"
            >
              <Text className="text-white text-lg font-semibold mt-6 mb-3">AI Workout Plan</Text>
              <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
            </TouchableOpacity>
            {showAIPlan && planWorkouts.map(renderWorkoutRow)}
          </>
        )}

        {/* Today Workouts */}
        <TouchableOpacity
          onPress={() => { LayoutAnimation.easeInEaseOut(); setShowToday(!showToday); }}
          className="flex-row justify-between items-center"
        >
          <Text className="text-white text-lg font-semibold mt-6 mb-3">
            Today's Workouts ({todayWorkouts.length})
          </Text>
          <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
        {showToday && todayWorkouts.map(renderWorkoutRow)}

        {/* Favorites */}
        <TouchableOpacity
          onPress={() => { LayoutAnimation.easeInEaseOut(); setShowFavorites(!showFavorites); }}
          className="flex-row justify-between items-center"
        >
          <Text className="text-white text-lg font-semibold mt-6 mb-3">
            Favorites ({favorites.length})
          </Text>
          <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
        {showFavorites && favorites.map(renderWorkoutRow)}
      </ScrollView>
    </SafeAreaView>
  );
}
