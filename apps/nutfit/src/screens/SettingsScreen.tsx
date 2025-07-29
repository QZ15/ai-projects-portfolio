import React from "react";
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

type SettingsNavProp = NativeStackNavigationProp<RootStackParamList, "Main">;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsNavProp>();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: "Onboarding" }],
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const settingsItems = [
    { title: "Account", icon: "person-outline", screen: "Profile" },
    { title: "Notifications", icon: "notifications-outline", screen: null },
    { title: "Theme", icon: "color-palette-outline", screen: null },
    { title: "Privacy & Security", icon: "lock-closed-outline", screen: null },
    { title: "Help & Support", icon: "help-circle-outline", screen: null },
  ];

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
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
            onPress={() => {
              if (item.screen) {
                navigation.navigate(item.screen as never);
              }
            }}
          >
            <View className="flex-row items-center">
              <Ionicons name={item.icon as any} size={20} color="#fff" />
              <Text className="text-white ml-3 font-semibold">{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6B7280" />
          </TouchableOpacity>
        ))}

        {/* Sign Out */}
        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-red-600 p-4 rounded-2xl flex-row justify-center items-center mt-6"
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text className="text-white ml-3 font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
