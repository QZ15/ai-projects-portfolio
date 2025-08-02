import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import WorkoutFiltersForm from "../components/workout/FiltersForm";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, TouchableOpacity } from "react-native";

const Header = ({ title, navigation }: any) => (
  <View className="flex-row justify-between items-center mt-3 px-5">
    <Text className="text-white text-[28px] font-bold">{title}</Text>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="close-outline" size={28} color="#fff" />
    </TouchableOpacity>
  </View>
);

export default function SingleWorkoutFiltersScreen({ navigation }: any) {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView>
        <Header title="Workout Filters" navigation={navigation} />
        <WorkoutFiltersForm showDaysPerWeek={false} showRequestedWorkout />
      </ScrollView>
    </SafeAreaView>
  );
}
