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

interface Workout { name: string; [key: string]: any; updatedAt?: any }
interface Ctx {
  recentWorkouts: Workout[];
  addRecentWorkout: (w: Workout) => void;
  clearRecentWorkouts: () => void;
}

const RecentWorkoutsContext = createContext<Ctx | null>(null);

export const RecentWorkoutsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const uidRef = useRef<string | null>(auth.currentUser?.uid ?? null);

  const keyFor = (uid: string) => `@nutfit:${uid}:recentWorkouts`;

  useEffect(() => {
    let unsub: (() => void) | undefined;
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (unsub) unsub();
      uidRef.current = user?.uid ?? null;
      setRecentWorkouts([]);
      if (!user) return;
      const uid = user.uid;
      const cacheKey = keyFor(uid);

      try {
        const raw = await AsyncStorage.getItem(cacheKey);
        if (raw) setRecentWorkouts(JSON.parse(raw));
      } catch {}

      const colRef = collection(db, "users", uid, "recentWorkouts");
      unsub = onSnapshot(colRef, (snap) => {
        const arr = snap.docs
          .map((d) => d.data() as Workout)
          .sort((a, b) => (b.updatedAt?.toMillis?.() || 0) - (a.updatedAt?.toMillis?.() || 0));
        const trimmed = arr.slice(0, 10);
        setRecentWorkouts(trimmed);
        AsyncStorage.setItem(cacheKey, JSON.stringify(trimmed));
      });

      const snapDocs = await getDocs(colRef);
      if (snapDocs.empty) {
        const legacy = await AsyncStorage.getItem("recentWorkouts");
        if (legacy) {
          try {
            const parsed = JSON.parse(legacy);
            await Promise.all(
              parsed.map((m: Workout) =>
                setDoc(doc(db, "users", uid, "recentWorkouts", m.name), m, { merge: true })
              )
            );
          } catch {}
          await AsyncStorage.removeItem("recentWorkouts");
        }
      }
    });
    return () => {
      if (unsub) unsub();
      unsubAuth();
    };
  }, []);

  const addRecentWorkout = async (w: Workout) => {
    const uid = uidRef.current;
    if (!uid) return;
    const colRef = collection(db, "users", uid, "recentWorkouts");
    await setDoc(doc(colRef, w.name), { ...w, updatedAt: serverTimestamp() }, { merge: true });
    const extras = recentWorkouts.filter((m) => m.name !== w.name).slice(9);
    for (const e of extras) {
      await deleteDoc(doc(colRef, e.name));
    }
  };

  const clearRecentWorkouts = async () => {
    const uid = uidRef.current;
    if (!uid) return;
    const colRef = collection(db, "users", uid, "recentWorkouts");
    await Promise.all(recentWorkouts.map((w) => deleteDoc(doc(colRef, w.name))));
    setRecentWorkouts([]);
    await AsyncStorage.removeItem(keyFor(uid));
  };

  return (
    <RecentWorkoutsContext.Provider value={{ recentWorkouts, addRecentWorkout, clearRecentWorkouts }}>
      {children}
    </RecentWorkoutsContext.Provider>
  );
};

export const useRecentWorkouts = () => {
  const ctx = useContext(RecentWorkoutsContext);
  if (!ctx) throw new Error("useRecentWorkouts must be used within provider");
  return ctx;
};
