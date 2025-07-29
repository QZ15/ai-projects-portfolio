import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const AVAILABLE_INGREDIENTS = [
  "Chicken", "Beef", "Salmon", "Eggs", "Avocado", "Rice", "Quinoa", "Broccoli", "Spinach", "Sweet Potato"
];

export default function SelectIngredientsScreen() {
  const navigation = useNavigation();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleIngredient = (ingredient: string) => {
    setSelected((prev) =>
      prev.includes(ingredient) ? prev.filter((i) => i !== ingredient) : [...prev, ingredient]
    );
  };

  const handleGenerateMeal = () => {
    navigation.navigate("MealDetails", {
      ingredients: selected
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Select Ingredients</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Ingredient List */}
        {AVAILABLE_INGREDIENTS.map((ingredient) => (
          <TouchableOpacity
            key={ingredient}
            onPress={() => toggleIngredient(ingredient)}
            className={`p-4 rounded-2xl mb-3 flex-row justify-between items-center ${
              selected.includes(ingredient) ? "bg-blue-900" : "bg-neutral-900"
            }`}
          >
            <Text className="text-white">{ingredient}</Text>
            {selected.includes(ingredient) && <Ionicons name="checkmark" size={18} color="#fff" />}
          </TouchableOpacity>
        ))}

        {/* Generate Meal Button */}
        <TouchableOpacity
          onPress={handleGenerateMeal}
          className="p-4 bg-blue-600 rounded-2xl flex-row justify-center items-center mt-6"
        >
          <Ionicons name="sparkles-outline" size={20} color="#fff" />
          <Text className="text-white ml-2 font-semibold">Generate Meal</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
