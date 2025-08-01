// src/context/TodayMealsContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";

const TodayMealsContext = createContext(null);

export const TodayMealsProvider = ({ children }) => {
  const [todayMeals, setTodayMeals] = useState<any[]>([]);
  const [lastReset, setLastReset] = useState<string>("");
  const [purchasedItems, setPurchasedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem("todayMeals");
      const date = await AsyncStorage.getItem("lastReset");
      const purchased = await AsyncStorage.getItem("purchasedItems");
      if (saved && date === dayjs().format("YYYY-MM-DD")) {
        setTodayMeals(JSON.parse(saved));
      }
      if (purchased) {
        try {
          setPurchasedItems(JSON.parse(purchased));
        } catch {
          setPurchasedItems({});
        }
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const now = dayjs().format("YYYY-MM-DD");
    if (lastReset !== now) {
      setTodayMeals([]);
      setLastReset(now);
      AsyncStorage.setItem("lastReset", now);
    }
    AsyncStorage.setItem("todayMeals", JSON.stringify(todayMeals));
  }, [todayMeals]);

  useEffect(() => {
    AsyncStorage.setItem("purchasedItems", JSON.stringify(purchasedItems));
  }, [purchasedItems]);

  const addToToday = (meal: any) => {
    setTodayMeals((prev) => {
      if (prev.find((m) => m.name === meal.name)) return prev;
      return [...prev, meal];
    });
  };

  const removeFromToday = (meal: any) => {
    setTodayMeals((prev) => prev.filter((m) => m.name !== meal.name));
  };

  const parseIngredient = (ing: any) => {
    let name = "";
    let quantity = "";
    if (typeof ing === "string") {
      const match = ing.match(/^([\d\.]+)\s*(\w+)?\s*(.*)$/);
      if (match) {
        quantity = `${match[1]}${match[2] ? ` ${match[2]}` : ""}`;
        name = match[3].trim();
      } else {
        name = ing;
      }
    } else {
      name = (ing.item || ing.name || "").trim();
      quantity = ing.quantity || "";
    }
    const qm = String(quantity).match(/^([\d\.]+)\s*(.*)$/);
    return {
      name,
      amount: qm ? parseFloat(qm[1]) : 0,
      unit: qm ? qm[2].trim() : "",
    };
  };

  const groceryList = useMemo(() => {
    const map: Record<string, { name: string; amount: number; unit: string }> = {};
    todayMeals.forEach((meal) => {
      (meal.ingredients || []).forEach((ing: any) => {
        const { name, amount, unit } = parseIngredient(ing);
        if (!name) return;
        const key = `${name}|${unit}`;
        if (!map[key]) map[key] = { name, amount: 0, unit };
        map[key].amount += amount;
      });
    });
    return Object.values(map).map((v) => ({
      name: v.name,
      quantity: v.amount ? `${v.amount}${v.unit ? ` ${v.unit}` : ""}` : "",
    }));
  }, [todayMeals]);

  const togglePurchased = (name: string) => {
    setPurchasedItems((prev) => {
      const updated = { ...prev };
      if (updated[name]) delete updated[name];
      else updated[name] = true;
      return updated;
    });
  };

  const clearPurchased = () => {
    setPurchasedItems({});
  };

  return (
    <TodayMealsContext.Provider
      value={{
        todayMeals,
        addToToday,
        removeFromToday,
        groceryList,
        purchasedItems,
        togglePurchased,
        clearPurchased,
      }}
    >
      {children}
    </TodayMealsContext.Provider>
  );
};

export const useTodayMeals = () => {
  const ctx = useContext(TodayMealsContext);
  if (!ctx) throw new Error("useTodayMeals must be used inside TodayMealsProvider");
  return ctx;
};
