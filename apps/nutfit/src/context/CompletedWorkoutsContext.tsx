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

interface Workout { name: string; [key: string]: any; completedAt?: any }
interface Ctx { completedWorkouts: Workout[]; addCompletedWorkout: (w: Workout) => void }

const CompletedWorkoutsContext = createContext<Ctx | null>(null);

export const CompletedWorkoutsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [completedWorkouts, setCompletedWorkouts] = useState<Workout[]>([]);
  const uidRef = useRef<string | null>(auth.currentUser?.uid ?? null);

  const keyFor = (uid: string) => `@nutfit:${uid}:completedWorkouts`;

  useEffect(() => {
    let unsub: (() => void) | undefined;
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (unsub) unsub();
      uidRef.current = user?.uid ?? null;
      setCompletedWorkouts([]);
      if (!user) return;
      const uid = user.uid;
      const cacheKey = keyFor(uid);

      try {
        const raw = await AsyncStorage.getItem(cacheKey);
        if (raw) setCompletedWorkouts(JSON.parse(raw));
      } catch {}

      const colRef = collection(db, "users", uid, "completedWorkouts");
      unsub = onSnapshot(colRef, (snap) => {
        const arr = snap.docs
          .map((d) => d.data() as Workout)
          .sort((a, b) =>
            (b.completedAt?.toMillis?.() || 0) - (a.completedAt?.toMillis?.() || 0)
          );
        const trimmed = arr.slice(0, 10);
        setCompletedWorkouts(trimmed);
        AsyncStorage.setItem(cacheKey, JSON.stringify(trimmed));
      });

      const snapDocs = await getDocs(colRef);
      if (snapDocs.empty) {
        const legacy = await AsyncStorage.getItem("completedWorkouts");
        if (legacy) {
          try {
            const parsed = JSON.parse(legacy);
            await Promise.all(
              parsed.map((m: Workout) =>
                setDoc(doc(db, "users", uid, "completedWorkouts", m.name), m, { merge: true })
              )
            );
          } catch {}
          await AsyncStorage.removeItem("completedWorkouts");
        }
      }
    });
    return () => {
      if (unsub) unsub();
      unsubAuth();
    };
  }, []);

  const addCompletedWorkout = async (w: Workout) => {
    const uid = uidRef.current;
    if (!uid) return;
    const colRef = collection(db, "users", uid, "completedWorkouts");
    await setDoc(doc(colRef, w.name), { ...w, completedAt: serverTimestamp() }, { merge: true });
    const extras = completedWorkouts.filter((m) => m.name !== w.name).slice(9);
    for (const e of extras) {
      await deleteDoc(doc(colRef, e.name));
    }
  };

  return (
    <CompletedWorkoutsContext.Provider value={{ completedWorkouts, addCompletedWorkout }}>
      {children}
    </CompletedWorkoutsContext.Provider>
  );
};

export const useCompletedWorkouts = () => {
  const ctx = useContext(CompletedWorkoutsContext);
  if (!ctx) throw new Error("useCompletedWorkouts must be used within provider");
  return ctx;
};
