import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function WorkoutDetailsScreen({ navigation }) {
  // Example workout data — replace with dynamic plan later
  const workout = {
    name: "Pull Day",
    duration: "55-65 min",
    exercises: [
      { name: "Pull-ups", sets: "4 x 8-10" },
      { name: "Barbell Rows", sets: "4 x 8-10" },
      { name: "Lat Pulldown", sets: "3 x 10-12" },
      { name: "Seated Cable Row", sets: "3 x 10-12" },
      { name: "Face Pulls", sets: "3 x 12-15" },
      { name: "Hammer Curls", sets: "3 x 10-12" },
      { name: "Incline Dumbbell Curls", sets: "3 x 10-12" },
    ],
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 bg-neutral-900 rounded-xl"
          >
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-[20px] font-bold">
            {workout.name}
          </Text>
          <View className="w-8" /> {/* spacer */}
        </View>

        {/* Summary */}
        <View className="bg-neutral-900 rounded-2xl p-4 mb-6">
          <Text className="text-white font-semibold text-lg">
            {workout.name}
          </Text>
          <Text className="text-gray-400 text-sm mt-1">
            {workout.exercises.length} exercises • {workout.duration}
          </Text>
        </View>

        {/* Exercises List */}
        <Text className="text-gray-300 text-sm font-semibold mb-3">
          Exercises
        </Text>
        {workout.exercises.map((exercise, index) => (
          <View
            key={index}
            className="bg-neutral-900 rounded-2xl p-4 mb-3 flex-row justify-between items-center"
          >
            <Text className="text-white">{exercise.name}</Text>
            <Text className="text-gray-400 text-sm">{exercise.sets}</Text>
          </View>
        ))}

        {/* Start Workout Button */}
        <TouchableOpacity className="bg-blue-500 py-4 rounded-full items-center mt-6">
          <Text className="text-white font-semibold text-lg">Start Workout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
