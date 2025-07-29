import React from "react";
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function SettingsScreen() {
  const settingsItems = [
    { title: "Account", icon: "person-outline" },
    { title: "Notifications", icon: "notifications-outline" },
    { title: "Theme", icon: "color-palette-outline" },
    { title: "Privacy & Security", icon: "lock-closed-outline" },
    { title: "Help & Support", icon: "help-circle-outline" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Settings</Text>
          <TouchableOpacity className="p-2 bg-neutral-900 rounded-xl">
            <Ionicons name="settings-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Settings List */}
        {settingsItems.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
          >
            <View className="flex-row items-center">
              <Ionicons name={item.icon as any} size={20} color="#fff" />
              <Text className="text-white ml-3 font-semibold">{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6B7280" />
          </TouchableOpacity>
        ))}

        {/* Sign Out */}
        <TouchableOpacity className="bg-red-600 p-4 rounded-2xl flex-row justify-center items-center mt-6">
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text className="text-white ml-3 font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
