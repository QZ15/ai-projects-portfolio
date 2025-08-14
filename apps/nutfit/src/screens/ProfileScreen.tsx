// src/screens/ProfileScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth } from "../services/firebase";
import { useNavigation } from "@react-navigation/native";
import { useProfile } from "../context/ProfileContext";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { profile, updateProfile } = useProfile();

  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");   // lbs (string for input)
  const [bodyFat, setBodyFat] = useState(""); // % (string for input)
  const [goal, setGoal] = useState("");

  // Populate fields when profile loads/changes
  useEffect(() => {
    if (!profile) {
      setName("");
      setWeight("");
      setBodyFat("");
      setGoal("");
      return;
    }
    setName(profile.name ?? "");
    setWeight(
      profile.weightLbs !== undefined && profile.weightLbs !== null
        ? String(profile.weightLbs)
        : ""
    );
    setBodyFat(
      profile.bodyFatPct !== undefined && profile.bodyFatPct !== null
        ? String(profile.bodyFatPct)
        : ""
    );
    setGoal(profile.goal ?? "");
  }, [profile]);

  const handleSave = async () => {
    try {
      const weightNum =
        weight.trim() === "" ? undefined : parseFloat(weight.replace(",", "."));
      const bodyFatNum =
        bodyFat.trim() === "" ? undefined : parseFloat(bodyFat.replace(",", "."));

      if (weightNum !== undefined && Number.isNaN(weightNum)) {
        Alert.alert("Invalid Weight", "Please enter a valid number for weight (lbs).");
        return;
      }
      if (bodyFatNum !== undefined && Number.isNaN(bodyFatNum)) {
        Alert.alert("Invalid Body Fat", "Please enter a valid number for body fat (%).");
        return;
      }

      await updateProfile({
        name: name || undefined,
        weightLbs: weightNum,
        bodyFatPct: bodyFatNum,
        goal: goal || undefined,
      });

      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Could not update profile.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mt-3 mb-6">
            <Text className="text-white text-[28px] font-bold">Edit Profile</Text>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="p-2 bg-neutral-900 rounded-xl"
            >
              <Ionicons name="close-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Name */}
          <Text className="text-gray-400 text-sm mb-1">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#6B7280"
            className="bg-neutral-900 p-4 rounded-2xl text-white mb-4"
            autoCapitalize="words"
          />

          {/* Email (read-only) */}
          <Text className="text-gray-400 text-sm mb-1">Email</Text>
          <View className="bg-neutral-900 p-4 rounded-2xl mb-4">
            <Text className="text-white">{auth.currentUser?.email}</Text>
          </View>

          {/* Weight (lbs) */}
          <Text className="text-gray-400 text-sm mb-1">Weight (lbs)</Text>
          <TextInput
            value={weight}
            onChangeText={setWeight}
            placeholder="e.g. 165.5"
            placeholderTextColor="#6B7280"
            keyboardType="decimal-pad"
            className="bg-neutral-900 p-4 rounded-2xl text-white mb-4"
          />

          {/* Body Fat % */}
          <Text className="text-gray-400 text-sm mb-1">Body Fat %</Text>
          <TextInput
            value={bodyFat}
            onChangeText={setBodyFat}
            placeholder="e.g. 14.2"
            placeholderTextColor="#6B7280"
            keyboardType="decimal-pad"
            className="bg-neutral-900 p-4 rounded-2xl text-white mb-4"
          />

          {/* Goal */}
          <Text className="text-gray-400 text-sm mb-1">Goal</Text>
          <TextInput
            value={goal}
            onChangeText={setGoal}
            placeholder='e.g. "Cut to 12% BF" or "Reach 180 lbs"'
            placeholderTextColor="#6B7280"
            className="bg-neutral-900 p-4 rounded-2xl text-white mb-6"
          />

          {/* Save Button */}
          <TouchableOpacity onPress={handleSave} className="bg-blue-500 p-4 rounded-2xl items-center">
            <Text className="text-white font-semibold">Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
