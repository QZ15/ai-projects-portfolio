import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function WorkoutDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { workoutName, exercises, duration } = route.params as {
    workoutName: string;
    exercises: { name: string; sets: number; reps: string }[];
    duration: string;
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">
            {workoutName}
          </Text>
          <TouchableOpacity
            className="p-2 bg-neutral-900 rounded-xl"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View className="bg-neutral-900 p-4 rounded-2xl mb-6">
          <Text className="text-white font-semibold">
            {exercises.length} exercises • {duration}
          </Text>
        </View>

        {/* Exercise List */}
        {exercises.map((exercise, idx) => (
          <View
            key={idx}
            className="bg-neutral-900 p-4 rounded-2xl mb-3 flex-row justify-between items-center"
          >
            <View>
              <Text className="text-white font-semibold">{exercise.name}</Text>
              <Text className="text-gray-400 text-xs">
                {exercise.sets} sets • {exercise.reps} reps
              </Text>
            </View>
            <Ionicons name="barbell-outline" size={18} color="#6B7280" />
          </View>
        ))}

        {/* Start Workout */}
        <TouchableOpacity className="bg-blue-500 py-4 rounded-2xl items-center mt-6">
          <Text className="text-white font-semibold">Start Workout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
