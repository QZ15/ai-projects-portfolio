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
import { useMealOfTheDay } from "../context/MealOfTheDayContext";
import { generateRequestedMeal } from "../services/mealService";
import { useRecentMeals } from "../context/RecentMealsContext";

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
  const { mealOfTheDay } = useMealOfTheDay();
  const [showAITools, setShowAITools] = useState(true);
  const [showMealOfTheDay, setShowMealOfTheDay] = useState(true);
  const { recentMeals } = useRecentMeals();
  const [showRecentMeals, setShowRecentMeals] = useState(true);
  const { addRecentMeal } = useRecentMeals();

  const fallbackImages = {
    Breakfast: "https://images.unsplash.com/photo-1532980400857-e8d9d275d858?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Lunch: "https://images.unsplash.com/photo-1593114630390-e35acaa7d7d6?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Dinner: "https://images.unsplash.com/photo-1659480150417-25f9f0d5ca2e?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Snack: "https://images.unsplash.com/photo-1648471981428-ede812604400?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Default: "https://images.unsplash.com/photo-1626300006988-42a927fd80ee?q=80&w=771&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  const withFallbackImage = (meal: any) => ({
    ...meal,
    image: meal.image || fallbackImages[meal.mealType] || fallbackImages.Default,
  });

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
      image: meal.image || fallbackImages[meal.mealType],
    };
    navigation.navigate("MealDetails", { meal: normalizedMeal });
  };

  const handleAIPlan = async () => {
    try {
      setLoading("plan");
      filters.ingredientsEnabled = false;
      filters.requestedDishEnabled = false;
      filters.macrosEnabled = true;
      if (filters.calories < 1000) filters.calories = 2000;
      if (filters.protein < 50) filters.protein = 150;
      if (filters.carbs < 50) filters.carbs = 200;
      if (filters.fat < 20) filters.fat = 70;
      const plan = await generateMealPlan(filters, recentMeals.map(m => m.name));
      if (!Array.isArray(plan) || plan.length === 0) throw new Error("Empty meal plan");
      setPlanMeals(plan.map(withFallbackImage));
    } catch (err) {
      Alert.alert("Error", "Could not generate meal plan.");
    } finally {
      setLoading(null);
    }
  };

  const handleSingleMeal = async () => {
    try {
      setLoading("single");
      filters.ingredientsEnabled = true;
      filters.requestedDishEnabled = false;
      const meal = await generateSingleMeal(filters, recentMeals.map(m => m.name));
      addRecentMeal(meal);
      if (!meal || !meal.name) throw new Error("Empty single meal");
      safeNavigate(withFallbackImage(meal));
    } catch {
      Alert.alert("Error", "Could not generate meal.");
    } finally {
      setLoading(null);
    }
  };

  const handleRequestedMeal = async () => {
    if (!filters.requestedDish || filters.requestedDish.trim() === "") {
      Alert.alert(
        "No Meal Entered",
        "Please enter a dish name in Request Meal settings before generating."
      );
      return;
    }
    try {
      setLoading("requested");
      filters.ingredientsEnabled = false;
      filters.requestedDishEnabled = true;
      const meal = await generateRequestedMeal(filters, recentMeals.map(m => m.name));
      addRecentMeal(meal);
      if (!meal || !meal.name) throw new Error("Empty requested meal");
      safeNavigate(withFallbackImage(meal));
    } catch {
      Alert.alert("Error", "Could not generate requested meal.");
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
          <TouchableOpacity onPress={() => {
            LayoutAnimation.easeInEaseOut();
            setShowAITools(!showAITools);
          }}>
            <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {showAITools && (
          <View className="mb-6">
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
                className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
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
              
              {/* Request a Meal */}
              <TouchableOpacity
                className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center"
                onPress={handleRequestedMeal}
                disabled={!!loading}
              >
                {/* Left Section */}
                <View className="flex-row items-center flex-1">
                  <Ionicons name="search-outline" size={20} color="#fff" />
                  <View className="ml-3">
                    <Text className="text-white text-base font-semibold">
                      {loading === "requested" ? "Generating..." : "Request Meal"}
                    </Text>
                    <Text className="text-gray-400 text-xs mt-0.5">
                      {filters.requestedDish || "Enter a dish in settings"}
                    </Text>
                  </View>
                </View>

                {/* Divider */}
                <View style={{ width: 1, height: "100%", backgroundColor: "#3F3F46", marginHorizontal: 20 }} />

                {/* Right Section */}
                <View className="flex-row items-center">
                  <TouchableOpacity onPress={() => navigation.navigate("RequestMeal")}>
                    <Ionicons name="settings-outline" size={20} color="#6B7280" style={{ marginRight: 8 }} />
                  </TouchableOpacity>
                  {loading === "requested"
                    ? <ActivityIndicator color="#fff" />
                    : <Ionicons name="chevron-forward" size={18} color="#6B7280" />}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Meal of the Day */}
        <TouchableOpacity
          onPress={() => { LayoutAnimation.easeInEaseOut(); setShowMealOfTheDay(!showMealOfTheDay); }}
          className="flex-row justify-between items-center"
        >
          <Text className="text-white text-lg font-semibold mb-3">Meal of the Day</Text>
          <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>

        {showMealOfTheDay && mealOfTheDay && (
          <TouchableOpacity
            className="bg-neutral-900 rounded-2xl overflow-hidden mb-3"
            onPress={() => safeNavigate(withFallbackImage(mealOfTheDay))}
          >
            <Image
              source={{ uri: withFallbackImage(mealOfTheDay).image }}
              className="w-full h-40"
              resizeMode="cover"
            />
            <View className="p-4">
              <Text className="text-white text-lg font-semibold">
                {mealOfTheDay.name}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">
                {mealOfTheDay.calories} kcal • {mealOfTheDay.protein}g P •{" "}
                {mealOfTheDay.carbs}g C • {mealOfTheDay.fat}g F
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/*  Recent Meals */}
        <TouchableOpacity
          onPress={() => { LayoutAnimation.easeInEaseOut(); setShowRecentMeals(!showRecentMeals); }}
          className="flex-row justify-between items-center"
        >
          <Text className="text-white text-lg font-semibold mt-6 mb-3">
            Recently Generated ({recentMeals.length})
          </Text>
          <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>

        {showRecentMeals && (
          <View style={{ maxHeight: recentMeals.length > 4 ? 300 : undefined }}>
            <ScrollView>{recentMeals.map(renderMealRow)}</ScrollView>
          </View>
        )}

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
