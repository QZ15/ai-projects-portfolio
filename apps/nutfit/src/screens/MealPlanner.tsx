// MealPlanner.tsx
import React, { useState } from "react";
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Alert, LayoutAnimation
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { generateSingleMeal, generateMealPlan } from "../services/mealService";
import { useMealFilters } from "../context/MealFilterContext";
import { useFavorites } from "../context/FavoritesContext";
import { useTodayMeals } from "../context/TodayMealsContext";

export default function MealPlanner() {
  const navigation = useNavigation();
  const { filters } = useMealFilters();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { todayMeals, addToToday, removeFromToday } = useTodayMeals();
  const [loading, setLoading] = useState<string | null>(null);
  const [planMeals, setPlanMeals] = useState<any[]>([]);

  const [showFavorites, setShowFavorites] = useState(true);
  const [showToday, setShowToday] = useState(true);
  const [showAIPlan, setShowAIPlan] = useState(true);

  const placeholderImage = { uri: "https://source.unsplash.com/600x400/?healthy,food" };

  const safeNavigate = (meal: any) => {
    const normalizedMeal = {
      name: meal.name || "Meal",
      mealType: meal.mealType || "",
      calories: meal.calories ?? parseInt(meal.macros?.match(/\d+/)?.[0] || "0"),
      protein: meal.protein ?? parseInt(meal.macros?.match(/(\d+)g P/)?.[1] || "0"),
      carbs: meal.carbs ?? parseInt(meal.macros?.match(/(\d+)g C/)?.[1] || "0"),
      fat: meal.fat ?? parseInt(meal.macros?.match(/(\d+)g F/)?.[1] || "0"),
      ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
      instructions: Array.isArray(meal.instructions)
        ? meal.instructions
        : typeof meal.instructions === "string"
        ? [meal.instructions]
        : [],
      image: meal.image || placeholderImage,
    };
    navigation.navigate("MealDetails", { meal: normalizedMeal });
  };

  const handleAIPlan = async () => {
    try {
      setLoading("plan");
      const plan = await generateMealPlan(
        filters.calories, filters.protein, filters.carbs,
        filters.fat, filters.preferences, filters.dislikes, filters.mealsPerDay
      );
      if (!Array.isArray(plan) || plan.length === 0) throw new Error("Empty meal plan");
      setPlanMeals(plan);
    } catch (err) {
      Alert.alert("Error", "Could not generate meal plan.");
    } finally {
      setLoading(null);
    }
  };

  const handleSingleMeal = async () => {
    try {
      setLoading("single");
      const meal = await generateSingleMeal(filters.selectedIngredients || [], filters.preferences);
      if (!meal || !meal.name) throw new Error("Empty single meal");
      safeNavigate(meal);
    } catch {
      Alert.alert("Error", "Could not generate meal.");
    } finally {
      setLoading(null);
    }
  };

  const renderMealRow = (meal: any) => {
    const inToday = todayMeals.some((m) => m.name === meal.name);
    return (
      <TouchableOpacity
        key={meal.name}
        className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
        onPress={() => safeNavigate(meal)}
      >
        <View style={{ flex: 1 }}>
          <Text className="text-white font-medium">{meal.name}</Text>
          <Text className="text-gray-400 text-xs mt-0.5">
            {meal.calories ?? 0} kcal • {meal.protein ?? 0}g P • {meal.carbs ?? 0}g C • {meal.fat ?? 0}g F
          </Text>
        </View>

        <TouchableOpacity onPress={() => toggleFavorite(meal)}>
          <Ionicons
            name={isFavorite(meal) ? "heart" : "heart-outline"}
            size={20}
            color={isFavorite(meal) ? "white" : "#FFFFFF"}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => (inToday ? removeFromToday(meal) : addToToday(meal))}
        >
          <Ionicons
            name={inToday ? "remove-circle-outline" : "add-circle-outline"}
            size={22}
            color={inToday ? "white" : "#FFFFFF"}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Meal Planner</Text>
        </View>

        {/* Action Buttons */}
        <View className="mb-6">
          {/* AI Meal Plan */}
          <TouchableOpacity
            className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
            onPress={handleAIPlan}
            disabled={!!loading}
          >
            {/* Left Section */}
            <View className="flex-row items-center flex-1">
              <Ionicons name="restaurant-outline" size={20} color="#fff" />
              <View className="ml-3">
                <Text className="text-white text-base font-semibold">
                  {loading === "plan" ? "Generating..." : "AI Meal Plan"}
                </Text>
                <Text className="text-gray-400 text-xs mt-0.5">
                  {filters.calories} kcal • {filters.protein}g P • {filters.carbs}g C • {filters.fat}g F
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View style={{ width: 1, height: "100%", backgroundColor: "#3F3F46", marginHorizontal: 20 }} />

            {/* Right Section (Settings + Chevron/Loader) */}
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => navigation.navigate("MealPlanFilters")}>
                <Ionicons name="settings-outline" size={20} color="#6B7280" style={{ marginRight: 8 }} />
              </TouchableOpacity>
              {loading === "plan"
                ? <ActivityIndicator color="#fff" />
                : <Ionicons name="chevron-forward" size={18} color="#6B7280" />}
            </View>
          </TouchableOpacity>

          {/* Select Ingredients */}
          <TouchableOpacity
            className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center"
            onPress={handleSingleMeal}
            disabled={!!loading}
          >
            {/* Left Section */}
            <View className="flex-row items-center flex-1">
              <Ionicons name="add-outline" size={20} color="#fff" />
              <View className="ml-3">
                <Text className="text-white text-base font-semibold">
                  {loading === "single" ? "Generating..." : "Select Ingredients"}
                </Text>
                <Text className="text-gray-400 text-xs mt-0.5">Generate a meal based on what you have</Text>
              </View>
            </View>

            {/* Divider */}
            <View style={{ width: 1, height: "100%", backgroundColor: "#3F3F46", marginHorizontal: 20 }} />

            {/* Right Section (Settings + Chevron/Loader) */}
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => navigation.navigate("SelectIngredients")}>
                <Ionicons name="settings-outline" size={20} color="#6B7280" style={{ marginRight: 8 }} />
              </TouchableOpacity>
              {loading === "single"
                ? <ActivityIndicator color="#fff" />
                : <Ionicons name="chevron-forward" size={18} color="#6B7280" />}
            </View>
          </TouchableOpacity>
        </View>

        {/* AI Meal Plan */}
        {planMeals.length > 0 && (
          <>
            <TouchableOpacity
              onPress={() => { LayoutAnimation.easeInEaseOut(); setShowAIPlan(!showAIPlan); }}
              className="flex-row justify-between items-center"
            >
              <Text className="text-white text-lg font-semibold mt-6 mb-3">AI Meal Plan</Text>
              <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
            </TouchableOpacity>
            {showAIPlan && planMeals.map(renderMealRow)}
          </>
        )}

        {/* Today Meals */}
        <TouchableOpacity
          onPress={() => { LayoutAnimation.easeInEaseOut(); setShowToday(!showToday); }}
          className="flex-row justify-between items-center"
        >
          <Text className="text-white text-lg font-semibold mt-6 mb-3">
            Today’s Meals ({todayMeals.length})
          </Text>
          <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
        {showToday && todayMeals.map(renderMealRow)}

        {/* Favorites */}
        <TouchableOpacity
          onPress={() => { LayoutAnimation.easeInEaseOut(); setShowFavorites(!showFavorites); }}
          className="flex-row justify-between items-center"
        >
          <Text className="text-white text-lg font-semibold mt-6 mb-3">
            Favorites ({favorites.length})
          </Text>
          <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
        {showFavorites && (
          <View style={{ maxHeight: 300 }}>
            <ScrollView>{favorites.map(renderMealRow)}</ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
