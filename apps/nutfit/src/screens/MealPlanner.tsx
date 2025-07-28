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

export default function MealPlanner() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">
            Meal Planner
          </Text>
          <TouchableOpacity>
            <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View className="mb-6">
          <TouchableOpacity className="bg-neutral-900 px-4 py-4 rounded-2xl flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Ionicons name="camera-outline" size={20} color="#fff" />
              <View className="ml-3">
                <Text className="text-white text-base font-semibold">
                  AI Meal Plan
                </Text>
                <Text className="text-gray-400 text-xs mt-0.5">
                  Generate a meal plan with AI
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-neutral-900 px-4 py-4 rounded-2xl flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ionicons name="add-outline" size={20} color="#fff" />
              <View className="ml-3">
                <Text className="text-white text-base font-semibold">
                  Select Ingredients
                </Text>
                <Text className="text-gray-400 text-xs mt-0.5">
                  Generate a meal based on what you have
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Meal of the Day */}
        <Text className="text-white text-lg font-semibold mb-3">
          Meal of the Day
        </Text>
        <View className="bg-neutral-900 rounded-2xl overflow-hidden mb-6">
          <View className="w-full aspect-[4/3]">
            <Image
              source={require("../../assets/mock/mealofday.png")}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View className="p-4">
            <Text className="text-white text-lg font-semibold">
              Chicken Avocado Salad
            </Text>
            <Text className="text-gray-400 text-sm mt-1">
              450 kcal • 32g P • 20g C • 29g F
            </Text>
          </View>
        </View>

        {/* Your Meals */}
        <Text className="text-white text-lg font-semibold mb-3">
          Your Meals
        </Text>

        {/* Days Selector */}
        <View className="flex-row justify-between mb-4">
          {["Mon", "Today", "Wed", "Thu", "Fri", "Thu"].map((day, idx) => (
            <TouchableOpacity key={idx}>
              <Text
                className={`text-sm font-medium ${
                  day === "Today" ? "text-blue-400" : "text-gray-400"
                }`}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Meals List */}
        {[
          { name: "Oatmeal with Berries", macros: "320 kcal • 7g P • 55g C • 10g F" },
          { name: "Grilled Salmon", macros: "600 kcal • 55g P • 8g C • 38g F" },
          { name: "Veggie Omelette", macros: "350 kcal • 22g P • 8g C • 26g F" },
        ].map((meal, idx) => (
          <View
            key={idx}
            className="bg-neutral-900 px-4 py-4 rounded-2xl flex-row justify-between items-center mb-3"
          >
            <View>
              <Text className="text-white font-medium">{meal.name}</Text>
              <Text className="text-gray-400 text-xs mt-0.5">{meal.macros}</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="bookmark-outline" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
