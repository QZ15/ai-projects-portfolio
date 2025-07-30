// src/screens/SelectIngredientsScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useMealFilters } from "../context/MealFilterContext"; // we'll store ingredients here too

export default function SelectIngredientsScreen() {
  const { filters, setFilters } = useMealFilters();
  const navigation = useNavigation();

  const [ingredients, setIngredients] = useState(filters.selectedIngredients || []);

  const addIngredient = (ingredient: string) => {
    if (ingredient && !ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleSave = () => {
    setFilters({ ...filters, selectedIngredients: ingredients });
    navigation.goBack();
  };

  const [input, setInput] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="px-5">
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Select Ingredients</Text>
          <TouchableOpacity onPress={handleSave}>
            <Ionicons name="checkmark-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Manual Input */}
        <View className="mb-4">
          <Text className="text-gray-300 mb-1">Add Ingredient</Text>
          <View className="flex-row">
            <TextInput
              className="bg-neutral-900 text-white p-3 rounded-xl flex-1"
              placeholder="e.g. Chicken"
              placeholderTextColor="#6B7280"
              value={input}
              onChangeText={setInput}
            />
            <TouchableOpacity
              onPress={() => { addIngredient(input); setInput(""); }}
              className="bg-blue-500 px-4 justify-center rounded-xl ml-2"
            >
              <Ionicons name="add-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Ingredient List */}
        <Text className="text-white text-lg font-semibold mb-2">Selected Ingredients</Text>
        {ingredients.length > 0 ? (
          ingredients.map((ing, idx) => (
            <View
              key={idx}
              className="bg-neutral-900 p-3 rounded-xl flex-row justify-between items-center mb-2"
            >
              <Text className="text-white">{ing}</Text>
              <TouchableOpacity onPress={() => removeIngredient(ing)}>
                <Ionicons name="trash-outline" size={18} color="red" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text className="text-gray-400 text-sm mb-2">No ingredients selected</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
