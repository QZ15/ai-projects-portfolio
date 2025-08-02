import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import dayjs from "dayjs";
import { useTodayMeals } from "../context/TodayMealsContext";
import { useWeekWorkouts } from "../context/WeekWorkoutsContext";

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
  const { todayMeals } = useTodayMeals();
  const { weekWorkouts } = useWeekWorkouts();
  const [day, setDay] = useState(dayjs());

  const items = useMemo(() => {
    const meals = todayMeals.map((meal: any) => ({
      id: `meal-${meal.name}`,
      title: meal.name,
      time: timeToDate(day.clone().startOf("day"), defaultMealTimes[meal.mealType] || "09:00"),
    }));

    const workouts = weekWorkouts.length
      ? [
          {
            id: `workout-${weekWorkouts[0].name}`,
            title: weekWorkouts[0].name,
            time: timeToDate(day.clone().startOf("day"), defaultWorkoutTime),
          },
        ]
      : [];

    return [...meals, ...workouts].sort((a, b) => a.time.valueOf() - b.time.valueOf());
  }, [todayMeals, weekWorkouts, day]);

  const minutesToTop = (date: dayjs.Dayjs) =>
    date.diff(day.startOf("day"), "minute") * (HOUR_HEIGHT / 60);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row items-center justify-between p-4 border-b border-neutral-800">
        <TouchableOpacity onPress={() => setDay(day.subtract(1, "day"))}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white font-semibold">{day.format("dddd, MMM D")}</Text>
        <TouchableOpacity onPress={() => setDay(day.add(1, "day"))}>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ height: HOUR_HEIGHT * 24 }}>
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
                <Text
                  style={{
                    width: 50,
                    color: "#666",
                    textAlign: "right",
                    paddingRight: 8,
                  }}
                >
                  {dayjs().hour(hour).format("h A")}
                </Text>
                <View style={{ flex: 1, borderTopWidth: 1, borderColor: "#333" }} />
              </View>
            </View>
          ))}

          {items.map((item) => (
            <View
              key={item.id}
              style={{
                position: "absolute",
                top: minutesToTop(item.time),
                left: 60,
                right: 16,
                backgroundColor: "#1f2937",
                padding: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>{item.title}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

