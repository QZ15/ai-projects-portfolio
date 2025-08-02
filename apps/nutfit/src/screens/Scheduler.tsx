import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PanGestureHandler } from "react-native-gesture-handler";
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
  const [weekStart, setWeekStart] = useState(day.startOf("week"));

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day")),
    [weekStart]
  );

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
          <TouchableOpacity>
            <Ionicons name="add" size={22} color="#9CA3AF" />
          </TouchableOpacity>
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
        >
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

            {items.map((item) => (
              <View
                key={item.id}
                className="absolute bg-neutral-900 rounded-xl p-3"
                style={{
                  top: minutesToTop(item.time),
                  left: 56,
                  right: 0,
                }}
              >
                <Text className="text-white font-semibold">{item.title}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

