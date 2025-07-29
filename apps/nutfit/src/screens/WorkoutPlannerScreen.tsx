import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function WorkoutPlannerScreen() {
  const navigation = useNavigation();

  const todayWorkout = {
    title: "Pull Day",
    details: "7 exercises • 55-65 min",
    image: { uri: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800" },
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Workout Planner</Text>
          <TouchableOpacity>
            <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View className="mb-6">
          <TouchableOpacity className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Ionicons name="barbell-outline" size={20} color="#fff" />
              <View className="ml-3">
                <Text className="text-white text-base font-semibold">AI Workout Plan</Text>
                <Text className="text-gray-400 text-xs mt-0.5">
                  Generate a workout plan with AI
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ionicons name="swap-horizontal-outline" size={20} color="#fff" />
              <View className="ml-3">
                <Text className="text-white text-base font-semibold">Switch Routine</Text>
                <Text className="text-gray-400 text-xs mt-0.5">
                  Choose a different workout split
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Featured Workout */}
        <Text className="text-white text-lg font-semibold mb-3">Today’s Workout</Text>
        <TouchableOpacity
          className="bg-neutral-900 rounded-2xl overflow-hidden mb-6"
          onPress={() => navigation.navigate("WorkoutDetails", { workout: todayWorkout })}
        >
          <Image source={todayWorkout.image} className="w-full h-40" resizeMode="cover" />
          <View className="p-4">
            <Text className="text-white text-lg font-semibold">{todayWorkout.title}</Text>
            <Text className="text-gray-400 text-sm mt-1">{todayWorkout.details}</Text>
          </View>
        </TouchableOpacity>

        {/* Workout History */}
        <Text className="text-white text-lg font-semibold mb-3">Your Workouts</Text>
        {[
          { title: "Leg Day", details: "6 exercises • 55 min" },
          { title: "Push Day", details: "3 exercises • 60 min" },
          { title: "Upper Body", details: "6 exercises • 50 min" },
        ].map((workout, idx) => (
          <TouchableOpacity
            key={idx}
            className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
            onPress={() => navigation.navigate("WorkoutDetails", { workout })}
          >
            <View>
              <Text className="text-white font-medium">{workout.title}</Text>
              <Text className="text-gray-400 text-xs mt-0.5">{workout.details}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6B7280" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
