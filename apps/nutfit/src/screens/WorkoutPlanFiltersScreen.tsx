import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import WorkoutFiltersForm from "../components/workout/FiltersForm";

const Header = ({ title, navigation }) => (
  <View className="flex-row justify-between items-center mt-3 px-5">
    <Text className="text-white text-[28px] font-bold">{title}</Text>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="close-outline" size={28} color="#fff" />
    </TouchableOpacity>
  </View>
);

export default function WorkoutPlanFiltersScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <Header title="Workout Filters" navigation={navigation} />
      <WorkoutFiltersForm />
    </SafeAreaView>
  );
}
