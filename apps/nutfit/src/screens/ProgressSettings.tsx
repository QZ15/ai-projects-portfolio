// src/screens/ProgressSettings.tsx
import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, Switch, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useProgress } from "../context/ProgressContext";

const PREFS_KEY = "@nutfit:progress:prefs";

export default function ProgressSettings() {
  const nav = useNavigation<any>();
  const { heightInInches, setHeightInInches } = useProgress();

  const [showBMI, setShowBMI] = useState(true);
  const [showBodyFat, setShowBodyFat] = useState(true);
  const [showMuscle, setShowMuscle] = useState(true);
  const [heightIn, setHeightIn] = useState(heightInInches ? String(heightInInches) : "");

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(PREFS_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setShowBMI(p.showBMI ?? true);
        setShowBodyFat(p.showBodyFat ?? true);
        setShowMuscle(p.showMuscle ?? true);
      }
    })();
  }, []);

  const persistPrefs = async (next: any) => {
    const merged = { showBMI, showBodyFat, showMuscle, ...next };
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(merged));
  };

  const onToggle = async (key: "showBMI" | "showBodyFat" | "showMuscle", val: boolean) => {
    if (key === "showBMI") setShowBMI(val);
    if (key === "showBodyFat") setShowBodyFat(val);
    if (key === "showMuscle") setShowMuscle(val);
    await persistPrefs({ [key]: val });
  };

  const saveHeight = async () => {
    const v = parseFloat(heightIn);
    if (!Number.isNaN(v)) await setHeightInInches(v);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Progress Settings</Text>
          <TouchableOpacity onPress={() => nav.goBack()}>
            <Ionicons name="close" size={22} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Sections */}
        <View className="bg-neutral-900 p-4 rounded-2xl mb-6">
          <Text className="text-white text-base font-semibold mb-3">Metrics</Text>
          <Row label="Show Body Fat %" value={showBodyFat} onChange={(v) => onToggle("showBodyFat", v)} />
          <Row label="Show BMI" value={showBMI} onChange={(v) => onToggle("showBMI", v)} />
          <Row label="Show Muscle Mass %" value={showMuscle} onChange={(v) => onToggle("showMuscle", v)} />
        </View>

        <View className="bg-neutral-900 p-4 rounded-2xl mb-6">
          <Text className="text-white text-base font-semibold mb-3">Profile</Text>
          <Text className="text-white mb-1">Height (inches)</Text>
          <TextInput
            value={heightIn}
            onChangeText={setHeightIn}
            keyboardType="decimal-pad"
            placeholder="e.g. 70"
            placeholderTextColor="#777"
            className="bg-neutral-800 text-white px-4 py-3 rounded-xl"
          />
          <TouchableOpacity onPress={saveHeight} className="bg-neutral-800 px-4 py-3 rounded-xl mt-3">
            <Text className="text-white font-semibold">Save Height</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-neutral-900 p-4 rounded-2xl">
          <Text className="text-white text-base font-semibold mb-3">Reminders (coming soon)</Text>
          <Row label="Daily log reminder" value={false} onChange={() => {}} disabled />
          <Text className="text-gray-400 text-xs mt-2">We’ll add Expo Notifications wiring in a later pass.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, onChange, disabled }: { label: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <View className="flex-row items-center justify-between py-2">
      <Text className="text-white">{label}</Text>
      <Switch value={value} onValueChange={onChange} disabled={disabled} />
    </View>
  );
}
