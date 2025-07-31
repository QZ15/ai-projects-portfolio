// src/components/FiltersForm.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from "react-native";
import Slider from "@react-native-community/slider";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMealFilters } from "../../context/MealFilterContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

interface FiltersFormProps {
  showMealsPerDay?: boolean;
  showRequestedDish?: boolean;
  showIngredients?: boolean;  // NEW
}

export default function FiltersForm({ showMealsPerDay, showRequestedDish, showIngredients }: FiltersFormProps) {
  const { filters, setFilters } = useMealFilters();
  const navigation = useNavigation();

  // Main state
  const [fitnessGoal, setFitnessGoal] = useState(filters.fitnessGoal || "Maintain");
  const [budgetLevel, setBudgetLevel] = useState(filters.budgetLevel || "Medium");
  const [prepStyle, setPrepStyle] = useState(filters.prepStyle || "Standard");

  // Macros
  const [macrosEnabled, setMacrosEnabled] = useState(filters.macrosEnabled);
  const [calories, setCalories] = useState(filters.calories || 2000);
  const [protein, setProtein] = useState(filters.protein || 150);
  const [carbs, setCarbs] = useState(filters.carbs || 200);
  const [fat, setFat] = useState(filters.fat || 70);

  // Meals per day
  const [mealsPerDay, setMealsPerDay] = useState(filters.mealsPerDay || 4);

  // Cooking time
  const [cookingEnabled, setCookingEnabled] = useState(filters.cookingEnabled);
  const [cookingTime, setCookingTime] = useState(filters.cookingTime || 30);

  // Budget
  const [budgetEnabled, setBudgetEnabled] = useState(filters.budgetEnabled);

  // Prep Style
  const [prepEnabled, setPrepEnabled] = useState(filters.prepEnabled);

  // Preferences/dislikes
  const [preferencesList, setPreferencesList] = useState<string[]>([]);
  const [dislikesList, setDislikesList] = useState<string[]>([]);
  const [newPreference, setNewPreference] = useState("");
  const [newDislike, setNewDislike] = useState("");

  // Ingredients List
  const [ingredientsList, setIngredientsList] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [ingredientsEnabled, setIngredientsEnabled] = useState(filters.ingredientsEnabled);
  const [requestedDishEnabled, setRequestedDishEnabled] = useState(filters.requestedDishEnabled);

  // 🔹 Load preferences, dislikes, and toggles from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const savedPrefs = await AsyncStorage.getItem("preferences");
        const savedDislikes = await AsyncStorage.getItem("dislikes");
        const savedToggles = await AsyncStorage.getItem("filterToggles");
        const savedIngredients = await AsyncStorage.getItem("ingredients");

        setPreferencesList(savedPrefs ? JSON.parse(savedPrefs) : []);
        setDislikesList(savedDislikes ? JSON.parse(savedDislikes) : []);
        setIngredientsList(savedIngredients ? JSON.parse(savedIngredients) : []);

        if (calories < 1000) setCalories(1000);
        if (calories > 6000) setCalories(6000);

        const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

        setCalories(clamp(filters.calories || 2000, 1000, 6000));
        setProtein(clamp(filters.protein || 150, 50, 300));
        setCarbs(clamp(filters.carbs || 200, 50, 500));
        setFat(clamp(filters.fat || 70, 20, 200));

        if (savedToggles) {
          const toggles = JSON.parse(savedToggles);
          setMacrosEnabled(toggles.macros);
          setBudgetEnabled(toggles.budget);
          setCookingEnabled(toggles.cooking);
          setPrepEnabled(toggles.prep);
          if (toggles.ingredients !== undefined) setIngredientsEnabled(toggles.ingredients);
          if (toggles.requestedDish !== undefined) setRequestedDishEnabled(toggles.requestedDish);
        }
      } catch (e) {
        console.error("Error loading filters", e);
      }
    })();
  }, []);

  // 🔹 Save toggles to AsyncStorage
  const saveToggles = async (
    newValues: Partial<{
      macros: boolean;
      budget: boolean;
      cooking: boolean;
      prep: boolean;
      ingredients: boolean;
      requestedDish: boolean;
    }>
  ) => {
    const toggles = {
      macros: macrosEnabled,
      budget: budgetEnabled,
      cooking: cookingEnabled,
      prep: prepEnabled,
      ingredients: ingredientsEnabled,
      requestedDish: requestedDishEnabled,
      ...newValues,
    };
    await AsyncStorage.setItem("filterToggles", JSON.stringify(toggles));
  };

  // 🔹 Save filters
  const handleSave = async () => {
    setFilters({
      ...filters,
      fitnessGoal,
      budgetLevel,
      prepStyle,
      calories,
      protein,
      carbs,
      fat,
      mealsPerDay,
      cookingTime,
      preferences: preferencesList,
      dislikes: dislikesList,
      ingredients: ingredientsList,
      macrosEnabled,
      budgetEnabled,
      cookingEnabled,
      prepEnabled,
      ingredientsEnabled,
      requestedDishEnabled,
    });
    await saveToggles({});
    await AsyncStorage.setItem("ingredients", JSON.stringify(ingredientsList));
    navigation.goBack();
  };

  // Add item to preferences/dislikes
  const addItem = async (type: "preferences" | "dislikes", value: string) => {
    if (!value.trim()) return;
    if (type === "preferences") {
      const updated = [...preferencesList, value.trim()];
      setPreferencesList(updated);
      await AsyncStorage.setItem("preferences", JSON.stringify(updated));
      setNewPreference("");
    } else {
      const updated = [...dislikesList, value.trim()];
      setDislikesList(updated);
      await AsyncStorage.setItem("dislikes", JSON.stringify(updated));
      setNewDislike("");
    }
  };

  // Remove item from preferences/dislikes
  const removeItem = async (type: "preferences" | "dislikes", index: number) => {
    if (type === "preferences") {
      const updated = preferencesList.filter((_, i) => i !== index);
      setPreferencesList(updated);
      await AsyncStorage.setItem("preferences", JSON.stringify(updated));
    } else {
      const updated = dislikesList.filter((_, i) => i !== index);
      setDislikesList(updated);
      await AsyncStorage.setItem("dislikes", JSON.stringify(updated));
    }
  };

  // UI helpers
  const renderOptionGroup = (title: string, options: string[], selected: string, setSelected: (v: string) => void, enabled?: boolean, setEnabled?: (v: boolean) => void) => (
    <View className="bg-neutral-900 p-4 rounded-2xl mb-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-white text-lg font-semibold">{title}</Text>
        {setEnabled && <Switch value={enabled} onValueChange={setEnabled} trackColor={{ false: "#6B7280", true: "#a3a3a3" }} />}
      </View>
      {(!setEnabled || enabled) && (
        <View className="flex-row justify-between">
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              className={`flex-1 mx-1 p-3 rounded-xl ${selected === opt ? "bg-white" : "bg-neutral-800"}`}
              onPress={() => setSelected(opt)}
            >
              <Text className={`text-center ${selected === opt ? "text-black font-semibold" : "text-white"}`}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderSlider = (label: string, value: number, setValue: (v: number) => void, min: number, max: number, step: number) => (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-gray-300 capitalize">{label}</Text>
        <TextInput
          className="bg-neutral-800 text-white px-3 py-1 rounded-xl w-16 text-center"
          keyboardType="numeric"
          value={String(value)}
          onChangeText={(val) => {
            const num = Number(val) || min;
            setValue(Math.min(Math.max(num, min), max)); // clamp inline
          }}
        />
      </View>
      <Slider
        minimumValue={min}
        maximumValue={max}
        step={step}
        minimumTrackTintColor="#9CA3AF"
        maximumTrackTintColor="#3F3F46"
        thumbTintColor="#fff"
        value={value}
        onValueChange={(v) => setValue(Math.min(Math.max(v, min), max))}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5 mt-[-36px]">

        {/* Requested Dish */}
        {showRequestedDish && (
          <View className="bg-neutral-900 p-4 rounded-2xl mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-white text-lg font-semibold">Requested Dish</Text>
              <Switch
                value={requestedDishEnabled}
                onValueChange={setRequestedDishEnabled}
                trackColor={{ false: "#6B7280", true: "#a3a3a3" }}
              />
            </View>
            {requestedDishEnabled && (
              <TextInput
                className="bg-neutral-800 text-white p-3 rounded-xl"
                placeholder="e.g. Hakka Chili Chicken"
                placeholderTextColor="#6B7280"
                value={filters.requestedDish || ""}
                onChangeText={(t) => setFilters({ ...filters, requestedDish: t })}
              />
            )}
          </View>
        )}

        {/* Ingredient Filter */}
        {showIngredients && (
          <View className="bg-neutral-900 p-4 rounded-2xl mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-white text-lg font-semibold">Ingredients</Text>
              <Switch
                value={ingredientsEnabled}
                onValueChange={setIngredientsEnabled}
                trackColor={{ false: "#6B7280", true: "#a3a3a3" }}
              />
            </View>
            {ingredientsEnabled && (
              <>
                <View className="flex-row mt-3">
                  <TextInput
                    className="flex-1 bg-neutral-800 text-white p-3 rounded-xl mr-2"
                    placeholder="Add ingredient..."
                    placeholderTextColor="#6B7280"
                    value={newIngredient}
                    onChangeText={setNewIngredient}
                  />
                  <TouchableOpacity
                    className="bg-white px-4 rounded-xl justify-center"
                    onPress={async () => {
                      if (!newIngredient.trim()) return;
                      const updated = [...ingredientsList, newIngredient.trim()];
                      setIngredientsList(updated);
                      setNewIngredient("");
                      await AsyncStorage.setItem("ingredients", JSON.stringify(updated));
                    }}
                  >
                    <Text className="text-black font-semibold">Add</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row flex-wrap gap-2 mt-4">
                  {ingredientsList.map((ing, idx) => (
                    <View key={idx} className="bg-neutral-800 rounded-full px-3 py-1 flex-row items-center">
                      <Text className="text-white mr-2">{ing}</Text>
                      <TouchableOpacity
                        onPress={async () => {
                          const updated = ingredientsList.filter((_, i) => i !== idx);
                          setIngredientsList(updated);
                          await AsyncStorage.setItem("ingredients", JSON.stringify(updated));
                        }}
                      >
                        <Ionicons name="close" size={14} color="#9CA3AF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        )}


        {/* Fitness Goal */}
        {renderOptionGroup("Fitness Goal", ["Cut", "Maintain", "Bulk"], fitnessGoal, setFitnessGoal)}

        {/* Macros */}
        <View className="bg-neutral-900 p-4 rounded-2xl mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-white text-lg font-semibold">Macros</Text>
            <Switch value={macrosEnabled} onValueChange={setMacrosEnabled} trackColor={{ false: "#6B7280", true: "#a3a3a3" }} />
          </View>
          {macrosEnabled && (
            <>
              {renderSlider("Calories", calories, setCalories, 1000, 6000, 50)}
              {renderSlider("Protein", protein, setProtein, 50, 300, 5)}
              {renderSlider("Carbs", carbs, setCarbs, 50, 500, 5)}
              {renderSlider("Fat", fat, setFat, 20, 200, 1)}
            </>
          )}
        </View>

        {/* Meals Per Day */}
        {showMealsPerDay && (
          <View className="bg-neutral-900 p-4 rounded-2xl mb-4">
            {renderSlider("Meals Per Day", mealsPerDay, setMealsPerDay, 2, 6, 1)}
          </View>
        )}

        {/* Preferences */}
        <View className="bg-neutral-900 p-4 rounded-2xl mb-4">
          <Text className="text-white text-lg font-semibold mb-2">Preferences</Text>
          <View className="flex-row mt-3">
            <TextInput
              className="flex-1 bg-neutral-800 text-white p-3 rounded-xl mr-2"
              placeholder="Add preference..."
              placeholderTextColor="#6B7280"
              value={newPreference}
              onChangeText={setNewPreference}
            />
            <TouchableOpacity className="bg-white px-4 rounded-xl justify-center" onPress={() => addItem("preferences", newPreference)}>
              <Text className="text-black font-semibold">Add</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap gap-2 mt-4">
            {preferencesList.map((pref, idx) => (
              <View key={idx} className="bg-neutral-800 rounded-full px-3 py-1 flex-row items-center">
                <Text className="text-white mr-2">{pref}</Text>
                <TouchableOpacity onPress={() => removeItem("preferences", idx)}>
                  <Ionicons name="close" size={14} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Dislikes */}
        <View className="bg-neutral-900 p-4 rounded-2xl mb-4">
          <Text className="text-white text-lg font-semibold mb-2">Dislikes</Text>
          <View className="flex-row mt-3">
            <TextInput
              className="flex-1 bg-neutral-800 text-white p-3 rounded-xl mr-2"
              placeholder="Add dislike..."
              placeholderTextColor="#6B7280"
              value={newDislike}
              onChangeText={setNewDislike}
            />
            <TouchableOpacity className="bg-white px-4 rounded-xl justify-center" onPress={() => addItem("dislikes", newDislike)}>
              <Text className="text-black font-semibold">Add</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap gap-2 mt-4">
            {dislikesList.map((dislike, idx) => (
              <View key={idx} className="bg-neutral-800 rounded-full px-3 py-1 flex-row items-center">
                <Text className="text-white mr-2">{dislike}</Text>
                <TouchableOpacity onPress={() => removeItem("dislikes", idx)}>
                  <Ionicons name="close" size={14} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Budget */}
        {renderOptionGroup("Budget Level", ["Low", "Medium", "High"], budgetLevel, setBudgetLevel, budgetEnabled, setBudgetEnabled)}

        {/* Cooking Time */}
        <View className="bg-neutral-900 p-4 rounded-2xl mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-white text-lg font-semibold">Cooking Time</Text>
            <Switch value={cookingEnabled} onValueChange={setCookingEnabled} trackColor={{ false: "#6B7280", true: "#a3a3a3" }} />
          </View>
          {cookingEnabled && renderSlider("Minutes", cookingTime, setCookingTime, 5, 120, 5)}
        </View>

        {/* Prep Style */}
        <View className="bg-neutral-900 p-4 rounded-2xl mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-white text-lg font-semibold">Prep Style</Text>
            <Switch value={prepEnabled} onValueChange={setPrepEnabled} trackColor={{ false: "#6B7280", true: "#a3a3a3" }} />
          </View>
          {prepEnabled && (
            <TextInput
              className="bg-neutral-800 text-white p-3 rounded-xl"
              placeholder="e.g. Bulk, Meal Prep, Single Serving"
              placeholderTextColor="#6B7280"
              value={prepStyle}
              onChangeText={setPrepStyle}
            />
          )}
        </View>
        
        {/* Save */}
        <TouchableOpacity onPress={handleSave} className="bg-white p-4 rounded-2xl mt-4 mb-10">
          <Text className="text-black text-center font-semibold">Save Filters</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}