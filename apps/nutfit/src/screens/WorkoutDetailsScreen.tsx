import React from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useWeekWorkouts } from "../context/WeekWorkoutsContext";
import { useWorkoutFavorites } from "../context/WorkoutFavoritesContext";
import { useCompletedWorkouts } from "../context/CompletedWorkoutsContext";

export default function WorkoutDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { workout } = (route.params as any) || {};
  const { weekWorkouts, addToWeek, removeFromWeek } = useWeekWorkouts();
  const { toggleFavorite, isFavorite } = useWorkoutFavorites();
  const { addCompletedWorkout } = useCompletedWorkouts();

  const title = workout?.name || "Workout";
  const inWeek = weekWorkouts.some((w) => w.name === workout?.name);
  const workoutImage = workout?.image || "https://placehold.co/600x400?text=Workout";

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Image */}
        <Image
          source={{ uri: workoutImage }}
          className="w-full h-48 rounded-2xl mb-4"
          resizeMode="cover"
        />

        {/* Name + Buttons */}
        <View className="flex-row mb-6">
          <View className="bg-neutral-900 p-4 rounded-2xl flex-1 mr-3">
            {workout?.workoutType && (
              <Text className="text-blue-400 text-xs mb-1">{workout.workoutType}</Text>
            )}
            <Text className="text-white text-[24px] font-bold mb-1">{title}</Text>
            {workout?.duration && (
              <Text className="text-gray-400 text-sm">{workout.duration} min</Text>
            )}
          </View>

          <View className="justify-between bg-neutral-900 rounded-2xl p-2">
            <TouchableOpacity onPress={() => toggleFavorite(workout)}>
              <Ionicons
                name={isFavorite(workout) ? "heart" : "heart-outline"}
                size={28}
                color={isFavorite(workout) ? "white" : "white"}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => (inWeek ? removeFromWeek(workout) : addToWeek(workout))}>
              <Ionicons
                name={inWeek ? "remove-circle-outline" : "add-circle-outline"}
                size={28}
                color="white"
              />
            </TouchableOpacity>
          </View>
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

        {inWeek && (
          <TouchableOpacity
            className="bg-blue-500 p-4 rounded-2xl items-center"
            onPress={() => {
              addCompletedWorkout(workout);
              removeFromWeek(workout);
              navigation.goBack();
            }}
          >
            <Text className="text-white font-semibold">Mark Completed</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
