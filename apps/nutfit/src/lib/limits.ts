import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const LIMITS = { meal: 3, workout: 3 } as const;

function currentWeekKey(date: Date = new Date()): string {
  const year = date.getUTCFullYear();
  const oneJan = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(((date.getTime() - oneJan.getTime()) / 86400000 + oneJan.getUTCDay() + 1) / 7);
  return `${year}-W${week}`;
}

export async function checkUsageLimit(feature: 'meal' | 'workout') {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');
  const docRef = doc(db, 'usage', `${uid}_${currentWeekKey()}`);
  const snap = await getDoc(docRef);
  const used = snap.data()?.[feature] || 0;
  if (used >= LIMITS[feature]) {
    throw new Error('Limit reached');
  }
}

export { LIMITS, currentWeekKey };
