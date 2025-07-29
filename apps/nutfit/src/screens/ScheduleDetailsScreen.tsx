import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ScheduleDetailsScreen({ route, navigation }) {
  const { event } = route.params || {
    event: {
      title: "Morning Workout",
      time: "7:00 AM - 8:00 AM",
      description: "Full body strength training session",
    },
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="p-5">
        <Text className="text-white text-2xl font-bold">{event.title}</Text>
        <Text className="text-gray-400 mt-1">{event.time}</Text>

        <View className="mt-5">
          <Text className="text-white text-lg font-semibold mb-2">Details</Text>
          <Text className="text-gray-400 text-sm">{event.description}</Text>
        </View>

        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-2xl mt-8"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-semibold text-center">Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
