// src/screens/RequestMealScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useMealFilters } from "../context/MealFilterContext";

export default function RequestMealScreen() {
  const navigation = useNavigation();
  const { filters, setFilters } = useMealFilters();
  const [requestedDish, setRequestedDish] = useState(filters.requestedDish || "");

  const handleSave = () => {
    setFilters({ ...filters, requestedDish });
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row justify-between items-center px-5 mt-3 mb-6">
        <Text className="text-white text-[28px] font-bold">Request Meal</Text>
        <TouchableOpacity onPress={handleSave}>
          <Ionicons name="checkmark-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View className="px-5">
        <Text className="text-gray-300 mb-2 text-base">Dish Name</Text>
        <View className="bg-neutral-900 p-4 rounded-2xl">
          <TextInput
            className="text-white text-base"
            placeholder="e.g. Hakka Chili Chicken"
            placeholderTextColor="#6B7280"
            value={requestedDish}
            onChangeText={setRequestedDish}
            autoCapitalize="words"
          />
        </View>

        <Text className="text-gray-500 text-xs mt-3">
          Enter the exact dish or meal you want AI to generate.
        </Text>
      </View>
    </SafeAreaView>
  );
}
