// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../services/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [onboarded, setOnboarded] = useState(false);
  const [loadingOnboard, setLoadingOnboard] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingAuth(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    (async () => {
      const v = await AsyncStorage.getItem("hasOnboarded");
      setOnboarded(v === "true");
      setLoadingOnboard(false);
    })();
  }, []);

  return {
    user,
    loading: loadingAuth || loadingOnboard,
    onboarded, // device-level flag
  };
}
