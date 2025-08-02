import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
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

  const onChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type !== "set" || !date || !pickerKey) return setPickerKey(null);
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
    <SafeAreaView className="flex-1 bg-black p-5">
      <Text className="text-white text-2xl font-bold mb-5">Schedule Settings</Text>

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
        className="bg-blue-500 p-4 rounded-2xl mt-8"
        onPress={save}
      >
        <Text className="text-white font-semibold text-center">Save</Text>
      </TouchableOpacity>

      {pickerKey && (
        <DateTimePicker
          value={dayjs(pickerKey === "workout" ? prefs.workoutTime : prefs.mealTimes[pickerKey], "HH:mm").toDate()}
          mode="time"
          onChange={onChange}
        />
      )}
    </SafeAreaView>
  );
}

