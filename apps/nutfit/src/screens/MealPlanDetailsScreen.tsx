import React from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function MealPlanDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { plan } = route.params || { plan: [] };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Meal Plan</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {Array.isArray(plan) && plan.length > 0 ? (
          plan.map((meal, idx) => (
            <View
              key={idx}
              className="bg-neutral-900 p-4 rounded-2xl mb-3"
            >
              <Text className="text-white font-semibold text-lg">{meal.name || `Meal ${idx + 1}`}</Text>
              <Text className="text-gray-400 text-sm mt-1">
                {meal.calories} kcal • {meal.protein}g P • {meal.carbs}g C • {meal.fat}g F
              </Text>
              <Text className="text-gray-400 text-xs mt-2">{meal.instructions}</Text>
            </View>
          ))
        ) : (
          <Text className="text-gray-400">No meals generated.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
