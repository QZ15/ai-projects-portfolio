// MealPlanner.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { generateSingleMeal, generateMealPlan } from "../services/mealService";
import { useMealFilters } from "../context/MealFilterContext";

export default function MealPlanner() {
  const navigation = useNavigation();
  const { filters } = useMealFilters();
  const [loading, setLoading] = useState<string | null>(null);
  const [planMeals, setPlanMeals] = useState<any[]>([]);

  const placeholderImage = { uri: "https://source.unsplash.com/600x400/?healthy,food" };

  const todayMeal = {
    name: "Chicken Avocado Salad",
    macros: "450 kcal • 32g P • 20g C • 29g F",
    image: placeholderImage,
    ingredients: [],
    instructions: [],
  };

  const staticMeals = [
    {
      name: "Oatmeal with Berries",
      macros: "320 kcal • 7g P • 55g C • 10g F",
      ingredients: [],
      instructions: [],
    },
    {
      name: "Grilled Salmon",
      macros: "600 kcal • 55g P • 8g C • 38g F",
      ingredients: [],
      instructions: [],
    },
    {
      name: "Veggie Omelette",
      macros: "350 kcal • 22g P • 8g C • 26g F",
      ingredients: [],
      instructions: [],
    },
  ];

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
      console.log("📤 Sending filters to Firebase:", filters); // ✅ Debug log
      const plan = await generateMealPlan(
        filters.calories,
        filters.protein,
        filters.carbs,
        filters.fat,
        filters.preferences,
        filters.dislikes,
        filters.mealsPerDay
      );
      if (!Array.isArray(plan) || plan.length === 0) {
        throw new Error("Empty meal plan");
      }
      setPlanMeals(plan);
    } catch (err) {
      console.error("❌ Error generating plan:", err);
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
    } catch (err) {
      console.error("❌ Error generating single meal:", err);
      Alert.alert("Error", "Could not generate meal.");
    } finally {
      setLoading(null);
    }
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
          {/* AI Meal Plan */}
          <TouchableOpacity
            className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
            onPress={handleAIPlan}
            disabled={!!loading}
          >
            <View className="flex-row items-center">
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

            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => navigation.navigate("MealPlanFilters")}>
                <Ionicons
                  name="settings-outline"
                  size={20}
                  color="#6B7280"
                  style={{ marginRight: 8 }}
                />
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
            <View className="flex-row items-center">
              <Ionicons name="add-outline" size={20} color="#fff" />
              <View className="ml-3">
                <Text className="text-white text-base font-semibold">
                  {loading === "single" ? "Generating..." : "Select Ingredients"}
                </Text>
                <Text className="text-gray-400 text-xs mt-0.5">
                  Generate a meal based on what you have
                </Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => navigation.navigate("SelectIngredients")}>
                <Ionicons
                  name="settings-outline"
                  size={20}
                  color="#6B7280"
                  style={{ marginRight: 8 }}
                />
              </TouchableOpacity>
              {loading === "single"
                ? <ActivityIndicator color="#fff" />
                : <Ionicons name="chevron-forward" size={18} color="#6B7280" />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Meal of the Day */}
        <Text className="text-white text-lg font-semibold mb-3">Meal of the Day</Text>
        <TouchableOpacity
          className="bg-neutral-900 rounded-2xl overflow-hidden mb-6"
          onPress={() => safeNavigate(todayMeal)}
        >
          <Image source={todayMeal.image} className="w-full h-40" resizeMode="cover" />
          <View className="p-4">
            <Text className="text-white text-lg font-semibold">{todayMeal.name}</Text>
            <Text className="text-gray-400 text-sm mt-1">{todayMeal.macros}</Text>
          </View>
        </TouchableOpacity>

        {/* AI Generated Meals */}
        {planMeals.length > 0 && (
          <>
            <Text className="text-white text-lg font-semibold mb-3">AI Meal Plan</Text>
            {planMeals.map((meal, idx) => (
              <TouchableOpacity
                key={idx}
                className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
                onPress={() => safeNavigate(meal)}
              >
                <View>
                  <Text className="text-white font-medium">{meal.name}</Text>
                  <Text className="text-gray-400 text-xs mt-0.5">
                    {meal.calories ?? 0} kcal • {meal.protein ?? 0}g P • {meal.carbs ?? 0}g C • {meal.fat ?? 0}g F
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#6B7280" />
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
