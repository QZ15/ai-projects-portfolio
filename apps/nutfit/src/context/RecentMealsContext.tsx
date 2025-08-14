// src/context/RecentMealsContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";

interface RecentMealsContextProps {
  recentMeals: any[];
  addRecentMeal: (meal: any) => void;
  clearRecentMeals: () => void;
}

const RecentMealsContext = createContext<RecentMealsContextProps | null>(null);

export const RecentMealsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentMeals, setRecentMeals] = useState<any[]>([]);
  const uidRef = useRef<string | null>(auth.currentUser?.uid ?? null);

  const keyFor = (uid: string) => `@nutfit:${uid}:recentMeals`;

  useEffect(() => {
    let unsub: (() => void) | undefined;
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (unsub) unsub();
      uidRef.current = user?.uid ?? null;
      setRecentMeals([]);
      if (!user) return;
      const uid = user.uid;
      const cacheKey = keyFor(uid);

      try {
        const raw = await AsyncStorage.getItem(cacheKey);
        if (raw) setRecentMeals(JSON.parse(raw));
      } catch {}

      const colRef = collection(db, "users", uid, "recentMeals");
      unsub = onSnapshot(colRef, (snap) => {
        const arr = snap.docs
          .map((d) => d.data() as any)
          .sort((a, b) => (b.updatedAt?.toMillis?.() || 0) - (a.updatedAt?.toMillis?.() || 0));
        const trimmed = arr.slice(0, 10);
        setRecentMeals(trimmed);
        AsyncStorage.setItem(cacheKey, JSON.stringify(trimmed));
      });

      const snapDocs = await getDocs(colRef);
      if (snapDocs.empty) {
        const legacy = await AsyncStorage.getItem("recentMeals");
        if (legacy) {
          try {
            const parsed = JSON.parse(legacy);
            await Promise.all(
              parsed.map((m: any) =>
                setDoc(doc(db, "users", uid, "recentMeals", m.name), m, { merge: true })
              )
            );
          } catch {}
          await AsyncStorage.removeItem("recentMeals");
        }
      }
    });
    return () => {
      if (unsub) unsub();
      unsubAuth();
    };
  }, []);

  const addRecentMeal = async (meal: any) => {
    const uid = uidRef.current;
    if (!uid) return;
    const colRef = collection(db, "users", uid, "recentMeals");
    await setDoc(doc(colRef, meal.name), { ...meal, updatedAt: serverTimestamp() }, { merge: true });
    const extras = recentMeals.filter((m) => m.name !== meal.name).slice(9);
    for (const e of extras) {
      await deleteDoc(doc(colRef, e.name));
    }
  };

  const clearRecentMeals = async () => {
    const uid = uidRef.current;
    if (!uid) return;
    const colRef = collection(db, "users", uid, "recentMeals");
    await Promise.all(recentMeals.map((m) => deleteDoc(doc(colRef, m.name))));
    setRecentMeals([]);
    await AsyncStorage.removeItem(keyFor(uid));
  };

  return (
    <RecentMealsContext.Provider value={{ recentMeals, addRecentMeal, clearRecentMeals }}>
      {children}
    </RecentMealsContext.Provider>
  );
};

export const useRecentMeals = () => {
  const ctx = useContext(RecentMealsContext);
  if (!ctx) throw new Error("useRecentMeals must be used inside RecentMealsProvider");
  return ctx;
};
