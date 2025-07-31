// src/screens/MealPlanFiltersScreen.tsx
import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FiltersForm from "../components/meal/FiltersForm";

const Header = ({ title, navigation }) => (
  <View className="flex-row justify-between items-center mt-3 px-5">
    <Text className="text-white text-[28px] font-bold">{title}</Text>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="close-outline" size={28} color="#fff" />
    </TouchableOpacity>
  </View>
);

export default function MealPlanFiltersScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView>
        <Header title="Meal Plan Filters" navigation={navigation} />
        <FiltersForm showMealsPerDay />
      </ScrollView>
    </SafeAreaView>
  );
}
