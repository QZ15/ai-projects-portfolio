import { db } from '../admin.js';
import * as functions from 'firebase-functions';

function currentWeekKey(date: Date = new Date()): string {
  const year = date.getUTCFullYear();
  const oneJan = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(((date.getTime() - oneJan.getTime()) / 86400000 + oneJan.getUTCDay() + 1) / 7);
  return `${year}-W${week}`;
}

export async function enforceUsageLimit(
  uid: string,
  feature: 'meal' | 'workout',
  limit: number
): Promise<void> {
  const key = `${uid}_${currentWeekKey()}`;
  const ref = db.collection('usage').doc(key);
  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    const data = snap.data() || { meal: 0, workout: 0 };
    const used = data[feature] || 0;
    if (used >= limit) {
      throw new functions.https.HttpsError('resource-exhausted', 'Limit reached');
    }
    tx.set(ref, { ...data, [feature]: used + 1 });
  });
}

export async function assertPremiumOrWithinLimit(
  uid: string,
  feature: 'meal' | 'workout'
): Promise<void> {
  const userSnap = await db.collection('users').doc(uid).get();
  const user = userSnap.data() || {};
  if (user.isPremium || user.isTester) return;
  const limit = feature === 'meal' ? 3 : 3;
  await enforceUsageLimit(uid, feature, limit);
}

export { currentWeekKey };
