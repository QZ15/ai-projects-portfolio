import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

interface SubState {
  isPremium: boolean;
  status?: string;
  currentPeriodEnd?: number;
  isTester: boolean;
  effectivePremium: boolean;
}

export function useSubscription(): SubState | undefined {
  const [state, setState] = useState<SubState>();

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const ref = doc(db, 'users', uid);
    return onSnapshot(ref, snap => {
      const data = snap.data() || {};
      const isPremium = !!data.isPremium;
      const isTester = !!data.isTester;
      setState({
        isPremium,
        status: data.subscription?.status,
        currentPeriodEnd: data.subscription?.current_period_end,
        isTester,
        effectivePremium: isPremium || isTester,
      });
    });
  }, []);

  return state;
}
