import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from "dayjs";

export default function ScheduleDetailsScreen({ route, navigation }) {
  const { item, onUpdate, onDelete, onCancelNew, isNew } = route.params;
  const [title, setTitle] = useState(item.title);
  const [time, setTime] = useState(dayjs(item.time));
  const [showPicker, setShowPicker] = useState(false);

  const handleConfirm = (date: Date) => {
    setTime(dayjs(date));
    setShowPicker(false);
  };

  const save = () => {
    onUpdate({ ...item, title, time });
    navigation.goBack();
  };

  const remove = () => {
    onDelete(item.id);
    navigation.goBack();
  };

  const cancel = () => {
    if (isNew && onCancelNew) onCancelNew(item.id);
    navigation.goBack();
  };

  const openLinked = () => {
    if (item.type === "meal") {
      navigation.navigate("Meals", {
        screen: "MealDetails",
        params: { meal: { name: item.title, id: item.refId } },
      });
    } else if (item.type === "workout") {
      navigation.navigate("Workouts", {
        screen: "WorkoutDetails",
        params: { workout: { name: item.title, id: item.refId } },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 px-5">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={cancel} className="mr-2">
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Item Details</Text>
        </View>

        <TextInput
          className="bg-neutral-900 text-white rounded-xl p-3 mb-4"
          placeholder="Title"
          placeholderTextColor="#6B7280"
          value={title}
          onChangeText={setTitle}
        />

        <TouchableOpacity
          className="bg-neutral-900 p-3 rounded-xl mb-4"
          onPress={() => setShowPicker(true)}
        >
          <Text className="text-white">Time: {time.format("HH:mm")}</Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={showPicker}
          mode="time"
          date={time.toDate()}
          onConfirm={handleConfirm}
          onCancel={() => setShowPicker(false)}
          isDarkModeEnabled
          is24Hour
        />

        {item.type !== "event" && (
          <TouchableOpacity
            className="bg-blue-600 p-3 rounded-xl mb-4"
            onPress={openLinked}
          >
            <Text className="text-white text-center">Open {item.type}</Text>
          </TouchableOpacity>
        )}

        <View className="flex-row justify-between mt-auto">
          <TouchableOpacity
            className="flex-1 bg-red-600 mr-2 p-4 rounded-xl"
            onPress={remove}
          >
            <Text className="text-white text-center font-semibold">Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-neutral-800 mr-2 p-4 rounded-xl"
            onPress={cancel}
          >
            <Text className="text-white text-center font-semibold">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-blue-600 p-4 rounded-xl"
            onPress={save}
          >
            <Text className="text-white text-center font-semibold">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

