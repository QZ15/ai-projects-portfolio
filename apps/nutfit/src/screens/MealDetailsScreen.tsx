import React from "react";
import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFavorites } from "../context/FavoritesContext";
import { useTodayMeals } from "../context/TodayMealsContext";

export default function MealDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { meal } = route.params as any;
  const { toggleFavorite, isFavorite } = useFavorites();
  const { todayMeals, addToToday, removeFromToday, toggleCompleted, isCompleted } = useTodayMeals();

  const fallbackImages = {
    Breakfast: "https://images.unsplash.com/photo-1532980400857-e8d9d275d858?q=80&w=687&auto=format&fit=crop",
    Lunch:     "https://images.unsplash.com/photo-1593114630390-e35acaa7d7d6?q=80&w=764&auto=format&fit=crop",
    Dinner:    "https://images.unsplash.com/photo-1659480150417-25f9f0d5ca2e?q=80&w=765&auto=format&fit=crop",
    Snack:     "https://images.unsplash.com/photo-1648471981428-ede812604400?q=80&w=687&auto=format&fit=crop",
    Default:   "https://images.unsplash.com/photo-1626300006988-42a927fd80ee?q=80&w=771&auto=format&fit=crop",
  };

  const mealImage = meal.image || fallbackImages[meal.mealType] || fallbackImages.Default;
  const inToday = todayMeals.some((m) => m.name === meal.name);
  const completed = isCompleted(meal.name);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Image */}
        <Image source={{ uri: mealImage }} className="w-full h-48 rounded-2xl mb-4" resizeMode="cover" />

        {/* Name + Macros + Buttons Row */}
        <View className="flex-row mb-6">
          {/* Name + Macros Card */}
          <View className="bg-neutral-900 p-4 rounded-2xl flex-1 mr-3">
            {(meal.mealType || "Meal") && (
              <Text className="text-blue-400 text-xs mb-1">{meal.mealType || "Meal"}</Text>
            )}
            <Text className="text-white text-[24px] font-bold mb-1">{meal.name}</Text>
            <Text className="text-gray-400 text-sm">
              {meal.calories} kcal • {meal.protein}g P • {meal.carbs}g C • {meal.fat}g F
            </Text>
            {inToday && (
              <Text className="text-gray-400 text-xs mt-2">
                Status: {completed ? "Completed" : "Pending"}
              </Text>
            )}
          </View>

          {/* Vertical Button Stack */}
          <View className="justify-between bg-neutral-900 rounded-2xl p-2">
            <TouchableOpacity onPress={() => toggleFavorite(meal)}>
              <Ionicons
                name={isFavorite(meal) ? "heart" : "heart-outline"}
                size={28}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => (inToday ? removeFromToday(meal) : addToToday(meal))}>
              <Ionicons
                name={inToday ? "remove-circle-outline" : "add-circle-outline"}
                size={28}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Ingredients */}
        <Text className="text-white text-lg font-semibold mb-2">Ingredients</Text>
        <View className="bg-neutral-900 p-4 rounded-2xl mb-6">
          {meal.ingredients?.length ? (
            meal.ingredients.map((ing: any, idx: number) => (
              <Text key={idx} className="text-gray-300 text-sm mb-1">
                • {ing.quantity ? `${ing.quantity} ` : ""}{ing.item || ing}
              </Text>
            ))
          ) : (
            <Text className="text-gray-500 text-sm">No ingredients listed</Text>
          )}
        </View>

        {/* Instructions */}
        <Text className="text-white text-lg font-semibold mb-2">Instructions</Text>
        <View className="bg-neutral-900 p-4 rounded-2xl mb-6">
          {meal.instructions?.length ? (
            meal.instructions.map((step: string, idx: number) => (
              <Text key={idx} className="text-gray-300 text-sm mb-2">{idx + 1}. {step}</Text>
            ))
          ) : (
            <Text className="text-gray-500 text-sm">No instructions provided</Text>
          )}
        </View>

        {/* Complete Toggle (only if in today's list) */}
        {inToday && (
          <TouchableOpacity
            className={`p-4 rounded-2xl items-center ${completed ? "bg-neutral-700" : "bg-blue-500"}`}
            onPress={() => {
              toggleCompleted(meal.name);
              navigation.goBack();
            }}
          >
            <Text className="text-white font-semibold">
              {completed ? "Mark Incomplete" : "Mark Completed"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
