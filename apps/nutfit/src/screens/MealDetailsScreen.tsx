import React from "react";
import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFavorites } from "../context/FavoritesContext";
import { useTodayMeals } from "../context/TodayMealsContext";

export default function MealDetailsScreen() {
  const route = useRoute();
  const { meal } = route.params as any;
  const { toggleFavorite, isFavorite } = useFavorites();
  const { todayMeals, addToToday, removeFromToday } = useTodayMeals();

  const placeholderImage = { uri: "https://source.unsplash.com/600x400/?healthy,food" };
  const inToday = todayMeals.some((m) => m.name === meal.name);

  const fallbackImages = {
    Breakfast: "https://images.unsplash.com/photo-1532980400857-e8d9d275d858?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Lunch: "https://images.unsplash.com/photo-1593114630390-e35acaa7d7d6?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Dinner: "https://images.unsplash.com/photo-1659480150417-25f9f0d5ca2e?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Snack: "https://images.unsplash.com/photo-1648471981428-ede812604400?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Default: "https://images.unsplash.com/photo-1626300006988-42a927fd80ee?q=80&w=771&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  const mealImage =
    meal.image ||
    fallbackImages[meal.mealType] ||
    fallbackImages.Default;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        <Image
          source={{ uri: mealImage }}
          className="w-full h-48 rounded-2xl mb-4"
          resizeMode="cover"
        />
        <View className="bg-neutral-900 p-4 rounded-2xl mb-6">
          {meal.mealType && <Text className="text-blue-400 text-xs mb-1">{meal.mealType}</Text>}
          <Text className="text-white text-[24px] font-bold mb-1">{meal.name}</Text>
          <Text className="text-gray-400 text-sm">
            {meal.calories} kcal • {meal.protein}g P • {meal.carbs}g C • {meal.fat}g F
          </Text>
        </View>

        {/* Buttons */}
        <View className="flex-row justify-around mb-6">
          <TouchableOpacity onPress={() => toggleFavorite(meal)}>
            <Ionicons name={isFavorite(meal) ? "heart" : "heart-outline"} size={28} color={isFavorite(meal) ? "white" : "white"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => inToday ? removeFromToday(meal) : addToToday(meal)}>
            <Ionicons name={inToday ? "remove-circle-outline" : "add-circle-outline"} size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Ingredients */}
        <Text className="text-white text-lg font-semibold mb-2">Ingredients</Text>
        <View className="bg-neutral-900 p-4 rounded-2xl mb-6">
          {meal.ingredients && meal.ingredients.length > 0
            ? meal.ingredients.map((ing: any, idx: number) => (
                <Text key={idx} className="text-gray-300 text-sm mb-1">
                  • {ing.quantity ? `${ing.quantity} ` : ""}{ing.item || ing}
                </Text>
              ))
            : <Text className="text-gray-500 text-sm">No ingredients listed</Text>}
        </View>

        {/* Instructions */}
        <Text className="text-white text-lg font-semibold mb-2">Instructions</Text>
        <View className="bg-neutral-900 p-4 rounded-2xl">
          {meal.instructions && meal.instructions.length > 0
            ? meal.instructions.map((step: string, idx: number) => (
                <Text key={idx} className="text-gray-300 text-sm mb-2">{idx + 1}. {step}</Text>
              ))
            : <Text className="text-gray-500 text-sm">No instructions provided</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
