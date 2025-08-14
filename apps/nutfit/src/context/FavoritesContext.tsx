// src/context/FavoritesContext.tsx
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

const FavoritesContext = createContext<any>(null);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const uidRef = useRef<string | null>(auth.currentUser?.uid ?? null);

  const keyFor = (uid: string) => `@nutfit:${uid}:favorites`;

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

      const colRef = collection(db, "users", uid, "favorites");
      unsub = onSnapshot(colRef, (snap) => {
        const arr = snap.docs.map((d) => d.data());
        setFavorites(arr);
        AsyncStorage.setItem(cacheKey, JSON.stringify(arr));
      });

      const snapDocs = await getDocs(colRef);
      if (snapDocs.empty) {
        const legacy = await AsyncStorage.getItem("favorites");
        if (legacy) {
          try {
            const parsed = JSON.parse(legacy);
            await Promise.all(
              parsed.map((m: any) =>
                setDoc(doc(db, "users", uid, "favorites", m.name), m, { merge: true })
              )
            );
          } catch {}
          await AsyncStorage.removeItem("favorites");
        }
      }
    });
    return () => {
      if (unsub) unsub();
      unsubAuth();
    };
  }, []);

  const toggleFavorite = async (meal: any) => {
    const uid = uidRef.current;
    if (!uid) return;
    const exists = favorites.find((m) => m.name === meal.name);
    const ref = doc(db, "users", uid, "favorites", meal.name);
    if (exists) await deleteDoc(ref);
    else await setDoc(ref, meal, { merge: true });
  };

  const isFavorite = (meal: any) => favorites.some((m) => m.name === meal.name);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
};
