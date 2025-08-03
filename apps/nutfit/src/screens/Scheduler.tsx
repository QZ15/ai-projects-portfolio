import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  PanResponder,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PanGestureHandler } from "react-native-gesture-handler";
import dayjs from "dayjs";
import { useTodayMeals } from "../context/TodayMealsContext";
import { useWeekWorkouts } from "../context/WeekWorkoutsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

/* ───────────────────────── CONSTANTS ───────────────────────── */
const HOUR_HEIGHT = 60;            // pixel height of one hour row
const SNAP        = 15;            // snap-to grid in minutes
const snap  = (m: number) => Math.round(m / SNAP) * SNAP;
const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(n, hi));

const defaultMealTimes: Record<string, string> = {
  Breakfast: "09:00",
  Lunch:     "12:00",
  Dinner:    "18:00",
  Snack:     "20:00",
};
const defaultWorkoutTime = "17:00";

const timeToDate = (base: dayjs.Dayjs, hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return base.hour(h).minute(m).second(0);
};

/* ───────────────────────── COMPONENT ───────────────────────── */
export default function Scheduler() {
  const nav = useNavigation<any>();
  const { todayMeals }   = useTodayMeals();
  const { weekWorkouts } = useWeekWorkouts();

  /* ─── day / prefs / persistence ─── */
  const [day, setDay] = useState(dayjs());
  const [weekStart, setWeekStart] = useState(day.startOf("week"));
  const [prefs, setPrefs] = useState<{
    mealTimes: Record<string, string>;
    workoutTime: string;
  }>({ mealTimes: defaultMealTimes, workoutTime: defaultWorkoutTime });
  const [schedules, setSchedules] = useState<Record<string, any[]>>({});

  /* ─── drag state ─── */
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset,  setDragOffset] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  /** after long-press we set { id, moved } so we can tell taps from drags */
  const activeDrag = useRef<{ id: string; moved: boolean } | null>(null);
  const startYRef  = useRef(0);

  /* refs used inside PanResponder callbacks */
  const responders  = useRef<Record<string, any>>({});
  const itemsRef    = useRef<any[]>([]);
  const dayRef      = useRef(day);
  const updateRef   = useRef<(it: any) => void>(() => {});

  /* ─── derive keys for memo deps ─── */
  const dayKey      = day.format("YYYY-MM-DD");
  const mealsKey    = useMemo(() => JSON.stringify(todayMeals), [todayMeals]);
  const workoutsKey = useMemo(
    () => JSON.stringify(weekWorkouts),
    [weekWorkouts],
  );

  /* ───────────────────────── week header ───────────────────────── */
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day")),
    [weekStart],
  );

  /* ───────────────────────── load prefs & saved schedule ───────────────────────── */
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("scheduleItems");
      if (saved) {
        const parsed: Record<string, any[]> = JSON.parse(saved);
        Object.keys(parsed).forEach(k => {
          parsed[k] = parsed[k].map(it => ({ ...it, time: dayjs(it.time) }));
        });
        setSchedules(parsed);
      }
      const prefSaved = await AsyncStorage.getItem("schedulePrefs");
      if (prefSaved) setPrefs(JSON.parse(prefSaved));
    })();
  }, []);

  /* reload prefs whenever we come back to this screen */
  useEffect(() => {
    const unsub = nav.addListener("focus", async () => {
      const saved = await AsyncStorage.getItem("schedulePrefs");
      if (saved) setPrefs(JSON.parse(saved));
      setScrollEnabled(true);
    });
    return unsub;
  }, [nav]);

  /* persist schedule whenever it changes */
  useEffect(() => {
    AsyncStorage.setItem("scheduleItems", JSON.stringify(schedules));
  }, [schedules]);

  /* ───────────────────────── build auto-items for a day ───────────────────────── */
  const buildDefault = () => {
    const base  = day.clone().startOf("day");
    const used  = new Set<string>();
    const slots = ["09:00", "12:00", "18:00", "20:00"];

    const takeSlot = (pref: string) => {
      if (!used.has(pref)) {
        used.add(pref);
        return pref;
      }
      const start = slots.indexOf(pref);
      for (let i = 1; i <= slots.length; i++) {
        const s = slots[(start + i) % slots.length];
        if (!used.has(s)) {
          used.add(s);
          return s;
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

    /* meals (only today) */
    if (day.isSame(dayjs(), "day")) {
      todayMeals.forEach((meal: any, idx: number) => {
        const pref = prefs.mealTimes[meal.mealType] || slots[idx] || "09:00";
        items.push({
          id:    `meal-${idx}-${meal.name}`,
          title: meal.name,
          time:  timeToDate(base, takeSlot(pref)),
          type:  "meal",
          refId: meal.id,
        });
      });
    }

    /* workout */
    const diff = day.startOf("day").diff(dayjs().startOf("day"), "day");
    if (diff >= 0 && diff < weekWorkouts.length) {
      const w = weekWorkouts[diff];
      items.push({
        id:    `workout-${diff}-${w.name}`,
        title: w.name,
        time:  timeToDate(base, takeSlot(prefs.workoutTime)),
        type:  "workout",
        refId: w.id,
      });
    }

    return items.sort((a, b) => a.time.valueOf() - b.time.valueOf());
  };

  /* ───────────────────────── merge auto items with saved ones ───────────────────────── */
  useEffect(() => {
    const auto = buildDefault();
    setSchedules(prev => {
      const existing = prev[dayKey] || [];
      const events   = existing.filter(it => it.type === "event");
      const merged   = auto.map(it => {
        const found = existing.find(ex => ex.id === it.id);
        return found ? { ...it, time: found.time } : it;
      });
      return {
        ...prev,
        [dayKey]: [...merged, ...events].sort(
          (a, b) => a.time.valueOf() - b.time.valueOf(),
        ),
      };
    });
  }, [dayKey, mealsKey, workoutsKey, prefs]);

  /* ───────────────────────── helpers ───────────────────────── */
  const items = schedules[dayKey] || [];
  itemsRef.current = items;
  dayRef.current   = day;

  const minutesToTop = (d: dayjs.Dayjs) =>
    d.diff(day.startOf("day"), "minute") * (HOUR_HEIGHT / 60);

  const updateItem = (updated: any) => {
    setSchedules(prev => ({
      ...prev,
      [dayKey]: prev[dayKey]
        .map(it => (it.id === updated.id ? updated : it))
        .sort((a, b) => a.time.valueOf() - b.time.valueOf()),
    }));
  };
  updateRef.current = updateItem;

  const deleteItem = (id: string) => {
    setSchedules(prev => ({
      ...prev,
      [dayKey]: prev[dayKey].filter(it => it.id !== id),
    }));
  };

  /* ───────────────────────── PANRESPONDER factory ───────────────────────── */
  const getResponder = (id: string) => {
    if (!responders.current[id]) {
      responders.current[id] = PanResponder.create({
        /* We let ScrollView handle the gesture UNTIL the user long-presses */
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: () => activeDrag.current?.id === id,

        onPanResponderGrant: (_, g) => {
          startYRef.current = g.y0;
        },
        onPanResponderMove: (_, g) => {
          if (activeDrag.current?.id !== id) return;
          activeDrag.current.moved = true;
          setDragOffset(g.moveY - startYRef.current);
        },
        onPanResponderRelease: (_, g) => {
          if (activeDrag.current?.id === id && activeDrag.current.moved) {
            const original = itemsRef.current.find(i => i.id === id);
            if (original) {
              const movedMin =
                ((g.moveY - startYRef.current) / HOUR_HEIGHT) * 60;
              const newMin = clamp(
                snap(minutesToTop(original.time) + movedMin),
                0,
                24 * 60 - SNAP,
              );
              const newTime = dayRef.current
                .startOf("day")
                .add(newMin, "minute");
              updateRef.current({ ...original, time: newTime });
            }
          }
          /* reset */
          activeDrag.current = null;
          setDraggingId(null);
          setDragOffset(0);
          setScrollEnabled(true);
        },
        onPanResponderTerminationRequest: () => false,
        onPanResponderTerminate: (_, g) =>
          responders.current[id].panHandlers.onPanResponderRelease(_, g),
      });
    }
    return responders.current[id];
  };

  /* ───────────────────────── add / long-press timeline ───────────────────────── */
  const handleAdd = () => {
    const noon = day.clone().startOf("day").add(12, "hour");
    const newItem = {
      id:    `event-${Date.now()}`,
      title: "New Event",
      time:  noon,
      type:  "event",
    };
    setSchedules(prev => ({
      ...prev,
      [dayKey]: [...items, newItem].sort(
        (a, b) => a.time.valueOf() - b.time.valueOf(),
      ),
    }));
    nav.navigate("ScheduleDetails", {
      item: { ...newItem, time: noon.toISOString() },
      onUpdate: updateItem,
      onDelete: deleteItem,
      onCancelNew: deleteItem,
      isNew: true,
    });
  };

  const handleLongPressTimeline = (e: any) => {
    const y = e.nativeEvent.locationY;
    const minutes = snap((y / HOUR_HEIGHT) * 60);
    const newItem = {
      id:    `event-${Date.now()}`,
      title: "New Event",
      time:  day.startOf("day").add(minutes, "minute"),
      type:  "event",
    };
    setSchedules(prev => ({
      ...prev,
      [dayKey]: [...items, newItem].sort(
        (a, b) => a.time.valueOf() - b.time.valueOf(),
      ),
    }));
    nav.navigate("ScheduleDetails", {
      item: { ...newItem, time: newItem.time.toISOString() },
      onUpdate: updateItem,
      onDelete: deleteItem,
      onCancelNew: deleteItem,
      isNew: true,
    });
  };

  /* ───────────────────────── week swipe ───────────────────────── */
  const handleWeekSwipe = ({ nativeEvent }: any) => {
    if (nativeEvent.translationX < -50) {
      setWeekStart(weekStart.add(1, "week"));
      setDay(day.add(1, "week"));
    } else if (nativeEvent.translationX > 50) {
      setWeekStart(weekStart.subtract(1, "week"));
      setDay(day.subtract(1, "week"));
    }
  };

  /* ───────────────────────── RENDER ───────────────────────── */
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 px-5">
        {/* header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Schedule</Text>
          <View className="flex-row gap-4">
            <TouchableOpacity onPress={handleAdd}>
              <Ionicons name="add" size={22} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => nav.navigate("ScheduleSettings")}>
              <Ionicons name="settings-outline" size={22} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* week header */}
        <PanGestureHandler onEnded={handleWeekSwipe}>
          <View className="flex-row justify-between py-2 mb-2">
            {weekDays.map(d => (
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

        {/* timeline */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ height: HOUR_HEIGHT * 24 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={scrollEnabled}
        >
          <Pressable
            style={{ flex: 1, position: "relative" }}
            onLongPress={handleLongPressTimeline}
          >
            {/* hour grid lines */}
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

            {/* items */}
            {items.map(item => {
              const isDragging = draggingId === item.id;
              const top =
                minutesToTop(item.time) + (isDragging ? dragOffset : 0);
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
                    delayLongPress={400}
                    onLongPress={() => {
                      /* arm drag */
                      activeDrag.current = { id: item.id, moved: false };
                      setDraggingId(item.id);
                      setScrollEnabled(false);
                    }}
                    onPress={() => {
                      if (!activeDrag.current) {
                        nav.navigate("ScheduleDetails", {
                          item: { ...item, time: item.time.toISOString() },
                          onUpdate: updateItem,
                          onDelete: deleteItem,
                          onCancelNew: deleteItem,
                          isNew: false,
                        });
                      }
                    }}
                    className="p-3"
                  >
                    <Text className="text-white font-semibold">
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
