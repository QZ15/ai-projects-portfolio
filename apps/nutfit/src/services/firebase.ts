import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  setDoc,
  getDocs,
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

export async function callWorkoutFunction(name: string, data?: any) {
  const fn = httpsCallable(functions, name);
  const res = await fn(data);
  return res.data;
}

export async function getWorkoutPlan(uid: string, weekId: string) {
  const ref = doc(db, 'users', uid, 'workouts', weekId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function saveWorkoutPlan(uid: string, weekId: string, plan: any) {
  const ref = doc(db, 'users', uid, 'workouts', weekId);
  await setDoc(ref, plan);
}

export async function addWorkoutLog(
  uid: string,
  workoutId: string,
  log: any,
) {
  await addDoc(collection(db, 'users', uid, 'workouts', workoutId, 'logs'), log);
}

export async function getReminders(uid: string) {
  const snap = await getDocs(collection(db, 'users', uid, 'reminders'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveReminder(uid: string, reminder: any) {
  await addDoc(collection(db, 'users', uid, 'reminders'), reminder);
}

export async function updateReminder(uid: string, id: string, data: any) {
  const ref = doc(db, 'users', uid, 'reminders', id);
  await setDoc(ref, data, { merge: true });
}

export async function logCompletion(uid: string, date: string, item: any) {
  await addDoc(collection(db, 'users', uid, 'completed', date), item);
}
