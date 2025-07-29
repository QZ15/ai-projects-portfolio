import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WorkoutPlannerScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Workout Planner</Text>
          <TouchableOpacity className="p-2 bg-neutral-900 rounded-xl">
            <Ionicons name="menu-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* AI Workout Plan */}
        <TouchableOpacity className="bg-neutral-900 p-4 rounded-2xl mb-3 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="apps-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
            <View>
              <Text className="text-white font-semibold">AI Workout Plan</Text>
              <Text className="text-gray-400 text-xs">Generate a workout plan with AI</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>

        {/* Switch Routine */}
        <TouchableOpacity className="bg-neutral-900 p-4 rounded-2xl mb-6 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="add-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
            <View>
              <Text className="text-white font-semibold">Switch Routine</Text>
              <Text className="text-gray-400 text-xs">Choose a different workout split</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>

        {/* Today’s Workout */}
        <Text className="text-gray-300 text-sm font-semibold mb-3">Today’s Workout</Text>
        <View className="bg-neutral-900 rounded-2xl overflow-hidden mb-6">
          <Image source={{ uri: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1" }} className="w-full h-40" resizeMode="cover" />
          <View className="p-4">
            <Text className="text-white font-semibold">Pull Day</Text>
            <Text className="text-gray-400 text-xs">7 exercises • 55-65 min</Text>
          </View>
        </View>

        {/* History */}
        <Text className="text-gray-300 text-sm font-semibold mb-3">History</Text>
        <View className="flex-row justify-between mb-4">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
            <Text key={idx} className={`${day === "Thu" ? "text-blue-400" : "text-gray-400"} font-semibold`}>{day}</Text>
          ))}
        </View>

        {[
          { name: "Leg Day", info: "6 exercises • 55 min" },
          { name: "Push Day", info: "3 exercises • 60 min" },
          { name: "Upper Body", info: "6 exercises • 50 min" },
        ].map((w, idx) => (
          <TouchableOpacity key={idx} className="bg-neutral-900 p-4 rounded-2xl mb-3 flex-row items-center">
            <Ionicons name="calendar-outline" size={18} color="#fff" />
            <View className="ml-3">
              <Text className="text-white font-semibold">{w.name}</Text>
              <Text className="text-gray-400 text-xs">{w.info}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
