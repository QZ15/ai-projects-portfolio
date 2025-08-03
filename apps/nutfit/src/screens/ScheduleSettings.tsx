import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";

const mealKeys = ["Breakfast", "Lunch", "Dinner", "Snack"];

export default function ScheduleSettings({ navigation }) {
  const [prefs, setPrefs] = useState<{ mealTimes: Record<string, string>; workoutTime: string }>({
    mealTimes: {
      Breakfast: "09:00",
      Lunch: "12:00",
      Dinner: "18:00",
      Snack: "20:00",
    },
    workoutTime: "17:00",
  });
  const [pickerKey, setPickerKey] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("schedulePrefs");
      if (saved) setPrefs(JSON.parse(saved));
    })();
  }, []);

  const handleConfirm = (date: Date) => {
    if (!pickerKey) return;
    const time = dayjs(date).format("HH:mm");
    if (pickerKey === "workout") {
      setPrefs((p) => ({ ...p, workoutTime: time }));
    } else {
      setPrefs((p) => ({
        ...p,
        mealTimes: { ...p.mealTimes, [pickerKey]: time },
      }));
    }
    setPickerKey(null);
  };

  const save = async () => {
    await AsyncStorage.setItem("schedulePrefs", JSON.stringify(prefs));
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 px-5">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Schedule Settings</Text>
        </View>

        {mealKeys.map((m) => (
          <TouchableOpacity
            key={m}
            className="flex-row justify-between items-center py-3 border-b border-neutral-800"
            onPress={() => setPickerKey(m)}
          >
            <Text className="text-white">{m} Time</Text>
            <Text className="text-gray-400">{prefs.mealTimes[m]}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          className="flex-row justify-between items-center py-3 border-b border-neutral-800"
          onPress={() => setPickerKey("workout")}
        >
          <Text className="text-white">Workout Time</Text>
          <Text className="text-gray-400">{prefs.workoutTime}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-600 p-4 rounded-2xl mt-8"
          onPress={save}
        >
          <Text className="text-white font-semibold text-center">Save</Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={pickerKey !== null}
          mode="time"
          date={dayjs(
            pickerKey === "workout"
              ? prefs.workoutTime
              : prefs.mealTimes[pickerKey || ""],
            "HH:mm"
          ).toDate()}
          onConfirm={handleConfirm}
          onCancel={() => setPickerKey(null)}
          isDarkModeEnabled
          minimumDate={new Date(0)}
          is24Hour
        />
      </View>
    </SafeAreaView>
  );
}

