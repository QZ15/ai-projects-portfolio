import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

export async function getUserData(uid: string) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function callMealFunction(name: string, data?: any) {
  const fn = httpsCallable(functions, name);
  const res = await fn(data);
  return res.data;
}

export async function saveMeal(uid: string, meal: any) {
  await addDoc(collection(db, 'users', uid, 'savedMeals'), meal);
}

export async function addMealHistory(uid: string, meal: any) {
  await addDoc(collection(db, 'users', uid, 'mealHistory'), meal);
}
