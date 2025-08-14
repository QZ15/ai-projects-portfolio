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
  favorites: Workout[];
  toggleFavorite: (w: Workout) => void;
  isFavorite: (w: Workout) => boolean;
}

const WorkoutFavoritesContext = createContext<Ctx | null>(null);

export const WorkoutFavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Workout[]>([]);
  const uidRef = useRef<string | null>(auth.currentUser?.uid ?? null);

  const keyFor = (uid: string) => `@nutfit:${uid}:workoutFavorites`;

  useEffect(() => {
    let unsub: (() => void) | undefined;
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (unsub) unsub();
      uidRef.current = user?.uid ?? null;
      setFavorites([]);
      if (!user) return;
      const uid = user.uid;
      const cacheKey = keyFor(uid);

      try {
        const raw = await AsyncStorage.getItem(cacheKey);
        if (raw) setFavorites(JSON.parse(raw));
      } catch {}

      const colRef = collection(db, "users", uid, "workoutFavorites");
      unsub = onSnapshot(colRef, (snap) => {
        const arr = snap.docs.map((d) => d.data() as Workout);
        setFavorites(arr);
        AsyncStorage.setItem(cacheKey, JSON.stringify(arr));
      });

      const snapDocs = await getDocs(colRef);
      if (snapDocs.empty) {
        const legacy = await AsyncStorage.getItem("workoutFavorites");
        if (legacy) {
          try {
            const parsed = JSON.parse(legacy);
            await Promise.all(
              parsed.map((m: Workout) =>
                setDoc(doc(db, "users", uid, "workoutFavorites", m.name), m, { merge: true })
              )
            );
          } catch {}
          await AsyncStorage.removeItem("workoutFavorites");
        }
      }
    });
    return () => {
      if (unsub) unsub();
      unsubAuth();
    };
  }, []);

  const toggleFavorite = async (w: Workout) => {
    const uid = uidRef.current;
    if (!uid) return;
    const exists = favorites.find((m) => m.name === w.name);
    const ref = doc(db, "users", uid, "workoutFavorites", w.name);
    if (exists) await deleteDoc(ref);
    else await setDoc(ref, w, { merge: true });
  };

  const isFavorite = (w: Workout) => favorites.some((m) => m.name === w.name);

  return (
    <WorkoutFavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </WorkoutFavoritesContext.Provider>
  );
};

export const useWorkoutFavorites = () => {
  const ctx = useContext(WorkoutFavoritesContext);
  if (!ctx) throw new Error("useWorkoutFavorites must be used within provider");
  return ctx;
};
