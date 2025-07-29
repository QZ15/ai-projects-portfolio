import React from "react";
import { View, Text, ScrollView, SafeAreaView, Image } from "react-native";
import { useRoute } from "@react-navigation/native";

export default function MealDetailsScreen() {
  const route = useRoute();
  const { meal } = route.params as any;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        <Image
          source={meal.image || { uri: "https://source.unsplash.com/600x400/?healthy,food" }}
          className="w-full h-48 rounded-2xl mb-4"
          resizeMode="cover"
        />
        <Text className="text-white text-[24px] font-bold mb-2">{meal.name}</Text>
        <Text className="text-gray-400 text-sm mb-4">{meal.macros}</Text>

        <Text className="text-white text-lg font-semibold mb-2">Ingredients</Text>
        {meal.ingredients && meal.ingredients.length > 0 ? (
          meal.ingredients.map((ing: string, idx: number) => (
            <Text key={idx} className="text-gray-300 text-sm">• {ing}</Text>
          ))
        ) : (
          <Text className="text-gray-500 text-sm">No ingredients listed</Text>
        )}

        <Text className="text-white text-lg font-semibold mt-4 mb-2">Instructions</Text>
        <Text className="text-gray-300 text-sm">{meal.instructions || "No instructions provided"}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
