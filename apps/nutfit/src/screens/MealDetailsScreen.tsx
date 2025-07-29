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
import { useRoute, useNavigation } from "@react-navigation/native";

export default function MealDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { meal } = route.params || {};

  // Validate props to avoid crashes
  const mealName = typeof meal?.name === "string" ? meal.name : "Meal";
  const mealMacros =
    typeof meal?.macros === "string" ? meal.macros : "Nutrition info not available.";

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Ionicons name="arrow-back-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-[20px] font-bold">Meal Details</Text>
          <View className="w-8" />
        </View>

        {/* Meal Image */}
        {meal?.image ? (
          <Image
            source={meal.image}
            className="w-full h-48 rounded-2xl mb-6"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-48 rounded-2xl mb-6 bg-neutral-800 justify-center items-center">
            <Text className="text-gray-500">No image available</Text>
          </View>
        )}

        {/* Meal Info */}
        <View className="bg-neutral-900 p-4 rounded-2xl mb-6">
          <Text className="text-white text-lg font-semibold">{mealName}</Text>
          <Text className="text-gray-400 text-sm mt-1">{mealMacros}</Text>
        </View>

        {/* Actions */}
        <TouchableOpacity className="bg-blue-500 p-4 rounded-2xl items-center">
          <Text className="text-white font-semibold">Add to Meal Plan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
