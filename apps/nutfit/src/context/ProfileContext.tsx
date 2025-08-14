import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export type Profile = {
  name?: string;
  weightLbs?: number;   // stored in lbs
  bodyFatPct?: number;  // %
  goal?: string;
  email?: string;
};

type Ctx = {
  profile: Profile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
};

const ProfileContext = createContext<Ctx>({
  profile: null,
  loading: true,
  refresh: async () => {},
  updateProfile: async () => {},
});

export const useProfile = () => useContext(ProfileContext);

const KEY = {
  name: "@nutfit:profile:name",
  weight: "@nutfit:profile:weightLbs",
  bodyFat: "@nutfit:profile:bodyFatPct",
  goal: "@nutfit:profile:goal",
};

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadFromStorage = async (): Promise<Profile> => {
    const [[, name], [, w], [, bf], [, goal]] = await AsyncStorage.multiGet([
      KEY.name,
      KEY.weight,
      KEY.bodyFat,
      KEY.goal,
    ]);
    return {
      name: name || undefined,
      weightLbs: w ? parseFloat(w) : undefined,
      bodyFatPct: bf ? parseFloat(bf) : undefined,
      goal: goal || undefined,
      email: auth.currentUser?.email ?? undefined,
    };
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        setProfile(null);
        return;
      }
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d: any = snap.data();
        const next: Profile = {
          name: d.name ?? undefined,
          weightLbs: d.weight ?? undefined,     // Firestore field `weight` is lbs
          bodyFatPct: d.bodyFat ?? undefined,   // Firestore field `bodyFat` is %
          goal: d.goal ?? undefined,
          email: user.email ?? undefined,
        };
        setProfile(next);
        await AsyncStorage.multiSet([
          [KEY.name, next.name ?? ""],
          [KEY.weight, next.weightLbs != null ? String(next.weightLbs) : ""],
          [KEY.bodyFat, next.bodyFatPct != null ? String(next.bodyFatPct) : ""],
          [KEY.goal, next.goal ?? ""],
        ]);
      } else {
        const local = await loadFromStorage();
        setProfile(local);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<Profile>) => {
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const next: Profile = { ...(profile ?? {}), ...patch, email: user.email ?? undefined };
      await updateDoc(ref, {
        name: next.name ?? null,
        weight: next.weightLbs ?? null,   // lbs
        bodyFat: next.bodyFatPct ?? null, // %
        goal: next.goal ?? null,
      });
      setProfile(next);
      await AsyncStorage.multiSet([
        [KEY.name, next.name ?? ""],
        [KEY.weight, next.weightLbs != null ? String(next.weightLbs) : ""],
        [KEY.bodyFat, next.bodyFatPct != null ? String(next.bodyFatPct) : ""],
        [KEY.goal, next.goal ?? ""],
      ]);
    },
    [profile]
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => {
      refresh();
    });
    return unsub;
  }, [refresh]);

  return (
    <ProfileContext.Provider value={{ profile, loading, refresh, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}
