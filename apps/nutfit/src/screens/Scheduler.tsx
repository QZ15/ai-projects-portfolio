import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Scheduler() {
  const scheduleItems = [
    { title: "Morning Workout", time: "7:00 AM", details: "Push Day • Chest & Triceps" },
    { title: "Meal Prep", time: "9:00 AM", details: "Breakfast • Oatmeal with Berries" },
    { title: "Afternoon Cardio", time: "2:00 PM", details: "Running • 30 min" },
    { title: "Evening Stretch", time: "8:00 PM", details: "Yoga • Recovery" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Schedule</Text>
          <TouchableOpacity className="p-2 bg-neutral-900 rounded-xl">
            <Ionicons name="add-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Today’s Schedule */}
        <Text className="text-white text-lg font-semibold mb-3">Today’s Schedule</Text>
        {scheduleItems.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
          >
            <View>
              <Text className="text-white font-medium">{item.title}</Text>
              <Text className="text-gray-400 text-xs mt-0.5">{item.details}</Text>
              <Text className="text-gray-500 text-xs mt-0.5">{item.time}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6B7280" />
          </TouchableOpacity>
        ))}

        {/* Quick Add Section */}
        <Text className="text-white text-lg font-semibold mt-6 mb-3">Quick Actions</Text>
        <TouchableOpacity className="bg-neutral-900 p-4 rounded-2xl flex-row items-center mb-3">
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text className="text-white ml-3 font-semibold">Add New Event</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-neutral-900 p-4 rounded-2xl flex-row items-center">
          <Ionicons name="alarm-outline" size={20} color="#fff" />
          <Text className="text-white ml-3 font-semibold">Set Reminder</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
