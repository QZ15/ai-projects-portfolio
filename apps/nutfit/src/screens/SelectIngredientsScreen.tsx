// src/screens/SelectIngredientsScreen.tsx
import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FiltersForm from "../components/meal/FiltersForm";

// Common header styling for all filter screens
const Header = ({ title, navigation }) => (
  <View className="flex-row justify-between items-center mt-3 px-5">
    <Text className="text-white text-[28px] font-bold">{title}</Text>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="close-outline" size={28} color="#fff" />
    </TouchableOpacity>
  </View>
);


export default function SelectIngredientsScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView>
        <Header title="Ingredient Filters" navigation={navigation} />
        <FiltersForm showIngredients />
      </ScrollView>
    </SafeAreaView>
  );
}
