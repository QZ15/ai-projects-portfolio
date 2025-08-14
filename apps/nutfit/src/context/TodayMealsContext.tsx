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
import pluralize from "pluralize";

type TodayMeal = any & { completed?: boolean }; // preserve loose typing across app

const TodayMealsContext = createContext<any>(null);

export const TodayMealsProvider = ({ children }: { children: React.ReactNode }) => {
  const [todayMeals, setTodayMeals] = useState<TodayMeal[]>([]);
  const [lastReset, setLastReset] = useState<string>("");
  const [purchasedItems, setPurchasedItems] = useState<Record<string, boolean>>({});
  const [pantryItems, setPantryItems] = useState<string[]>([]);
  const [extraItems, setExtraItems] = useState<{ name: string; amount: number; unit: string }[]>([]);
  const [initialized, setInitialized] = useState(false);

  /* ─────────────── load saved state ─────────────── */
  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem("todayMeals");
      const date = await AsyncStorage.getItem("lastReset");
      const purchased = await AsyncStorage.getItem("purchasedItems");
      const pantry = await AsyncStorage.getItem("pantryItems");
      const extras = await AsyncStorage.getItem("extraGroceries");

      if (date) {
        setLastReset(date);
        if (saved && date === dayjs().format("YYYY-MM-DD")) {
          try {
            const parsed: TodayMeal[] = JSON.parse(saved);
            // ensure completed defaults to false for older entries
            setTodayMeals(parsed.map(m => ({ completed: false, ...m })));
          } catch {
            setTodayMeals([]);
          }
        }
      }

      if (purchased) {
        try { setPurchasedItems(JSON.parse(purchased)); } catch { setPurchasedItems({}); }
      }

      if (pantry) {
        try { setPantryItems(JSON.parse(pantry)); } catch { setPantryItems([]); }
      }

      if (extras) {
        try { setExtraItems(JSON.parse(extras)); } catch { setExtraItems([]); }
      }

      setInitialized(true);
    };

    loadData();
  }, []);

  /* ─────────────── persist meals + daily reset ─────────────── */
  useEffect(() => {
    if (!initialized) return;
    const now = dayjs().format("YYYY-MM-DD");
    if (lastReset !== now) {
      setTodayMeals([]);
      setLastReset(now);
      AsyncStorage.setItem("lastReset", now);
    }
    AsyncStorage.setItem("todayMeals", JSON.stringify(todayMeals));
  }, [todayMeals, lastReset, initialized]);

  /* ─────────────── persist other state ─────────────── */
  useEffect(() => { if (initialized) AsyncStorage.setItem("purchasedItems", JSON.stringify(purchasedItems)); }, [purchasedItems, initialized]);
  useEffect(() => { if (initialized) AsyncStorage.setItem("pantryItems", JSON.stringify(pantryItems)); }, [pantryItems, initialized]);
  useEffect(() => { if (initialized) AsyncStorage.setItem("extraGroceries", JSON.stringify(extraItems)); }, [extraItems, initialized]);

  /* ─────────────── meals add/remove (preserving API) ─────────────── */
  const addToToday = (meal: TodayMeal) => {
    setTodayMeals(prev => {
      if (prev.find((m) => m.name === meal.name)) return prev;
      const next = [...prev, { completed: meal.completed ?? false, ...meal }];
      return next;
    });
  };

  const removeFromToday = (meal: TodayMeal) => {
    setTodayMeals(prev => prev.filter((m) => m.name !== meal.name));
  };

  /* ─────────────── completion helpers (NEW) ─────────────── */
  const setCompletedByName = (name: string, value: boolean | "toggle") => {
    setTodayMeals(prev =>
      prev.map(m =>
        m.name === name
          ? { ...m, completed: value === "toggle" ? !m.completed : value }
          : m
      )
    );
  };

  const markCompleted = (name: string) => setCompletedByName(name, true);
  const markIncomplete = (name: string) => setCompletedByName(name, false);
  const toggleCompleted = (name: string) => setCompletedByName(name, "toggle");
  const isCompleted = (nameOrMeal: string | TodayMeal) => {
    const name = typeof nameOrMeal === "string" ? nameOrMeal : nameOrMeal?.name;
    const found = todayMeals.find(m => m.name === name);
    return !!found?.completed;
  };

  /* ─────────────── grocery helpers (unchanged) ─────────────── */
  const normalizeName = (n: string) => pluralize.singular(String(n || "").trim().toLowerCase());

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
      name: normalizeName(name),
      amount: qm ? parseFloat(qm[1]) : 0,
      unit: qm ? qm[2].trim() : "",
    };
  };

  const getGroup = (name: string) => {
    const groups = [
      { group: "Produce", keywords: ["apple","banana","orange","lettuce","spinach","kale","carrot","broccoli","cucumber","tomato","onion","pepper","garlic","potato","avocado","berry","grape","pear","celery","cabbage","mushroom"] },
      { group: "Meat & Seafood", keywords: ["chicken","beef","pork","lamb","turkey","fish","salmon","tuna","shrimp","crab","lobster","ham","bacon","sausage"] },
      { group: "Dairy", keywords: ["milk","cheese","butter","yogurt","cream","egg"] },
      { group: "Bakery", keywords: ["bread","bagel","bun","roll","cake","cookie","muffin","tortilla"] },
      { group: "Frozen Foods", keywords: ["frozen","ice cream","nugget","pizza","popsicle"] },
    ];
    const found = groups.find((g) => g.keywords.some((k) => name.includes(k)));
    return found ? found.group : "Grocery";
  };

  const groceryList = useMemo(() => {
    const map: Record<string, { name: string; amount: number; unit: string; group: string }> = {};
    todayMeals.forEach((meal) => {
      (meal.ingredients || []).forEach((ing: any) => {
        const { name, amount, unit } = parseIngredient(ing);
        if (!name) return;
        const key = `${name}|${unit}`;
        if (!map[key]) map[key] = { name, amount: 0, unit, group: getGroup(name) };
        map[key].amount += amount;
      });
    });
    extraItems.forEach(({ name, amount, unit }) => {
      if (!name) return;
      const key = `${name}|${unit}`;
      if (!map[key]) map[key] = { name, amount: 0, unit, group: getGroup(name) };
      map[key].amount += amount;
    });
    return Object.values(map).map((v) => ({
      name: v.name,
      display: v.name.charAt(0).toUpperCase() + v.name.slice(1),
      quantity: v.amount ? `${v.amount}${v.unit ? ` ${v.unit}` : ""}` : "",
      group: v.group,
    }));
  }, [todayMeals, extraItems]);

  const todayGroceries = useMemo(
    () => groceryList.filter((g) => !pantryItems.includes(g.name)),
    [groceryList, pantryItems]
  );

  const inPantry = useMemo(
    () => groceryList.filter((g) => pantryItems.includes(g.name)),
    [groceryList, pantryItems]
  );

  useEffect(() => {
    setPurchasedItems((prev) => {
      const valid = new Set(todayGroceries.map((i) => i.name));
      const next: Record<string, boolean> = {};
      valid.forEach((n) => {
        if (prev[n]) next[n] = true;
      });
      return next;
    });
  }, [todayGroceries]);

  const togglePurchased = (name: string) => {
    setPurchasedItems((prev) => {
      const updated = { ...prev };
      if (updated[name]) delete updated[name];
      else updated[name] = true;
      return updated;
    });
  };

  const clearPurchased = () => setPurchasedItems({});

  const addPantryItem = (name: string) => {
    const base = normalizeName(name);
    if (!base) return;
    setPantryItems((prev) => (prev.includes(base) ? prev : [...prev, base]));
  };

  const removePantryItem = (name: string) => {
    setPantryItems((prev) => prev.filter((n) => n !== name));
  };

  const addGroceryItem = (text: string) => {
    const { name, amount, unit } = parseIngredient(text);
    if (!name) return;
    setExtraItems((prev) => [...prev, { name, amount, unit }]);
  };

  const removeGroceryItem = (name: string) => {
    setExtraItems((prev) => prev.filter((i) => i.name !== name));
  };

  return (
    <TodayMealsContext.Provider
      value={{
        /* existing */
        todayMeals,
        addToToday,
        removeFromToday,
        groceryList,
        todayGroceries,
        inPantry,
        pantryItems,
        addPantryItem,
        removePantryItem,
        extraItems,
        addGroceryItem,
        removeGroceryItem,
        purchasedItems,
        togglePurchased,
        clearPurchased,
        /* new completion helpers */
        markCompleted,
        markIncomplete,
        toggleCompleted,
        isCompleted,
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
