import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type WeightEntry = { date: string; weight: number }; // lbs

export type FullEntry = {
  date: string;            // YYYY-MM-DD
  weight?: number;         // lbs
  bodyFatPct?: number;     // %
  muscleMassPct?: number;  // %
  bmi?: number;            // optional, some scales provide directly
};

type ProgressContextType = {
  // legacy (used by chart)
  weightData: WeightEntry[];
  addWeightEntry: (entry: WeightEntry) => Promise<void>;

  // new
  entries: FullEntry[];
  addEntry: (entry: FullEntry) => Promise<void>;
  addBodyFat: (date: string, bodyFatPct: number) => Promise<void>;
  addMuscleMass: (date: string, muscleMassPct: number) => Promise<void>;
  addBMI: (date: string, bmi: number) => Promise<void>;
  heightInInches?: number;
  setHeightInInches: (inches: number) => Promise<void>;
};

const STORAGE_ENTRIES = "@nutfit:progress:entries";
const STORAGE_HEIGHT  = "@nutfit:progress:heightInInches";

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
};

export const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const [entries, setEntries] = useState<FullEntry[]>([]);
  const [heightInInches, _setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_ENTRIES);
        if (raw) {
          const parsed: FullEntry[] = JSON.parse(raw);
          setEntries(parsed.sort((a, b) => a.date.localeCompare(b.date)));
        }
      } catch {}
      try {
        const h = await AsyncStorage.getItem(STORAGE_HEIGHT);
        if (h) _setHeight(parseFloat(h));
      } catch {}
    })();
  }, []);

  const persistEntries = async (data: FullEntry[]) =>
    AsyncStorage.setItem(STORAGE_ENTRIES, JSON.stringify(data));

  const setHeightInInches = async (inches: number) => {
    _setHeight(inches);
    await AsyncStorage.setItem(STORAGE_HEIGHT, String(inches));
  };

  const addEntry = async (entry: FullEntry) => {
    const date = entry.date || new Date().toISOString().split("T")[0];
    const existing = entries.find(e => e.date === date);
    const merged: FullEntry = { ...(existing || { date }), ...entry, date };
    const updated = [...entries.filter(e => e.date !== date), merged].sort(
      (a, b) => a.date.localeCompare(b.date)
    );
    setEntries(updated);
    await persistEntries(updated);
  };

  const addWeightEntry = async (entry: WeightEntry) => {
    await addEntry({ date: entry.date, weight: entry.weight });
  };
  const addBodyFat = async (date: string, bodyFatPct: number) =>
    addEntry({ date, bodyFatPct });
  const addMuscleMass = async (date: string, muscleMassPct: number) =>
    addEntry({ date, muscleMassPct });
  const addBMI = async (date: string, bmi: number) =>
    addEntry({ date, bmi });

  const weightData: WeightEntry[] = entries
    .filter(e => typeof e.weight === "number")
    .map(e => ({ date: e.date, weight: e.weight as number }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <ProgressContext.Provider
      value={{
        weightData,
        addWeightEntry,
        entries,
        addEntry,
        addBodyFat,
        addMuscleMass,
        addBMI,
        heightInInches,
        setHeightInInches,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
