import React, { useState, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTodayMeals } from "../context/TodayMealsContext";

export default function GroceryListScreen({ navigation }) {
  const {
    todayGroceries,
    inPantry,
    pantryItems,
    addPantryItem,
    removePantryItem,
    purchasedItems,
    togglePurchased,
    clearPurchased,
  } = useTodayMeals();

  const [showToday, setShowToday] = useState(true);
  const [showInPantry, setShowInPantry] = useState(true);
  const [showPantry, setShowPantry] = useState(false);
  const [newItem, setNewItem] = useState("");

  const groupedGroceries = useMemo(() => {
    const groups: Record<string, typeof todayGroceries> = {};
    todayGroceries.forEach((item) => {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    });
    return groups;
  }, [todayGroceries]);

  const renderGroceryItem = (item: any) => (
    <View
      key={item.name + item.quantity}
      className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
    >
      <Text
        className={`text-white text-base ${purchasedItems[item.name] ? "line-through text-gray-500" : ""}`}
      >
        {item.quantity ? `${item.quantity} ` : ""}{item.display}
      </Text>
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => togglePurchased(item.name)}>
          <Ionicons
            name={purchasedItems[item.name] ? "checkbox-outline" : "square-outline"}
            size={20}
            color={purchasedItems[item.name] ? "#22c55e" : "#6B7280"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => addPantryItem(item.name)} className="ml-3">
          <Ionicons name="archive-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSimpleItem = (item: any) => (
    <View
      key={item.name + (item.quantity || "")}
      className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
    >
      <Text className="text-white text-base">
        {item.quantity ? `${item.quantity} ` : ""}{item.display || item.name.charAt(0).toUpperCase() + item.name.slice(1)}
      </Text>
    </View>
  );

  const handleAddPantry = () => {
    if (!newItem.trim()) return;
    addPantryItem(newItem);
    setNewItem("");
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex-row justify-between items-center mt-3 mb-6">
          <Text className="text-white text-[28px] font-bold">Grocery List</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Today's Groceries */}
        <TouchableOpacity
          onPress={() => { LayoutAnimation.easeInEaseOut(); setShowToday(!showToday); }}
          className="flex-row justify-between items-center"
        >
          <Text className="text-white text-lg font-semibold mt-6 mb-3">
            Today's Groceries ({todayGroceries.length})
          </Text>
          <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
        {showToday && todayGroceries.length > 0 && (
          <View style={{ maxHeight: todayGroceries.length > 6 ? 450 : undefined }}>
            <ScrollView>
              {Object.entries(groupedGroceries).map(([group, items]) => (
                <View key={group}>
                  <Text className="text-white font-semibold mt-4 mb-2">{group}</Text>
                  {items.map(renderGroceryItem)}
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={clearPurchased}
              className="bg-neutral-900 p-4 rounded-2xl items-center mt-4"
            >
              <Text className="text-red-400 font-semibold">Clear Purchased Items</Text>
            </TouchableOpacity>
          </View>
        )}
        {showToday && todayGroceries.length === 0 && (
          <Text className="text-gray-400">No groceries needed.</Text>
        )}

        {/* In Pantry */}
        <TouchableOpacity
          onPress={() => { LayoutAnimation.easeInEaseOut(); setShowInPantry(!showInPantry); }}
          className="flex-row justify-between items-center"
        >
          <Text className="text-white text-lg font-semibold mt-6 mb-3">
            In Pantry ({inPantry.length})
          </Text>
          <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
        {showInPantry && inPantry.length > 0 && (
          <View style={{ maxHeight: inPantry.length > 6 ? 450 : undefined }}>
            <ScrollView>{inPantry.map(renderSimpleItem)}</ScrollView>
          </View>
        )}
        {showInPantry && inPantry.length === 0 && (
          <Text className="text-gray-400">No items from pantry needed.</Text>
        )}

        {/* Pantry */}
        <TouchableOpacity
          onPress={() => { LayoutAnimation.easeInEaseOut(); setShowPantry(!showPantry); }}
          className="flex-row justify-between items-center"
        >
          <Text className="text-white text-lg font-semibold mt-6 mb-3">
            Pantry ({pantryItems.length})
          </Text>
          <Ionicons name="filter-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
        {showPantry && (
          <View>
            <View className="flex-row items-center mb-3">
              <TextInput
                value={newItem}
                onChangeText={setNewItem}
                placeholder="Add item"
                placeholderTextColor="#9CA3AF"
                className="flex-1 bg-neutral-900 text-white p-3 rounded-2xl mr-3"
              />
              <TouchableOpacity onPress={handleAddPantry}>
                <Ionicons name="add-circle-outline" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={{ maxHeight: pantryItems.length > 6 ? 300 : undefined }}>
              <ScrollView>
                {pantryItems.map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => removePantryItem(p)}
                    className="bg-neutral-900 p-4 rounded-2xl flex-row justify-between items-center mb-3"
                  >
                    <Text className="text-white text-base">
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </Text>
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
