import * as functions from 'firebase-functions';
import { db } from '../admin.js';

function getAdmins(): string[] {
  return (process.env.ALLOW_TESTER_ADMIN_UIDS || '').split(',').filter(Boolean);
}

interface Req { uid: string; value: boolean }

export const setTesterAccess = functions.https.onCall(async (data: Req, context) => {
  const caller = context.auth?.uid;
  const admins = getAdmins();
  if (!caller || !admins.includes(caller)) {
    throw new functions.https.HttpsError('permission-denied', 'Not allowed');
  }
  if (!data?.uid || typeof data.value !== 'boolean') {
    throw new functions.https.HttpsError('invalid-argument', 'uid and value required');
  }
  await db.collection('users').doc(data.uid).set({ isTester: data.value }, { merge: true });
  return { ok: true };
});
