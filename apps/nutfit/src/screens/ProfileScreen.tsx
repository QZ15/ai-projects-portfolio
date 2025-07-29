import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth, db } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

type ProfileNavProp = NativeStackNavigationProp<RootStackParamList, "Main">;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileNavProp>();

  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [goal, setGoal] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;
      try {
        const ref = doc(db, "users", auth.currentUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setName(data.name || "");
          setWeight(data.weight || "");
          setBodyFat(data.bodyFat || "");
          setGoal(data.goal || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser) return;
    try {
      const ref = doc(db, "users", auth.currentUser.uid);
      await updateDoc(ref, {
        name,
        weight,
        bodyFat,
        goal,
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
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Edit Profile</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-neutral-900 rounded-xl">
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
        />

        {/* Email (read-only) */}
        <Text className="text-gray-400 text-sm mb-1">Email</Text>
        <View className="bg-neutral-900 p-4 rounded-2xl mb-4">
          <Text className="text-white">{auth.currentUser?.email}</Text>
        </View>

        {/* Weight */}
        <Text className="text-gray-400 text-sm mb-1">Weight (kg)</Text>
        <TextInput
          value={weight}
          onChangeText={setWeight}
          placeholder="Enter weight"
          placeholderTextColor="#6B7280"
          keyboardType="numeric"
          className="bg-neutral-900 p-4 rounded-2xl text-white mb-4"
        />

        {/* Body Fat */}
        <Text className="text-gray-400 text-sm mb-1">Body Fat %</Text>
        <TextInput
          value={bodyFat}
          onChangeText={setBodyFat}
          placeholder="Enter body fat %"
          placeholderTextColor="#6B7280"
          keyboardType="numeric"
          className="bg-neutral-900 p-4 rounded-2xl text-white mb-4"
        />

        {/* Goal */}
        <Text className="text-gray-400 text-sm mb-1">Goal</Text>
        <TextInput
          value={goal}
          onChangeText={setGoal}
          placeholder="Enter your goal"
          placeholderTextColor="#6B7280"
          className="bg-neutral-900 p-4 rounded-2xl text-white mb-6"
        />

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          className="bg-blue-500 p-4 rounded-2xl items-center"
        >
          <Text className="text-white font-semibold">Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
