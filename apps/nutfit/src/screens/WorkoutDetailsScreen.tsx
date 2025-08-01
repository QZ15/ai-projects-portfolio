import React from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTodayWorkouts } from "../context/TodayWorkoutsContext";
import { useWorkoutFavorites } from "../context/WorkoutFavoritesContext";

export default function WorkoutDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { workout } = route.params || {};
  const { addToToday } = useTodayWorkouts();
  const { toggleFavorite, isFavorite } = useWorkoutFavorites();

  const title = workout?.name || "Workout";

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Ionicons name="arrow-back-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-[20px] font-bold">{title}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(workout)} className="p-2">
            <Ionicons
              name={isFavorite(workout) ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite(workout) ? "#ef4444" : "#fff"}
            />
          </TouchableOpacity>
        </View>

        <View className="bg-neutral-900 p-4 rounded-2xl mb-6">
          <Text className="text-white text-lg font-semibold">{workout?.workoutType}</Text>
          <Text className="text-gray-400 text-sm mt-1">
            {workout?.duration ? `${workout.duration} min` : ""}
          </Text>
        </View>

        {Array.isArray(workout?.exercises) && (
          <View className="bg-neutral-900 p-4 rounded-2xl mb-6">
            {workout.exercises.map((ex: any, idx: number) => (
              <View key={idx} className="mb-3">
                <Text className="text-white font-semibold">{ex.name}</Text>
                <Text className="text-gray-400 text-sm">
                  {ex.sets} sets × {ex.reps} reps{ex.rest ? ` • Rest ${ex.rest}` : ""}
                </Text>
                {ex.notes && <Text className="text-gray-500 text-xs mt-1">{ex.notes}</Text>}
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-2xl items-center"
          onPress={() => addToToday(workout)}
        >
          <Text className="text-white font-semibold">Mark Completed</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
