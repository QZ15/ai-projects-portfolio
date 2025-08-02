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

const formatTime = (iso?: string) => (iso ? dayjs(iso).format("h:mm A") : "Set time");

export default function Scheduler() {
  const { todayMeals } = useTodayMeals();
  const { weekWorkouts } = useWeekWorkouts();

  const [customEvents, setCustomEvents] = useState<ScheduleItem[]>([]);
  const [meta, setMeta] = useState<Record<string, { time?: string; reminder?: boolean; notificationId?: string }>>({});
  const [order, setOrder] = useState<string[]>([]);
  const [data, setData] = useState<ScheduleItem[]>([]);
  const [picker, setPicker] = useState<{ id: string; date: Date } | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState<Date | null>(null);
  const [eventReminder, setEventReminder] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
    if (e) setCustomEvents(JSON.parse(e));
    if (m) setMeta(JSON.parse(m));
    if (o) setOrder(JSON.parse(o));
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

  const buildData = () => {
    let items: ScheduleItem[] = [];

    todayMeals.forEach((meal: any) => {
      const id = `meal-${meal.name}`;
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

    setData(items);
  };

  const handleDragEnd = ({ data }: { data: ScheduleItem[] }) => {
    setData(data);
    saveOrder(data.map((i) => i.id));
  };

  const handleTimePick = (id: string) => {
    const d = meta[id]?.time ? dayjs(meta[id].time).toDate() : new Date();
    setPicker({ id, date: d });
  };

  const onTimeChange = (_: any, selected?: Date) => {
    if (!picker) return;
    const date = selected || picker.date;
    if (picker.id === "new") {
      setEventTime(date);
    } else {
      const info = { ...meta[picker.id], time: date.toISOString() };
      saveMeta({ ...meta, [picker.id]: info });
    }
    setPicker(null);
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
        handleTimePick(item.id);
        return;
      }
      const trigger = dayjs(info.time).toDate();
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: { title: item.title },
        trigger,
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
        trigger: eventTime,
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
          item.type === "event" ? openAddModal(item) : handleTimePick(item.id)
        }
        onLongPress={drag}
        className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
      >
        <View>
          <Text className="text-white font-medium">{item.title}</Text>
          {item.detail && (
            <Text className="text-gray-400 text-xs mt-0.5">{item.detail}</Text>
          )}
          <Text className="text-gray-500 text-xs mt-0.5">
            {formatTime(meta[item.id]?.time)}
          </Text>
        </View>
        <TouchableOpacity onPress={() => toggleReminder(item)}>
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
          className="absolute bottom-5 right-5 bg-blue-600 p-4 rounded-full"
          onPress={() => openAddModal()}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {picker && (
        <DateTimePicker
          value={picker.date}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onTimeChange}
        />
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
                setPicker({ id: "new", date: d });
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
