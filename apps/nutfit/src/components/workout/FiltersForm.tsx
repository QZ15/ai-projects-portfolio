import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Switch, TouchableOpacity, ScrollView } from "react-native";
import { useWorkoutFilters } from "../../context/WorkoutFilterContext";
import { useNavigation } from "@react-navigation/native";

interface Props { showRequestedWorkout?: boolean; showDaysPerWeek?: boolean }

export default function WorkoutFiltersForm({ showRequestedWorkout, showDaysPerWeek = true }: Props) {
  const { filters, setFilters } = useWorkoutFilters();
  const navigation = useNavigation();

  const [fitnessGoalEnabled, setFitnessGoalEnabled] = useState(filters.fitnessGoalEnabled);
  const [fitnessGoal, setFitnessGoal] = useState(filters.fitnessGoal || "Maintain");

  const [workoutTypeEnabled, setWorkoutTypeEnabled] = useState(filters.workoutTypeEnabled);
  const [workoutType, setWorkoutType] = useState(filters.workoutType || "Strength");

  const [equipmentEnabled, setEquipmentEnabled] = useState(filters.equipmentEnabled);
  const [equipment, setEquipment] = useState(filters.equipment.join(", "));

  const [daysPerWeekEnabled, setDaysPerWeekEnabled] = useState(filters.daysPerWeekEnabled);
  const [daysPerWeek, setDaysPerWeek] = useState(String(filters.daysPerWeek || 3));

  const [timePerWorkoutEnabled, setTimePerWorkoutEnabled] = useState(filters.timePerWorkoutEnabled);
  const [timePerWorkout, setTimePerWorkout] = useState(String(filters.timePerWorkout || 60));

  const [muscleGroupsEnabled, setMuscleGroupsEnabled] = useState(filters.muscleGroupsEnabled);
  const [muscleGroups, setMuscleGroups] = useState(filters.muscleGroups.join(", "));

  const [excludedExercisesEnabled, setExcludedExercisesEnabled] = useState(filters.excludedExercisesEnabled);
  const [excludedExercises, setExcludedExercises] = useState(filters.excludedExercises.join(", "));

  const [requestedWorkoutEnabled, setRequestedWorkoutEnabled] = useState(filters.requestedWorkoutEnabled);
  const [requestedWorkout, setRequestedWorkout] = useState(filters.requestedWorkout || "");

  const handleSave = () => {
    setFilters({
      fitnessGoal,
      workoutType,
      equipment: equipment.split(",").map((s) => s.trim()).filter(Boolean),
      daysPerWeek: parseInt(daysPerWeek) || 3,
      timePerWorkout: parseInt(timePerWorkout) || 60,
      muscleGroups: muscleGroups.split(",").map((s) => s.trim()).filter(Boolean),
      excludedExercises: excludedExercises.split(",").map((s) => s.trim()).filter(Boolean),
      requestedWorkout: requestedWorkoutEnabled ? requestedWorkout : "",
      fitnessGoalEnabled,
      workoutTypeEnabled,
      equipmentEnabled,
      daysPerWeekEnabled,
      timePerWorkoutEnabled,
      muscleGroupsEnabled,
      excludedExercisesEnabled,
      requestedWorkoutEnabled,
    });
    navigation.goBack();
  };

  const renderRow = (
    label: string,
    value: string,
    setValue: (v: string) => void,
    enabled: boolean,
    setEnabled: (v: boolean) => void,
    placeholder?: string
  ) => (
    <View className="bg-neutral-900 p-4 rounded-2xl mb-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-white text-lg font-semibold">{label}</Text>
        <Switch value={enabled} onValueChange={setEnabled} trackColor={{ false: "#6B7280", true: "#a3a3a3" }} />
      </View>
      {enabled && (
        <TextInput
          className="bg-neutral-800 text-white p-3 rounded-xl"
          placeholder={placeholder || ""}
          placeholderTextColor="#6B7280"
          value={value}
          onChangeText={setValue}
        />
      )}
    </View>
  );

  return (
    <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 40 }}>
      {renderRow("Fitness Goal", fitnessGoal, setFitnessGoal, fitnessGoalEnabled, setFitnessGoalEnabled, "e.g. Cut")}
      {renderRow("Workout Type", workoutType, setWorkoutType, workoutTypeEnabled, setWorkoutTypeEnabled, "Strength")}
      {renderRow("Equipment", equipment, setEquipment, equipmentEnabled, setEquipmentEnabled, "comma separated")}
      {showDaysPerWeek && renderRow("Days/Week", daysPerWeek, setDaysPerWeek, daysPerWeekEnabled, setDaysPerWeekEnabled, "3")}
      {renderRow("Time per Workout", timePerWorkout, setTimePerWorkout, timePerWorkoutEnabled, setTimePerWorkoutEnabled, "60")}
      {renderRow("Muscle Groups", muscleGroups, setMuscleGroups, muscleGroupsEnabled, setMuscleGroupsEnabled, "comma separated")}
      {renderRow("Excluded Exercises", excludedExercises, setExcludedExercises, excludedExercisesEnabled, setExcludedExercisesEnabled, "comma separated")}
      {showRequestedWorkout &&
        renderRow("Requested Workout", requestedWorkout, setRequestedWorkout, requestedWorkoutEnabled, setRequestedWorkoutEnabled, "Push Day")}
      <TouchableOpacity onPress={handleSave} className="bg-white p-4 rounded-2xl mt-4 mb-10">
        <Text className="text-black text-center font-semibold">Save Filters</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
