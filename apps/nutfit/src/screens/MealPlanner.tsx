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

export default function MealPlanner() {
  const navigation = useNavigation();

  const todayMeal = {
    name: "Chicken Avocado Salad",
    macros: "450 kcal • 32g P • 20g C • 29g F",
    image: require("../../assets/mock/mealofday.png"),
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Meal Planner</Text>
          <TouchableOpacity>
            <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View className="mb-6">
          <TouchableOpacity className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Ionicons name="restaurant-outline" size={20} color="#fff" />
              <View className="ml-3">
                <Text className="text-white text-base font-semibold">AI Meal Plan</Text>
                <Text className="text-gray-400 text-xs mt-0.5">
                  Generate a meal plan with AI
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ionicons name="add-outline" size={20} color="#fff" />
              <View className="ml-3">
                <Text className="text-white text-base font-semibold">Select Ingredients</Text>
                <Text className="text-gray-400 text-xs mt-0.5">
                  Generate a meal based on what you have
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Featured Meal */}
        <Text className="text-white text-lg font-semibold mb-3">Meal of the Day</Text>
        <TouchableOpacity
          className="bg-neutral-900 rounded-2xl overflow-hidden mb-6"
          onPress={() => navigation.navigate("MealDetails", { meal: todayMeal })}
        >
          <Image source={todayMeal.image} className="w-full h-40" resizeMode="cover" />
          <View className="p-4">
            <Text className="text-white text-lg font-semibold">{todayMeal.name}</Text>
            <Text className="text-gray-400 text-sm mt-1">{todayMeal.macros}</Text>
          </View>
        </TouchableOpacity>

        {/* Meals History */}
        <Text className="text-white text-lg font-semibold mb-3">Your Meals</Text>
        {[
          { name: "Oatmeal with Berries", macros: "320 kcal • 7g P • 55g C • 10g F" },
          { name: "Grilled Salmon", macros: "600 kcal • 55g P • 8g C • 38g F" },
          { name: "Veggie Omelette", macros: "350 kcal • 22g P • 8g C • 26g F" },
        ].map((meal, idx) => (
          <TouchableOpacity
            key={idx}
            className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
            onPress={() => navigation.navigate("MealDetails", { meal })}
          >
            <View>
              <Text className="text-white font-medium">{meal.name}</Text>
              <Text className="text-gray-400 text-xs mt-0.5">{meal.macros}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6B7280" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
