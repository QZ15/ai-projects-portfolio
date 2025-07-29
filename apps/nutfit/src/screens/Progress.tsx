import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Progress() {
  const progressItems = [
    { title: "Weight", value: "72 kg", change: "-1.2 kg", detail: "Since last week" },
    { title: "Body Fat", value: "14%", change: "-0.5%", detail: "Since last week" },
    { title: "Workouts Completed", value: "5", change: "+2", detail: "This week" },
    { title: "Calories Burned", value: "3200 kcal", change: "+500", detail: "This week" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Progress</Text>
          <TouchableOpacity className="p-2 bg-neutral-900 rounded-xl">
            <Ionicons name="stats-chart-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <Text className="text-white text-lg font-semibold mb-3">Summary</Text>
        {progressItems.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
          >
            <View>
              <Text className="text-white font-medium">{item.title}</Text>
              <Text className="text-gray-400 text-xs mt-0.5">{item.detail}</Text>
            </View>
            <View className="items-end">
              <Text className="text-white font-semibold">{item.value}</Text>
              <Text
                className={`text-xs mt-0.5 ${
                  item.change.startsWith("-") ? "text-green-400" : "text-blue-400"
                }`}
              >
                {item.change}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Quick Actions */}
        <Text className="text-white text-lg font-semibold mt-6 mb-3">Quick Actions</Text>
        <TouchableOpacity className="bg-neutral-900 p-4 rounded-2xl flex-row items-center mb-3">
          <Ionicons name="barbell-outline" size={20} color="#fff" />
          <Text className="text-white ml-3 font-semibold">Log Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-neutral-900 p-4 rounded-2xl flex-row items-center">
          <Ionicons name="restaurant-outline" size={20} color="#fff" />
          <Text className="text-white ml-3 font-semibold">Log Meal</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
