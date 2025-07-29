import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <View>
            <Text className="text-white text-[28px] font-bold">Welcome back,</Text>
            <Text className="text-white text-[28px] font-bold -mt-1">Qasim!</Text>
          </View>
          <TouchableOpacity className="p-2 bg-neutral-900 rounded-xl">
            <Ionicons name="settings-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* TODAY’S SUMMARY */}
        <Text className="text-gray-300 text-sm font-semibold mb-3">TODAY’S SUMMARY</Text>

        {/* Calories Consumed */}
        <TouchableOpacity className="bg-neutral-900 p-4 rounded-2xl mb-3 flex-row justify-between items-center">
          <View>
            <Text className="text-white text-2xl font-bold">582</Text>
            <Text className="text-gray-400 text-xs -mt-1">kcal</Text>
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-white font-semibold">Calories Consumed</Text>
            <Text className="text-gray-400 text-xs">Calories Burned</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>

        {/* Current Weight */}
        <TouchableOpacity className="bg-neutral-900 p-4 rounded-2xl mb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-white text-2xl font-bold">433</Text>
            <Text className="text-gray-400 text-xs -mt-1">lbs</Text>
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-white font-semibold">Current Weight</Text>
            <Text className="text-gray-400 text-xs">Updated Today</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>

        {/* QUICK ACTIONS */}
        <Text className="text-gray-300 text-sm font-semibold mb-3">QUICK ACTIONS</Text>

        <TouchableOpacity className="bg-neutral-900 p-4 rounded-2xl mb-3 flex-row items-center">
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text className="text-white ml-3 font-semibold">View Today’s Meal Plan</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-neutral-900 p-4 rounded-2xl flex-row items-center">
          <Ionicons name="barbell-outline" size={20} color="#fff" />
          <Text className="text-white ml-3 font-semibold">Start Workout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
