import React from "react";
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTodayMeals } from "../context/TodayMealsContext";

export default function GroceryListScreen({ navigation }) {
  const { groceryList, purchasedItems, togglePurchased, clearPurchased } = useTodayMeals();

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row justify-between items-center mt-3 px-5">
        <Text className="text-white text-[28px] font-bold">Grocery List</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView
        className="flex-1 px-5 mt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {groceryList.map((item) => (
          <TouchableOpacity
            key={item.name + item.quantity}
            onPress={() => togglePurchased(item.name)}
            className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
          >
            <Text
              className={`text-white text-base ${purchasedItems[item.name] ? "line-through text-gray-500" : ""}`}
            >
              {item.quantity ? `${item.quantity} ` : ""}{item.name}
            </Text>
            <Ionicons
              name={purchasedItems[item.name] ? "checkbox-outline" : "square-outline"}
              size={20}
              color={purchasedItems[item.name] ? "#22c55e" : "#6B7280"}
            />
          </TouchableOpacity>
        ))}
        {groceryList.length === 0 && (
          <Text className="text-gray-400 text-center mt-10">
            No ingredients for today.
          </Text>
        )}
      </ScrollView>
      {groceryList.length > 0 && (
        <View className="px-5 mb-5">
          <TouchableOpacity
            onPress={clearPurchased}
            className="bg-neutral-900 p-4 rounded-2xl items-center"
          >
            <Text className="text-red-400 font-semibold">Clear Purchased Items</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
