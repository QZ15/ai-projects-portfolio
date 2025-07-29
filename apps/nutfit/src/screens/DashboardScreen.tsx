import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function DashboardScreen() {
  const navigation = useNavigation();

  // Mock objects for deep linking
  const todayMeal = {
    name: "Chicken Avocado Salad",
    macros: "450 kcal • 32g P • 20g C • 29g F",
    image: require("../../assets/mock/mealofday.png"),
  };

  const todayWorkout = {
    title: "Pull Day",
    exercises: 7,
    duration: "55-65 min",
    description: "Back, biceps, and rear delts",
    image:
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800",
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <View>
            <Text className="text-white text-[28px] font-bold">
              Welcome back,
            </Text>
            <Text className="text-white text-[28px] font-bold -mt-1">
              Qasim!
            </Text>
          </View>
          <TouchableOpacity className="p-2 bg-neutral-900 rounded-xl">
            <Ionicons name="settings-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* TODAY'S SUMMARY */}
        <Text className="text-gray-300 text-sm font-semibold mb-3">
          TODAY’S SUMMARY
        </Text>

        {/* Calories Consumed */}
        <TouchableOpacity className="bg-neutral-900 p-4 rounded-2xl mb-3 flex-row justify-between items-center">
          <View>
            <Text className="text-white text-2xl font-bold">582</Text>
            <Text className="text-gray-400 text-xs -mt-1">kcal</Text>
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-white font-semibold">
              Calories Consumed
            </Text>
            <Text className="text-gray-400 text-xs">Calories Burned</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>

        {/* Current Weight */}
        <TouchableOpacity className="bg-neutral-900 p-4 rounded-2xl mb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-white text-2xl font-bold">433</Text>
            <Text className="text-gray-400 text-xs -mt-1">kcal</Text>
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-white font-semibold">
              Current Weight
            </Text>
            <Text className="text-gray-400 text-xs">Current Weight</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>

        {/* QUICK ACTIONS */}
        <Text className="text-gray-300 text-sm font-semibold mb-3">
          QUICK ACTIONS
        </Text>

        {/* View Today's Meal Plan */}
        <TouchableOpacity
          className="bg-neutral-900 p-4 rounded-2xl mb-3 flex-row items-center"
          onPress={() => navigation.navigate("MealDetails", { meal: todayMeal })}
        >
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text className="text-white ml-3 font-semibold">
            View Today’s Meal Plan
          </Text>
        </TouchableOpacity>

        {/* Start Workout */}
        <TouchableOpacity
          className="bg-neutral-900 p-4 rounded-2xl flex-row items-center"
          onPress={() =>
            navigation.navigate("WorkoutDetails", { workout: todayWorkout })
          }
        >
          <Ionicons name="barbell-outline" size={20} color="#fff" />
          <Text className="text-white ml-3 font-semibold">Start Workout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
