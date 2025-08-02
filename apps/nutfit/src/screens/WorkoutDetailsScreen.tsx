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

  const fallbackImages: Record<string, string> = {
    Push: "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Pull: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Legs: "https://images.unsplash.com/photo-1604233098531-90b71b1b17a6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Arms: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Core: "https://images.unsplash.com/photo-1437935690510-49ce2c715aee?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Full Body": "https://images.unsplash.com/photo-1434754205268-ad3b5f549b11?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Default: "https://images.unsplash.com/photo-1604335788369-94f349ae5243?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  const key = workout?.primaryMuscleGroup || workout?.workoutType;
  const workoutImage =
    workout?.image || fallbackImages[key as keyof typeof fallbackImages] || fallbackImages.Default;

  const normalizedWorkout = {
    ...workout,
    primaryMuscleGroup: key,
    image: workoutImage,
  };

  const inWeek = weekWorkouts.some((w) => w.name === normalizedWorkout.name);

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
            {normalizedWorkout?.workoutType && (
              <Text className="text-blue-400 text-xs mb-1">
                {normalizedWorkout.workoutType}
              </Text>
            )}
            <Text className="text-white text-[24px] font-bold mb-1">{title}</Text>
            {normalizedWorkout?.duration && (
              <Text className="text-gray-400 text-sm">
                {normalizedWorkout.duration} min
              </Text>
            )}
          </View>

          <View className="justify-between bg-neutral-900 rounded-2xl p-2">
            <TouchableOpacity onPress={() => toggleFavorite(normalizedWorkout)}>
              <Ionicons
                name={isFavorite(normalizedWorkout) ? "heart" : "heart-outline"}
                size={28}
                color={isFavorite(normalizedWorkout) ? "white" : "white"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => (inWeek ? removeFromWeek(normalizedWorkout) : addToWeek(normalizedWorkout))}
            >
              <Ionicons
                name={inWeek ? "remove-circle-outline" : "add-circle-outline"}
                size={28}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>

        {Array.isArray(normalizedWorkout?.exercises) && (
          <View className="bg-neutral-900 p-4 rounded-2xl mb-6">
            {normalizedWorkout.exercises.map((ex: any, idx: number) => (
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
              addCompletedWorkout(normalizedWorkout);
              removeFromWeek(normalizedWorkout);
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
