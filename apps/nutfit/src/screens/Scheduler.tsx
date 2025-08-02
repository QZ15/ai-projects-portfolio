import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Switch,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { useTodayMeals } from "../context/TodayMealsContext";
import { useWeekWorkouts } from "../context/WeekWorkoutsContext";
import * as Notifications from "expo-notifications";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { Swipeable } from "react-native-gesture-handler";

type ScheduleItem = {
  id: string;
  type: "meal" | "workout" | "event";
  title: string;
  detail?: string;
  time?: string;
  reminder?: boolean;
  notificationId?: string;
};

const EVENTS_KEY = "scheduleEvents";
const META_KEY = "scheduleMeta";
const ORDER_KEY = "scheduleOrder";
const DEFAULTS_KEY = "scheduleDefaults";

const formatTime = (iso?: string) => (iso ? dayjs(iso).format("h:mm A") : "Set time");

export default function Scheduler() {
  const { todayMeals } = useTodayMeals();
  const { weekWorkouts } = useWeekWorkouts();

  const [customEvents, setCustomEvents] = useState<ScheduleItem[]>([]);
  const [meta, setMeta] = useState<Record<string, { time?: string; reminder?: boolean; notificationId?: string }>>({});
  const [order, setOrder] = useState<string[]>([]);
  const [data, setData] = useState<ScheduleItem[]>([]);
  const [timePicker, setTimePicker] =
    useState<{
      id: string;
      type: "meal" | "workout" | "event";
      date: Date;
    } | null>(null);
  const [tempDate, setTempDate] = useState(new Date());
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState<Date | null>(null);
  const [eventReminder, setEventReminder] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [defaults, setDefaults] = useState<{
    meals: Record<string, string>;
    workout?: string;
  }>({ meals: {} });

  useEffect(() => {
    load();
    Notifications.requestPermissionsAsync();
  }, []);

  useEffect(() => {
    buildData();
  }, [todayMeals, weekWorkouts, customEvents, meta, order]);

  const load = async () => {
    const e = await AsyncStorage.getItem(EVENTS_KEY);
    const m = await AsyncStorage.getItem(META_KEY);
    const o = await AsyncStorage.getItem(ORDER_KEY);
    const d = await AsyncStorage.getItem(DEFAULTS_KEY);
    if (e) setCustomEvents(JSON.parse(e));
    if (m) setMeta(JSON.parse(m));
    if (o) setOrder(JSON.parse(o));
    if (d) setDefaults(JSON.parse(d));
  };

  const saveEvents = (evts: ScheduleItem[]) => {
    setCustomEvents(evts);
    AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(evts));
  };

  const saveMeta = (m: typeof meta) => {
    setMeta(m);
    AsyncStorage.setItem(META_KEY, JSON.stringify(m));
  };

  const saveOrder = (o: string[]) => {
    setOrder(o);
    AsyncStorage.setItem(ORDER_KEY, JSON.stringify(o));
  };

  const saveDefaults = (d: typeof defaults) => {
    setDefaults(d);
    AsyncStorage.setItem(DEFAULTS_KEY, JSON.stringify(d));
  };

  const buildData = () => {
    let items: ScheduleItem[] = [];

    let updatedMeta: typeof meta | null = null;
    todayMeals.forEach((meal: any) => {
      const id = `meal-${meal.name}`;
      if (!meta[id]?.time && defaults.meals[meal.mealType]) {
        updatedMeta = {
          ...(updatedMeta || meta),
          [id]: { ...meta[id], time: defaults.meals[meal.mealType] },
        };
      }
      items.push({
        id,
        type: "meal",
        title: meal.name,
        detail: meal.mealType,
        ...(meta[id] || {}),
      });
    });

    weekWorkouts.slice(0, 1).forEach((w: any, idx: number) => {
      const id = `workout-${w.name}-${idx}`;
      if (!meta[id]?.time && defaults.workout) {
        updatedMeta = {
          ...(updatedMeta || meta),
          [id]: { ...meta[id], time: defaults.workout },
        };
      }
      items.push({
        id,
        type: "workout",
        title: w.name,
        detail: w.workoutType,
        ...(meta[id] || {}),
      });
    });

    customEvents.forEach((ev) => {
      items.push({
        ...ev,
        ...(meta[ev.id] || {}),
      });
    });

    items.sort((a, b) => {
      const t1 = a.time ? dayjs(a.time).valueOf() : Infinity;
      const t2 = b.time ? dayjs(b.time).valueOf() : Infinity;
      return t1 - t2;
    });

    if (order.length) {
      items.sort((a, b) => {
        const ia = order.indexOf(a.id);
        const ib = order.indexOf(b.id);
        if (ia === -1 && ib === -1) return 0;
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      });
    }

    if (updatedMeta) {
      saveMeta(updatedMeta);
    }
    setData(items);
  };

  const handleDragEnd = ({ data }: { data: ScheduleItem[] }) => {
    setData(data);
    saveOrder(data.map((i) => i.id));
  };

  const handleTimePick = (item: ScheduleItem) => {
    const d = meta[item.id]?.time
      ? dayjs(meta[item.id].time).toDate()
      : new Date();
    setTempDate(d);
    setSetAsDefault(false);
    setTimePicker({ id: item.id, type: item.type, date: d });
  };

  const savePickedTime = async () => {
    if (!timePicker) return;
    const date = tempDate;
    if (timePicker.id === "new") {
      setEventTime(date);
      setTimePicker(null);
      return;
    }
    const info = { ...meta[timePicker.id], time: date.toISOString() };
    if (info.reminder && info.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(info.notificationId);
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: { title: data.find((d) => d.id === timePicker.id)?.title || "" },
        trigger: { type: "date", date },
      });
      info.notificationId = notificationId;
    }
    const newMeta = { ...meta, [timePicker.id]: info };
    saveMeta(newMeta);

    if (setAsDefault) {
      if (timePicker.type === "meal") {
        const mealType = data.find((d) => d.id === timePicker.id)?.detail;
        if (mealType) {
          saveDefaults({
            ...defaults,
            meals: { ...defaults.meals, [mealType]: date.toISOString() },
          });
        }
      } else if (timePicker.type === "workout") {
        saveDefaults({ ...defaults, workout: date.toISOString() });
      }
    }

    setTimePicker(null);
  };

  const toggleReminder = async (item: ScheduleItem) => {
    const info = meta[item.id] || {};
    if (info.reminder) {
      if (info.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(info.notificationId);
      }
      saveMeta({ ...meta, [item.id]: { ...info, reminder: false, notificationId: undefined } });
    } else {
      if (!info.time) {
        handleTimePick(item);
        return;
      }
      const triggerDate = dayjs(info.time).toDate();
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: { title: item.title },
        trigger: { type: "date", date: triggerDate },
      });
      saveMeta({
        ...meta,
        [item.id]: { ...info, reminder: true, notificationId },
      });
    }
  };

  const openAddModal = (ev?: ScheduleItem) => {
    if (ev) {
      setEventTitle(ev.title);
      setEventTime(meta[ev.id]?.time ? dayjs(meta[ev.id].time).toDate() : null);
      setEventReminder(meta[ev.id]?.reminder || false);
      setEditingId(ev.id);
    } else {
      setEventTitle("");
      setEventTime(null);
      setEventReminder(false);
      setEditingId(null);
    }
    setShowEventModal(true);
  };

  const saveEvent = async () => {
    if (!eventTitle.trim()) {
      setShowEventModal(false);
      return;
    }
    let id = editingId || `event-${Date.now()}`;
    let updatedEvents = [...customEvents];
    if (editingId) {
      updatedEvents = updatedEvents.map((ev) =>
        ev.id === id ? { ...ev, title: eventTitle } : ev
      );
    } else {
      updatedEvents.push({ id, type: "event", title: eventTitle });
      if (!order.includes(id)) saveOrder([...order, id]);
    }
    saveEvents(updatedEvents);

    const prev = meta[id];
    if (prev?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(prev.notificationId);
    }

    const m = {
      ...meta,
      [id]: {
        time: eventTime ? eventTime.toISOString() : undefined,
        reminder: eventReminder,
      },
    } as typeof meta;

    if (eventReminder && eventTime) {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: { title: eventTitle },
        trigger: { type: "date", date: eventTime },
      });
      m[id].notificationId = notificationId;
    }

    saveMeta(m);
    setShowEventModal(false);
  };

  const deleteEvent = async (id: string) => {
    const m = { ...meta } as typeof meta;
    if (m[id]?.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(m[id].notificationId!);
    }
    delete m[id];
    saveMeta(m);
    saveEvents(customEvents.filter((e) => e.id !== id));
    saveOrder(order.filter((o) => o !== id));
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      className="bg-red-600 justify-center px-4 m-1 rounded-lg"
      onPress={() => deleteEvent(id)}
    >
      <Ionicons name="trash" size={20} color="#fff" />
    </TouchableOpacity>
  );

  const renderItem = ({ item, drag }: RenderItemParams<ScheduleItem>) => (
    <Swipeable
      enabled={item.type === "event"}
      renderRightActions={() => renderRightActions(item.id)}
    >
      <TouchableOpacity
        onPress={() =>
          item.type === "event" ? openAddModal(item) : handleTimePick(item)
        }
        onLongPress={drag}
        className="bg-neutral-900 p-4 rounded-2xl flex-row items-center mb-3"
      >
        <View className="flex-1">
          <Text className="text-white font-medium">{item.title}</Text>
          {item.detail && (
            <Text className="text-gray-400 text-xs mt-0.5">{item.detail}</Text>
          )}
          <Text className="text-gray-500 text-xs mt-0.5">
            {formatTime(meta[item.id]?.time)}
          </Text>
        </View>
        <TouchableOpacity
          className="ml-3"
          onPress={() => toggleReminder(item)}
        >
          <Ionicons
            name={meta[item.id]?.reminder ? "notifications" : "notifications-outline"}
            size={20}
            color={meta[item.id]?.reminder ? "#fff" : "#6B7280"}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 px-5">
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Schedule</Text>
        </View>

        <DraggableFlatList
          data={data}
          keyExtractor={(item) => item.id}
          onDragEnd={handleDragEnd}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        <TouchableOpacity
          className="absolute bottom-5 right-5 bg-emerald-600 p-4 rounded-full"
          onPress={() => openAddModal()}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {timePicker && (
        <Modal transparent animationType="fade">
          <View className="flex-1 justify-center bg-black/60 px-5">
            <View className="bg-neutral-900 p-5 rounded-2xl">
              <DateTimePicker
                value={tempDate}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_, d) => d && setTempDate(d)}
              />
              {timePicker.type !== "event" && (
                <View className="flex-row items-center mt-3">
                  <Switch value={setAsDefault} onValueChange={setSetAsDefault} />
                  <Text className="text-white ml-2">Set as default</Text>
                </View>
              )}
              <View className="flex-row justify-end mt-3">
                <TouchableOpacity
                  className="mr-4"
                  onPress={() => setTimePicker(null)}
                >
                  <Text className="text-gray-400">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={savePickedTime}>
                  <Text className="text-blue-500">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <Modal visible={showEventModal} transparent animationType="slide">
        <View className="flex-1 justify-center bg-black/60 px-5">
          <View className="bg-neutral-900 p-5 rounded-2xl">
            <Text className="text-white text-lg font-semibold mb-3">
              {editingId ? "Edit Event" : "Add Event"}
            </Text>
            <TextInput
              className="bg-neutral-800 text-white p-3 rounded-lg mb-3"
              placeholder="Title"
              placeholderTextColor="#9CA3AF"
              value={eventTitle}
              onChangeText={setEventTitle}
            />
            <TouchableOpacity
              className="bg-neutral-800 p-3 rounded-lg mb-3"
              onPress={() => {
                const d = eventTime || new Date();
                setTempDate(d);
                setTimePicker({ id: "new", type: "event", date: d });
              }}
            >
              <Text className="text-white">
                {eventTime ? dayjs(eventTime).format("h:mm A") : "Set time"}
              </Text>
            </TouchableOpacity>
            <View className="flex-row items-center mb-3">
              <Switch value={eventReminder} onValueChange={setEventReminder} />
              <Text className="text-white ml-2">Reminder</Text>
            </View>
            <View className="flex-row justify-end">
              <TouchableOpacity className="mr-4" onPress={() => setShowEventModal(false)}>
                <Text className="text-gray-400">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveEvent}>
                <Text className="text-blue-500">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
