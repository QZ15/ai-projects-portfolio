import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function Scheduler() {
  const navigation = useNavigation();

  const events = [
    {
      title: "Morning Workout",
      time: "7:00 AM - 8:00 AM",
      description: "Full body strength training session",
    },
    {
      title: "Lunch Meal Prep",
      time: "12:00 PM - 12:30 PM",
      description: "Prep chicken and veggies for the week",
    },
    {
      title: "Evening Yoga",
      time: "6:00 PM - 6:30 PM",
      description: "Relaxing yoga flow",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Scheduler</Text>
          <TouchableOpacity className="p-2 bg-neutral-900 rounded-xl">
            <Ionicons name="add-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Events List */}
        {events.map((event, idx) => (
          <TouchableOpacity
            key={idx}
            className="bg-neutral-900 p-4 rounded-2xl mb-3 flex-row items-center"
            onPress={() => navigation.navigate("ScheduleDetails", { event })}
          >
            <Ionicons name="calendar-outline" size={18} color="#fff" />
            <View className="ml-3">
              <Text className="text-white font-semibold">{event.title}</Text>
              <Text className="text-gray-400 text-xs">{event.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
