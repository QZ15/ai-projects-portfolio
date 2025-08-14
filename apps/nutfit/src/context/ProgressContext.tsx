import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

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

const LEGACY_ENTRIES = "@nutfit:progress:entries";
const LEGACY_HEIGHT  = "@nutfit:progress:heightInInches";

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
};

export const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const [entries, setEntries] = useState<FullEntry[]>([]);
  const [heightInInches, _setHeight] = useState<number | undefined>(undefined);
  const uidRef = useRef<string | null>(auth.currentUser?.uid ?? null);

  const keyFor = (uid: string, k: string) => `@nutfit:${uid}:progress:${k}`;

  useEffect(() => {
    let unsubEntries: (() => void) | undefined;
    let unsubHeight: (() => void) | undefined;
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (unsubEntries) unsubEntries();
      if (unsubHeight) unsubHeight();
      uidRef.current = user?.uid || null;
      setEntries([]);
      _setHeight(undefined);

      if (!user) return;
      const uid = user.uid;
      const entriesKey = keyFor(uid, "entries");
      const heightKey = keyFor(uid, "heightInInches");

      // load cache
      try {
        const raw = await AsyncStorage.getItem(entriesKey);
        if (raw) {
          const parsed: FullEntry[] = JSON.parse(raw);
          setEntries(parsed.sort((a, b) => a.date.localeCompare(b.date)));
        }
      } catch {}
      try {
        const h = await AsyncStorage.getItem(heightKey);
        if (h) _setHeight(parseFloat(h));
      } catch {}

      const colRef = collection(db, "users", uid, "progress");
      unsubEntries = onSnapshot(colRef, (snap) => {
        const arr = snap.docs.map(d => d.data() as FullEntry);
        arr.sort((a, b) => a.date.localeCompare(b.date));
        setEntries(arr);
        AsyncStorage.setItem(entriesKey, JSON.stringify(arr));
      });

      const heightRef = doc(db, "users", uid, "progressMeta", "settings");
      unsubHeight = onSnapshot(heightRef, (snap) => {
        const h = snap.data()?.heightInInches;
        if (typeof h === "number") {
          _setHeight(h);
          AsyncStorage.setItem(heightKey, String(h));
        }
      });

      // migration if Firestore empty
      const snapDocs = await getDocs(colRef);
      if (snapDocs.empty) {
        const legacyRaw = await AsyncStorage.getItem(LEGACY_ENTRIES);
        if (legacyRaw) {
          try {
            const parsed: FullEntry[] = JSON.parse(legacyRaw);
            await Promise.all(parsed.map(e => setDoc(doc(db, "users", uid, "progress", e.date), e, { merge: true })));
          } catch {}
          await AsyncStorage.removeItem(LEGACY_ENTRIES);
        }
      }
      const heightSnap = await getDoc(heightRef);
      if (!heightSnap.exists()) {
        const legacyH = await AsyncStorage.getItem(LEGACY_HEIGHT);
        if (legacyH) {
          await setDoc(heightRef, { heightInInches: parseFloat(legacyH) }, { merge: true });
          await AsyncStorage.removeItem(LEGACY_HEIGHT);
        }
      }
    });
    return () => {
      if (unsubEntries) unsubEntries();
      if (unsubHeight) unsubHeight();
      unsubAuth();
    };
  }, []);

  const setHeightInInches = async (inches: number) => {
    _setHeight(inches);
    const uid = uidRef.current;
    if (!uid) return;
    const heightRef = doc(db, "users", uid, "progressMeta", "settings");
    await setDoc(heightRef, { heightInInches: inches }, { merge: true });
    await AsyncStorage.setItem(keyFor(uid, "heightInInches"), String(inches));
  };

  const addEntry = async (entry: FullEntry) => {
    const uid = uidRef.current;
    if (!uid) return;
    const date = entry.date || new Date().toISOString().split("T")[0];
    const existing = entries.find(e => e.date === date);
    const merged: FullEntry = { ...(existing || { date }), ...entry, date };
    const updated = [...entries.filter(e => e.date !== date), merged].sort((a, b) => a.date.localeCompare(b.date));
    setEntries(updated);
    await setDoc(doc(db, "users", uid, "progress", date), merged, { merge: true });
    await AsyncStorage.setItem(keyFor(uid, "entries"), JSON.stringify(updated));
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
