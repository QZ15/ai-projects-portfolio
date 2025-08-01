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
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { generateWorkoutPlan, generateSingleWorkout, generateRequestedWorkout } from "../services/workoutService";
import { useWorkoutFilters } from "../context/WorkoutFilterContext";
import { useWorkoutFavorites } from "../context/WorkoutFavoritesContext";
import { useWeekWorkouts } from "../context/WeekWorkoutsContext";
import { useRecentWorkouts } from "../context/RecentWorkoutsContext";

export default function WorkoutPlannerScreen() {
  const navigation = useNavigation<any>();
  const { filters } = useWorkoutFilters();
  const { favorites, toggleFavorite, isFavorite } = useWorkoutFavorites();
  const { weekWorkouts, addToWeek, removeFromWeek } = useWeekWorkouts();
  const { recentWorkouts, addRecentWorkout } = useRecentWorkouts();
  const [loading, setLoading] = useState<string | null>(null);
  const [planWorkouts, setPlanWorkouts] = useState<any[]>([]);
  const [showAIPlan, setShowAIPlan] = useState(true);
  const [showWeek, setShowWeek] = useState(true);
  const [showFavorites, setShowFavorites] = useState(true);
  const [showRecent, setShowRecent] = useState(true);
  const [showAITools, setShowAITools] = useState(true);
  const [showWorkoutOfDay, setShowWorkoutOfDay] = useState(true);

  const renderWorkoutRow = (workout: any) => {
    const inWeek = weekWorkouts.some((w) => w.name === workout.name);
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
        <TouchableOpacity onPress={() => (inWeek ? removeFromWeek(workout) : addToWeek(workout))}>
          <Ionicons
            name={inWeek ? "remove-circle-outline" : "add-circle-outline"}
            size={22}
            color={inWeek ? "white" : "#FFFFFF"}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const handleAIPlan = async () => {
    try {
      setLoading("plan");
      const { requestedWorkout, requestedWorkoutEnabled, ...cleanFilters } = filters as any;
      const plan = await generateWorkoutPlan(cleanFilters);
      if (Array.isArray(plan)) {
        setPlanWorkouts(plan);
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
      const { requestedWorkout, requestedWorkoutEnabled, ...cleanFilters } = filters as any;
      const w = await generateSingleWorkout(cleanFilters);
      if (w) {
        addRecentWorkout(w);
        navigation.navigate("WorkoutDetails", { workout: w });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const handleRequestedWorkout = async () => {
    try {
      setLoading("requested");
      if (!filters.requestedWorkoutEnabled || !filters.requestedWorkout) {
        Alert.alert("No Workout Entered", "Please enter a workout name in settings.");
        return;
      }
      const w = await generateRequestedWorkout(filters);
      if (w) {
        addRecentWorkout(w);
        navigation.navigate("WorkoutDetails", { workout: w });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const workoutImage = (w: any) =>
    `https://source.unsplash.com/400x300/?workout,${encodeURIComponent(w?.workoutType || "")}`;

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
              className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
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

            {/* Request Workout */}
            <TouchableOpacity
              className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center"
              onPress={handleRequestedWorkout}
              disabled={!!loading}
            >
              <View className="flex-row items-center flex-1">
                <Ionicons name="create-outline" size={20} color="#fff" />
                <View className="ml-3">
                  <Text className="text-white text-base font-semibold">
                    {loading === "requested" ? "Generating..." : "Request Workout"}
                  </Text>
                  <Text className="text-gray-400 text-xs mt-0.5">
                    {filters.requestedWorkout || "Enter a workout in settings"}
                  </Text>
                </View>
              </View>
              <View style={{ width: 1, height: "100%", backgroundColor: "#3F3F46", marginHorizontal: 20 }} />
              <View className="flex-row items-center">
                <TouchableOpacity onPress={() => navigation.navigate("RequestWorkout")}>
                  <Ionicons name="settings-outline" size={20} color="#6B7280" style={{ marginRight: 8 }} />
                </TouchableOpacity>
                {loading === "requested" ? (
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
                onPress={() => navigation.navigate("WorkoutDetails", { workout: workoutOfTheDay })}
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
              onPress={() => {
                LayoutAnimation.easeInEaseOut();
                setShowAIPlan(!showAIPlan);
              }}
              className="flex-row justify-between items-center"
            >
              <Text className="text-white text-lg font-semibold mt-6 mb-3">AI Workout Plan</Text>
              <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
            </TouchableOpacity>
            {showAIPlan && planWorkouts.map(renderWorkoutRow)}
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
        {showWeek && weekWorkouts.map(renderWorkoutRow)}

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
