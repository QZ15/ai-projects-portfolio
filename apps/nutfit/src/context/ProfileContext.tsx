import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
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

const LEGACY_KEY = {
  name: "@nutfit:profile:name",
  weight: "@nutfit:profile:weightLbs",
  bodyFat: "@nutfit:profile:bodyFatPct",
  goal: "@nutfit:profile:goal",
};

const keyFor = (uid: string, k: keyof typeof LEGACY_KEY) => `@nutfit:${uid}:profile:${k}`;

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const uidRef = useRef<string | null>(auth.currentUser?.uid ?? null);

  const loadFromStorage = async (uid: string): Promise<Profile> => {
    const [[, name], [, w], [, bf], [, goal]] = await AsyncStorage.multiGet([
      keyFor(uid, "name"),
      keyFor(uid, "weight"),
      keyFor(uid, "bodyFat"),
      keyFor(uid, "goal"),
    ]);
    return {
      name: name || undefined,
      weightLbs: w ? parseFloat(w) : undefined,
      bodyFatPct: bf ? parseFloat(bf) : undefined,
      goal: goal || undefined,
      email: auth.currentUser?.email ?? undefined,
    };
  };

  const migrateLegacy = async (uid: string): Promise<Profile | null> => {
    const [[, name], [, w], [, bf], [, goal]] = await AsyncStorage.multiGet([
      LEGACY_KEY.name,
      LEGACY_KEY.weight,
      LEGACY_KEY.bodyFat,
      LEGACY_KEY.goal,
    ]);
    if (name || w || bf || goal) {
      const next: Profile = {
        name: name || undefined,
        weightLbs: w ? parseFloat(w) : undefined,
        bodyFatPct: bf ? parseFloat(bf) : undefined,
        goal: goal || undefined,
        email: auth.currentUser?.email ?? undefined,
      };
      await setDoc(
        doc(db, "users", uid),
        {
          name: next.name ?? null,
          weight: next.weightLbs ?? null,
          bodyFat: next.bodyFatPct ?? null,
          goal: next.goal ?? null,
        },
        { merge: true }
      );
      await AsyncStorage.multiSet([
        [keyFor(uid, "name"), next.name ?? ""],
        [keyFor(uid, "weight"), next.weightLbs != null ? String(next.weightLbs) : ""],
        [keyFor(uid, "bodyFat"), next.bodyFatPct != null ? String(next.bodyFatPct) : ""],
        [keyFor(uid, "goal"), next.goal ?? ""],
      ]);
      await AsyncStorage.multiRemove(Object.values(LEGACY_KEY));
      return next;
    }
    return null;
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        setProfile(null);
        return;
      }
      uidRef.current = user.uid;
      const uid = user.uid;
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d: any = snap.data();
        const next: Profile = {
          name: d.name ?? undefined,
          weightLbs: d.weight ?? undefined, // Firestore field `weight` is lbs
          bodyFatPct: d.bodyFat ?? undefined, // Firestore field `bodyFat` is %
          goal: d.goal ?? undefined,
          email: user.email ?? undefined,
        };
        setProfile(next);
        await AsyncStorage.multiSet([
          [keyFor(uid, "name"), next.name ?? ""],
          [keyFor(uid, "weight"), next.weightLbs != null ? String(next.weightLbs) : ""],
          [keyFor(uid, "bodyFat"), next.bodyFatPct != null ? String(next.bodyFatPct) : ""],
          [keyFor(uid, "goal"), next.goal ?? ""],
        ]);
      } else {
        const migrated = await migrateLegacy(uid);
        if (migrated) {
          setProfile(migrated);
        } else {
          const local = await loadFromStorage(uid);
          setProfile(local);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<Profile>) => {
      const user = auth.currentUser;
      if (!user) return;
      const uid = user.uid;
      const ref = doc(db, "users", uid);
      const next: Profile = { ...(profile ?? {}), ...patch, email: user.email ?? undefined };
      await setDoc(
        ref,
        {
          name: next.name ?? null,
          weight: next.weightLbs ?? null,   // lbs
          bodyFat: next.bodyFatPct ?? null, // %
          goal: next.goal ?? null,
        },
        { merge: true }
      );
      setProfile(next);
      await AsyncStorage.multiSet([
        [keyFor(uid, "name"), next.name ?? ""],
        [keyFor(uid, "weight"), next.weightLbs != null ? String(next.weightLbs) : ""],
        [keyFor(uid, "bodyFat"), next.bodyFatPct != null ? String(next.bodyFatPct) : ""],
        [keyFor(uid, "goal"), next.goal ?? ""],
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
