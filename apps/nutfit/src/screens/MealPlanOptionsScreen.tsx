import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { useMealContext } from "../context/MealContext";
import { useNavigation } from "@react-navigation/native";

export default function MealPlanOptionsScreen() {
  const { generatePlan } = useMealContext();
  const navigation = useNavigation();
  const [selectedGoal, setSelectedGoal] = useState("balanced");

  const handleGenerate = async () => {
    await generatePlan(selectedGoal);
    navigation.goBack(); // Goes back to MealPlanner
  };

  return (
    <SafeAreaView className="flex-1 bg-black px-5">
      <Text className="text-white text-[28px] font-bold mt-4 mb-6">Meal Plan Options</Text>

      {/* Goal Selection */}
      {["balanced", "bulk", "cut", "low-carb", "vegetarian"].map((goal) => (
        <TouchableOpacity
          key={goal}
          className={`p-4 rounded-2xl mb-3 ${selectedGoal === goal ? "bg-blue-600" : "bg-neutral-900"}`}
          onPress={() => setSelectedGoal(goal)}
        >
          <Text className="text-white font-semibold capitalize">{goal}</Text>
        </TouchableOpacity>
      ))}

      {/* Generate Button */}
      <TouchableOpacity
        className="bg-green-600 p-4 rounded-2xl flex-row justify-center items-center mt-6"
        onPress={handleGenerate}
      >
        <Text className="text-white font-semibold">Generate Plan</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
