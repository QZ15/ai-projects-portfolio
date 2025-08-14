// src/screens/SettingsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Switch,
  Platform,
  Linking,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import DateTimePicker from "@react-native-community/datetimepicker";

type Nav = ReturnType<typeof useNavigation>;

const NOTIF_ENABLED_KEY = "@nutfit:reminder:enabled";
const NOTIF_TIME_KEY    = "@nutfit:reminder:time";
const NOTIF_ID_KEY      = "@nutfit:reminder:id";

const PROGRESS_KEYS = [
  "@nutfit:progress:entries",
  "@nutfit:progress:heightInInches",
  "@nutfit:progress:prefs",
  "weightEntries",
];

function toHHmm(d: Date) {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}
function fromHHmm(s: string): Date {
  const [h, m] = s.split(":").map(Number);
  const d = new Date();
  d.setHours(h || 9, m || 0, 0, 0);
  return d;
}

export default function SettingsScreen() {
  const navigation = useNavigation<Nav>();

  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifTime, setNotifTime] = useState<Date>(() => {
    const d = new Date();
    d.setHours(9, 0, 0, 0);
    return d;
  });
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const enabled = (await AsyncStorage.getItem(NOTIF_ENABLED_KEY)) === "1";
        const timeStr = (await AsyncStorage.getItem(NOTIF_TIME_KEY)) || "09:00";
        setNotifEnabled(enabled);
        setNotifTime(fromHHmm(timeStr));
      } catch {}
    })();
  }, []);

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const req = await Notifications.requestPermissionsAsync();
      return req.status === "granted";
    }
    return true;
  };

  const scheduleDailyReminder = async (time: Date) => {
    const granted = await requestNotificationPermission();
    if (!granted) {
      Alert.alert("Permission needed", "Enable notifications to receive reminders.");
      return null;
    }
    const existingId = await AsyncStorage.getItem(NOTIF_ID_KEY);
    if (existingId) {
      try { await Notifications.cancelScheduledNotificationAsync(existingId); } catch {}
    }
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily log",
        body: "Quick check-in: log today’s weight/body stats.",
        sound: true,
        priority: Notifications.AndroidNotificationPriority.DEFAULT,
      },
      trigger: { hour: time.getHours(), minute: time.getMinutes(), repeats: true },
    });
    await AsyncStorage.setItem(NOTIF_ID_KEY, id);
    await AsyncStorage.setItem(NOTIF_TIME_KEY, toHHmm(time));
    await AsyncStorage.setItem(NOTIF_ENABLED_KEY, "1");
    return id;
  };

  const cancelDailyReminder = async () => {
    const id = await AsyncStorage.getItem(NOTIF_ID_KEY);
    if (id) {
      try { await Notifications.cancelScheduledNotificationAsync(id); } catch {}
    }
    await AsyncStorage.setItem(NOTIF_ENABLED_KEY, "0");
    await AsyncStorage.removeItem(NOTIF_ID_KEY);
  };

  const toggleReminder = async (value: boolean) => {
    if (value) {
      const id = await scheduleDailyReminder(notifTime);
      if (id) setNotifEnabled(true);
    } else {
      await cancelDailyReminder();
      setNotifEnabled(false);
    }
  };

  const onChangeTime = async (_: any, date?: Date) => {
    setShowTimePicker(false);
    if (!date) return;
    setNotifTime(date);
    await AsyncStorage.setItem(NOTIF_TIME_KEY, toHHmm(date));
    if (notifEnabled) await scheduleDailyReminder(date);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // No manual reset; RootNavigator will switch to Auth when user becomes null.
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const clearProgressData = async () => {
    Alert.alert(
      "Clear Progress Data",
      "This will delete your logged entries and preferences on this device.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await Promise.all(PROGRESS_KEYS.map((k) => AsyncStorage.removeItem(k)));
              Alert.alert("Cleared", "Progress data removed from this device.");
            } catch {
              Alert.alert("Error", "Could not clear data. Try again.");
            }
          },
        },
      ]
    );
  };

  const openSupport = () => {
    const email = "support@nutfit.app";
    Linking.openURL(`mailto:${email}?subject=NutFit%20Support`);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Settings</Text>
          <TouchableOpacity className="p-2 bg-neutral-900 rounded-xl" onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Account */}
        <TouchableOpacity
          className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
          onPress={() => navigation.navigate("Profile" as never)}
        >
          <View className="flex-row items-center">
            <Ionicons name="person-outline" size={20} color="#fff" />
            <Text className="text-white ml-3 font-semibold">Account</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>

        {/* Progress Settings (navigate into Progress tab's stack) */}
        <TouchableOpacity
          className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
          onPress={() =>
            navigation.navigate("Progress" as never, { screen: "ProgressSettings" } as never)
          }
        >
          <View className="flex-row items-center">
            <Ionicons name="stats-chart-outline" size={20} color="#fff" />
            <Text className="text-white ml-3 font-semibold">Progress Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>

        {/* Schedule Settings (nested in Schedule tab) */}
        <TouchableOpacity
          className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
          onPress={() =>
            navigation.navigate("Schedule" as never, { screen: "ScheduleSettings" } as never)
          }
        >
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text className="text-white ml-3 font-semibold">Schedule Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>

        {/* Notifications */}
        <View className="bg-neutral-900 p-4 rounded-2xl mb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="notifications-outline" size={20} color="#fff" />
              <Text className="text-white ml-3 font-semibold">Daily log reminder</Text>
            </View>
            <Switch value={notifEnabled} onValueChange={toggleReminder} />
          </View>

          <TouchableOpacity
            className="mt-3 bg-neutral-800 px-4 py-3 rounded-xl flex-row items-center justify-between"
            onPress={() => setShowTimePicker(true)}
            disabled={!notifEnabled}
          >
            <Text className="text-white">Reminder time</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-300 mr-2">
                {notifTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
              <Ionicons name="time-outline" size={18} color="#6B7280" />
            </View>
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={notifTime}
              mode="time"
              is24Hour={false}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangeTime}
            />
          )}
        </View>

        {/* Privacy & Security */}
        <View className="bg-neutral-900 p-4 rounded-2xl mb-3">
          <View className="flex-row items-center mb-3">
            <Ionicons name="lock-closed-outline" size={20} color="#fff" />
            <Text className="text-white ml-3 font-semibold">Privacy & Security</Text>
          </View>

          <TouchableOpacity
            className="bg-neutral-800 px-4 py-3 rounded-xl flex-row items-center justify-between"
            onPress={clearProgressData}
          >
            <Text className="text-white">Clear Progress Data</Text>
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Reset Onboarding (dev) */}
        <TouchableOpacity
          className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
          onPress={async () => { await AsyncStorage.removeItem("hasOnboarded"); }}
        >
          <View className="flex-row items-center">
            <Ionicons name="refresh-outline" size={20} color="#fff" />
            <Text className="text-white ml-3 font-semibold">Reset Onboarding (dev)</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>

        {/* Help & Support */}
        <TouchableOpacity
          className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
          onPress={openSupport}
        >
          <View className="flex-row items-center">
            <Ionicons name="help-circle-outline" size={20} color="#fff" />
            <Text className="text-white ml-3 font-semibold">Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>

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
