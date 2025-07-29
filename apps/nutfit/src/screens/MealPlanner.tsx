import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function MealPlanner() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Meal Planner</Text>
          <TouchableOpacity className="p-2 bg-neutral-900 rounded-xl">
            <Ionicons name="filter-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <TouchableOpacity className="bg-neutral-900 p-4 rounded-2xl mb-3 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="camera-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
            <View>
              <Text className="text-white font-semibold">AI Meal Plan</Text>
              <Text className="text-gray-400 text-xs">Generate a meal plan with AI</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity className="bg-neutral-900 p-4 rounded-2xl mb-6 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="add-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
            <View>
              <Text className="text-white font-semibold">Select Ingredients</Text>
              <Text className="text-gray-400 text-xs">Generate a meal based on what you have</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>

        {/* Meal of the Day */}
        <Text className="text-gray-300 text-sm font-semibold mb-3">Meal of the Day</Text>
        <View className="bg-neutral-900 rounded-2xl overflow-hidden mb-6">
          <Image source={require("../../assets/mock/mealofday.png")} className="w-full h-40" resizeMode="cover" />
          <View className="p-4">
            <Text className="text-white font-semibold">Chicken Avocado Salad</Text>
            <Text className="text-gray-400 text-xs mt-1">450 kcal • 32g P • 20g C • 29g F</Text>
          </View>
        </View>

        {/* Your Meals */}
        <Text className="text-gray-300 text-sm font-semibold mb-3">Your Meals</Text>
        <View className="flex-row justify-between mb-4">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
            <TouchableOpacity key={idx}>
              <Text className={`text-sm font-medium ${day === "Thu" ? "text-blue-400" : "text-gray-400"}`}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {[ 
          { name: "Oatmeal with Berries", macros: "320 kcal • 7g P • 55g C • 10g F" },
          { name: "Grilled Salmon", macros: "600 kcal • 55g P • 8g C • 38g F" },
          { name: "Veggie Omelette", macros: "350 kcal • 22g P • 8g C • 26g F" },
        ].map((meal, idx) => (
          <View key={idx} className="bg-neutral-900 p-4 rounded-2xl mb-3 flex-row justify-between items-center">
            <View>
              <Text className="text-white font-semibold">{meal.name}</Text>
              <Text className="text-gray-400 text-xs">{meal.macros}</Text>
            </View>
            <Ionicons name="bookmark-outline" size={18} color="#6B7280" />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
