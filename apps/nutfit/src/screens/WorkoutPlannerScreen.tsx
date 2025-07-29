import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function WorkoutPlannerScreen() {
  const navigation = useNavigation();

  // Sample workouts
  const workouts = [
    {
      name: "Pull Day",
      exercises: [
        { name: "Deadlift", sets: 4, reps: "6-8" },
        { name: "Pull-ups", sets: 3, reps: "8-10" },
      ],
      duration: "55-65 min",
      image:
        "https://images.unsplash.com/photo-1605296867304-46d5465a13f1",
    },
    {
      name: "Leg Day",
      exercises: [
        { name: "Squats", sets: 4, reps: "8-10" },
        { name: "Lunges", sets: 3, reps: "10-12" },
      ],
      duration: "50-55 min",
    },
    {
      name: "Push Day",
      exercises: [
        { name: "Bench Press", sets: 4, reps: "6-8" },
        { name: "Shoulder Press", sets: 3, reps: "8-10" },
      ],
      duration: "60 min",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">
            Workout Planner
          </Text>
          <TouchableOpacity className="p-2 bg-neutral-900 rounded-xl">
            <Ionicons name="menu-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* AI Workout Plan */}
        <TouchableOpacity className="bg-neutral-900 p-4 rounded-2xl mb-3 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons
              name="apps-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 10 }}
            />
            <View>
              <Text className="text-white font-semibold">AI Workout Plan</Text>
              <Text className="text-gray-400 text-xs">
                Generate a workout plan with AI
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>

        {/* Switch Routine */}
        <TouchableOpacity className="bg-neutral-900 p-4 rounded-2xl mb-6 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons
              name="add-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 10 }}
            />
            <View>
              <Text className="text-white font-semibold">Switch Routine</Text>
              <Text className="text-gray-400 text-xs">
                Choose a different workout split
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </TouchableOpacity>

        {/* Today’s Workout */}
        <Text className="text-gray-300 text-sm font-semibold mb-3">
          Today’s Workout
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              "WorkoutDetails" as never,
              {
                workoutName: workouts[0].name,
                exercises: workouts[0].exercises,
                duration: workouts[0].duration,
              } as never
            )
          }
          className="bg-neutral-900 rounded-2xl overflow-hidden mb-6"
        >
          <Image
            source={{
              uri: workouts[0].image,
            }}
            className="w-full h-40"
            resizeMode="cover"
          />
          <View className="p-4">
            <Text className="text-white font-semibold">{workouts[0].name}</Text>
            <Text className="text-gray-400 text-xs">
              {workouts[0].exercises.length} exercises • {workouts[0].duration}
            </Text>
          </View>
        </TouchableOpacity>

        {/* History */}
        <Text className="text-gray-300 text-sm font-semibold mb-3">
          History
        </Text>

        {/* Weekdays Tabs */}
        <View className="flex-row justify-between mb-3">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
            <Text
              key={idx}
              className={`${
                day === "Thu" ? "text-blue-400" : "text-gray-400"
              } font-semibold`}
            >
              {day}
            </Text>
          ))}
        </View>

        {/* Workout History Cards */}
        {workouts.slice(1).map((workout, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() =>
              navigation.navigate(
                "WorkoutDetails" as never,
                {
                  workoutName: workout.name,
                  exercises: workout.exercises,
                  duration: workout.duration,
                } as never
              )
            }
            className="bg-neutral-900 p-4 rounded-2xl mb-3 flex-row items-center"
          >
            <Ionicons name="calendar-outline" size={18} color="#fff" />
            <View className="ml-3">
              <Text className="text-white font-semibold">{workout.name}</Text>
              <Text className="text-gray-400 text-xs">
                {workout.exercises.length} exercises • {workout.duration}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
