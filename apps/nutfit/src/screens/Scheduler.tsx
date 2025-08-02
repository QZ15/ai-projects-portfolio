import React, { useState, useMemo, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, PanResponder } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PanGestureHandler, LongPressGestureHandler } from "react-native-gesture-handler";
import dayjs from "dayjs";
import { useTodayMeals } from "../context/TodayMealsContext";
import { useWeekWorkouts } from "../context/WeekWorkoutsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const HOUR_HEIGHT = 60;
const defaultMealTimes: Record<string, string> = {
  Breakfast: "09:00",
  Lunch: "12:00",
  Dinner: "18:00",
  Snack: "20:00",
};
const defaultWorkoutTime = "17:00";

const timeToDate = (base: dayjs.Dayjs, time: string) => {
  const [h, m] = time.split(":").map(Number);
  return base.hour(h).minute(m).second(0);
};

export default function Scheduler() {
  const navigation = useNavigation<any>();
  const { todayMeals } = useTodayMeals();
  const { weekWorkouts } = useWeekWorkouts();
  const [day, setDay] = useState(dayjs());
  const [weekStart, setWeekStart] = useState(day.startOf("week"));
  const [schedules, setSchedules] = useState<Record<string, any[]>>({});
  const [prefs, setPrefs] = useState<{ mealTimes: Record<string, string>; workoutTime: string }>({
    mealTimes: defaultMealTimes,
    workoutTime: defaultWorkoutTime,
  });
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day")),
    [weekStart]
  );

  const dayKey = day.format("YYYY-MM-DD");

  const buildDefault = () => {
    const base = day.clone().startOf("day");
    const used = new Set<string>();
    const allSlots = ["09:00", "12:00", "18:00", "20:00"];
    const takeSlot = (preferred: string) => {
      if (!used.has(preferred)) {
        used.add(preferred);
        return preferred;
      }
      const start = allSlots.indexOf(preferred);
      for (let i = 1; i <= allSlots.length; i++) {
        const slot = allSlots[(start + i) % allSlots.length];
        if (!used.has(slot)) {
          used.add(slot);
          return slot;
        }
      }
      for (let h = 0; h < 24; h++) {
        const t = `${String(h).padStart(2, "0")}:00`;
        if (!used.has(t)) {
          used.add(t);
          return t;
        }
      }
      return "00:00";
    };

    const items: any[] = [];

    if (day.isSame(dayjs(), "day")) {
      todayMeals.forEach((meal: any, idx: number) => {
        const pref = prefs.mealTimes[meal.mealType] || allSlots[idx] || "09:00";
        const time = timeToDate(base, takeSlot(pref));
        items.push({
          id: `meal-${idx}-${meal.name}`,
          title: meal.name,
          time,
          type: "meal",
          refId: meal.id,
        });
      });
    }

    const diff = day.startOf("day").diff(dayjs().startOf("day"), "day");
    if (diff >= 0 && diff < weekWorkouts.length) {
      const w = weekWorkouts[diff];
      items.push({
        id: `workout-${diff}-${w.name}`,
        title: w.name,
        time: timeToDate(base, takeSlot(prefs.workoutTime)),
        type: "workout",
        refId: w.id,
      });
    }

    return items.sort((a, b) => a.time.valueOf() - b.time.valueOf());
  };

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("scheduleItems");
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.keys(parsed).forEach((k) => {
          parsed[k] = parsed[k].map((it: any) => ({ ...it, time: dayjs(it.time) }));
        });
        setSchedules(parsed);
      }
      const prefSaved = await AsyncStorage.getItem("schedulePrefs");
      if (prefSaved) setPrefs(JSON.parse(prefSaved));
    })();
  }, []);

  useEffect(() => {
    const loadPrefs = async () => {
      const prefSaved = await AsyncStorage.getItem("schedulePrefs");
      if (prefSaved) setPrefs(JSON.parse(prefSaved));
    };
    const unsub = navigation.addListener("focus", loadPrefs);
    return unsub;
  }, [navigation]);

  useEffect(() => {
    AsyncStorage.setItem("scheduleItems", JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    const auto = buildDefault();
    setSchedules((prev) => {
      const existing = prev[dayKey] || [];
      const events = existing.filter((it: any) => it.type === "event");
      const merged = auto.map((it) => {
        const found = existing.find((e: any) => e.id === it.id);
        return found ? { ...it, time: found.time } : it;
      });
      return {
        ...prev,
        [dayKey]: [...merged, ...events].sort(
          (a, b) => a.time.valueOf() - b.time.valueOf()
        ),
      };
    });
  }, [dayKey, todayMeals, weekWorkouts, prefs]);

  const items = schedules[dayKey] || [];

  const updateItem = (updated: any) => {
    setSchedules((prev) => ({
      ...prev,
      [dayKey]: prev[dayKey]
        .map((it) => (it.id === updated.id ? updated : it))
        .sort((a, b) => a.time.valueOf() - b.time.valueOf()),
    }));
  };

  const deleteItem = (id: string) => {
    setSchedules((prev) => ({
      ...prev,
      [dayKey]: prev[dayKey].filter((it) => it.id !== id),
    }));
  };

  const getResponder = (id: string) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () => draggingId === id,
      onPanResponderMove: (_, g) => {
        setDragOffset(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        const original = items.find((i) => i.id === id);
        if (original) {
          const minutes =
            minutesToTop(original.time) + (g.dy / HOUR_HEIGHT) * 60;
          const newTime = day.startOf("day").add(minutes, "minute");
          updateItem({ ...original, time: newTime });
        }
        setDraggingId(null);
        setDragOffset(0);
        setScrollEnabled(true);
      },
    });

  const handleAdd = () => {
    const base = day.clone().startOf("day");
    const newItem = {
      id: `event-${Date.now()}`,
      title: "New Event",
      time: base.add(12, "hour"),
      type: "event",
    };
    setSchedules((prev) => ({
      ...prev,
      [dayKey]: [...items, newItem].sort((a, b) => a.time.valueOf() - b.time.valueOf()),
    }));
    navigation.navigate("ScheduleDetails", {
      item: newItem,
      onUpdate: updateItem,
      onDelete: deleteItem,
      onCancelNew: deleteItem,
      isNew: true,
    });
  };

  const handleLongPress = (e: any) => {
    const y = e.nativeEvent.y;
    const minutes = (y / HOUR_HEIGHT) * 60;
    const newItem = {
      id: `event-${Date.now()}`,
      title: "New Event",
      time: day.startOf("day").add(minutes, "minute"),
      type: "event",
    };
    setSchedules((prev) => ({
      ...prev,
      [dayKey]: [...items, newItem].sort((a, b) => a.time.valueOf() - b.time.valueOf()),
    }));
    navigation.navigate("ScheduleDetails", {
      item: newItem,
      onUpdate: updateItem,
      onDelete: deleteItem,
      onCancelNew: deleteItem,
      isNew: true,
    });
  };

  const minutesToTop = (date: dayjs.Dayjs) =>
    date.diff(day.startOf("day"), "minute") * (HOUR_HEIGHT / 60);

  const handleWeekSwipe = ({ nativeEvent }: any) => {
    if (nativeEvent.translationX < -50) {
      setWeekStart(weekStart.add(1, "week"));
      setDay(day.add(1, "week"));
    } else if (nativeEvent.translationX > 50) {
      setWeekStart(weekStart.subtract(1, "week"));
      setDay(day.subtract(1, "week"));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 px-5">
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Schedule</Text>
          <View className="flex-row gap-4">
            <TouchableOpacity onPress={handleAdd}>
              <Ionicons name="add" size={22} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("ScheduleSettings") }>
              <Ionicons name="settings-outline" size={22} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Week day selector */}
        <PanGestureHandler onEnded={handleWeekSwipe}>
          <View className="flex-row justify-between py-2 mb-2">
            {weekDays.map((d) => (
              <TouchableOpacity
                key={d.format("YYYY-MM-DD")}
                onPress={() => setDay(d)}
                className="flex-1 items-center"
              >
                <Text className="text-xs text-gray-400">{d.format("ddd")}</Text>
                <View
                  className={
                    "w-10 h-10 mt-1 rounded-full flex items-center justify-center" +
                    (day.isSame(d, "day") ? " bg-neutral-700" : "")
                  }
                >
                  <Text
                    className={
                      day.isSame(d, "day")
                        ? "text-white font-semibold"
                        : "text-gray-500"
                    }
                  >
                    {d.format("D")}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </PanGestureHandler>

        <Text className="text-center text-gray-400 mb-4">
          {day.format("dddd-MMM-D-YYYY")}
        </Text>

        {/* Day timeline */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ height: HOUR_HEIGHT * 24 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={scrollEnabled}
        >
          <LongPressGestureHandler minDurationMs={800} onActivated={handleLongPress}>
            <View style={{ flex: 1, position: "relative" }}>
              {Array.from({ length: 24 }).map((_, hour) => (
                <View
                  key={hour}
                  style={{
                    position: "absolute",
                    top: hour * HOUR_HEIGHT,
                    left: 0,
                    right: 0,
                    height: HOUR_HEIGHT,
                  }}
                >
                  <View className="flex-row h-full">
                    <Text className="w-12 pr-2 text-right text-gray-500">
                      {dayjs().hour(hour).format("h A")}
                    </Text>
                    <View className="flex-1 border-t border-neutral-800" />
                  </View>
                </View>
              ))}

              {items.map((item) => {
                const isDragging = draggingId === item.id;
                const top = minutesToTop(item.time) + (isDragging ? dragOffset : 0);
                const responder = getResponder(item.id);
                return (
                  <View
                    key={item.id}
                    {...responder.panHandlers}
                    className="absolute bg-neutral-900 rounded-xl"
                    style={{ top, left: 56, right: 0 }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.9}
                      delayLongPress={500}
                      onLongPress={() => {
                        setDraggingId(item.id);
                        setDragOffset(0);
                        setScrollEnabled(false);
                      }}
                      onPress={() =>
                        navigation.navigate("ScheduleDetails", {
                          item,
                          onUpdate: updateItem,
                          onDelete: deleteItem,
                          onCancelNew: deleteItem,
                          isNew: false,
                        })
                      }
                      className="p-3"
                    >
                      <Text className="text-white font-semibold">{item.title}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </LongPressGestureHandler>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

