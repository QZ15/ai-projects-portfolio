// src/screens/MealPlanFiltersScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useMealFilters } from "../context/MealFilterContext";

export default function MealPlanFiltersScreen() {
  const { filters, setFilters } = useMealFilters();
  const navigation = useNavigation();

  const [localFilters, setLocalFilters] = useState(filters);

  const handleSave = () => {
    console.log("💾 Saving filters:", localFilters); // DEBUG
    setFilters(localFilters);
    navigation.goBack();
  };


  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="px-5">
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Meal Plan Filters</Text>
          <TouchableOpacity onPress={handleSave}>
            <Ionicons name="checkmark-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {[
          { key: "calories", label: "Calories" },
          { key: "protein", label: "Protein (g)" },
          { key: "carbs", label: "Carbs (g)" },
          { key: "fat", label: "Fat (g)" },
          { key: "mealsPerDay", label: "Meals per Day" },
        ].map(({ key, label }) => (
          <View key={key} className="mb-4">
            <Text className="text-gray-300 mb-1">{label}</Text>
            <TextInput
              className="bg-neutral-900 text-white p-3 rounded-xl"
              keyboardType="numeric"
              value={String(localFilters[key as keyof typeof localFilters])}
              onChangeText={(text) =>
                setLocalFilters({ ...localFilters, [key]: Number(text) })
              }
            />
          </View>
        ))}

        <View className="mb-4">
          <Text className="text-gray-300 mb-1">Preferences</Text>
          <TextInput
            className="bg-neutral-900 text-white p-3 rounded-xl"
            value={localFilters.preferences}
            onChangeText={(text) =>
              setLocalFilters({ ...localFilters, preferences: text })
            }
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-300 mb-1">Dislikes</Text>
          <TextInput
            className="bg-neutral-900 text-white p-3 rounded-xl"
            value={localFilters.dislikes}
            onChangeText={(text) =>
              setLocalFilters({ ...localFilters, dislikes: text })
            }
          />
        </View>

        <TouchableOpacity
          className="bg-blue-500 py-3 rounded-xl mt-6"
          onPress={handleSave}
        >
          <Text className="text-white text-center font-semibold">Save Filters</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
