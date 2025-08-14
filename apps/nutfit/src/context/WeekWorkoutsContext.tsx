import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";

interface Workout {
  name: string;
  [key: string]: any;
}

interface Ctx {
  weekWorkouts: Workout[];
  addToWeek: (w: Workout) => void;
  removeFromWeek: (w: Workout) => void;
}

const WeekWorkoutsContext = createContext<Ctx | null>(null);

export const WeekWorkoutsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weekWorkouts, setWeekWorkouts] = useState<Workout[]>([]);
  const uidRef = useRef<string | null>(auth.currentUser?.uid ?? null);

  const keyFor = (uid: string) => `@nutfit:${uid}:weekWorkouts`;

  useEffect(() => {
    let unsub: (() => void) | undefined;
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (unsub) unsub();
      uidRef.current = user?.uid ?? null;
      setWeekWorkouts([]);
      if (!user) return;
      const uid = user.uid;
      const cacheKey = keyFor(uid);

      try {
        const raw = await AsyncStorage.getItem(cacheKey);
        if (raw) setWeekWorkouts(JSON.parse(raw));
      } catch {}

      const colRef = collection(db, "users", uid, "weekWorkouts");
      unsub = onSnapshot(colRef, (snap) => {
        const arr = snap.docs.map((d) => d.data() as Workout);
        setWeekWorkouts(arr);
        AsyncStorage.setItem(cacheKey, JSON.stringify(arr));
      });

      const snapDocs = await getDocs(colRef);
      if (snapDocs.empty) {
        const legacy = await AsyncStorage.getItem("weekWorkouts");
        if (legacy) {
          try {
            const parsed = JSON.parse(legacy);
            await Promise.all(
              parsed.map((m: Workout) =>
                setDoc(doc(db, "users", uid, "weekWorkouts", m.name), m, { merge: true })
              )
            );
          } catch {}
          await AsyncStorage.removeItem("weekWorkouts");
        }
      }
    });
    return () => {
      if (unsub) unsub();
      unsubAuth();
    };
  }, []);

  const addToWeek = async (w: Workout) => {
    const uid = uidRef.current;
    if (!uid) return;
    const exists = weekWorkouts.find((m) => m.name === w.name);
    if (exists) return;
    await setDoc(doc(db, "users", uid, "weekWorkouts", w.name), w, { merge: true });
  };

  const removeFromWeek = async (w: Workout) => {
    const uid = uidRef.current;
    if (!uid) return;
    await deleteDoc(doc(db, "users", uid, "weekWorkouts", w.name));
  };

  return (
    <WeekWorkoutsContext.Provider value={{ weekWorkouts, addToWeek, removeFromWeek }}>
      {children}
    </WeekWorkoutsContext.Provider>
  );
};

export const useWeekWorkouts = () => {
  const ctx = useContext(WeekWorkoutsContext);
  if (!ctx) throw new Error("useWeekWorkouts must be used within provider");
  return ctx;
};
