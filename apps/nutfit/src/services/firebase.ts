import { initializeApp, getApps} from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getApp } from 'firebase/app';
import {
  initializeFirestore,
  connectFirestoreEmulator,
  doc,
  getDoc,
  collection,
  addDoc,
  setDoc,
  getDocs,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { setLogLevel } from 'firebase/firestore';
setLogLevel('warn');

const firebaseConfig = {
  apiKey: 'AIzaSyATCcmqGkufh1_YlqbC8Rv44e2Ch5rEsHY',
  authDomain: 'ai-projects-portfolio.firebaseapp.com',
  projectId: 'ai-projects-portfolio',
  storageBucket: 'ai-projects-portfolio.appspot.com',
  messagingSenderId: '897310273497',
  appId: '1:897310273497:web:5fe6b8ddc506a8448ef3c8',
};

export const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const auth = getAuth(app);
export const db = initializeFirestore(getApp(), {
  experimentalForceLongPolling: true,
  cacheSizeBytes: 1048576, // optional: limit cache size to 1MB
});
export const functions = getFunctions(app);

// --- Your existing utility functions ---

export async function getUserData(uid: string) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function saveUserProfile(uid: string, data: any) {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, data, { merge: true });
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

export async function addWorkoutLog(uid: string, workoutId: string, log: any) {
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

export async function getProgress(uid: string) {
  const snap = await getDocs(collection(db, 'users', uid, 'progress'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addProgress(uid: string, entry: any) {
  await addDoc(collection(db, 'users', uid, 'progress'), entry);
}

export async function getHabits(uid: string) {
  const snap = await getDocs(collection(db, 'users', uid, 'habits'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function logHabit(uid: string, habitId: string, date: string) {
  await addDoc(collection(db, 'users', uid, 'habits', habitId, 'log'), { date });
}

export async function getProgressFeedback(data: any) {
  const fn = httpsCallable(functions, 'progressFeedback');
  const res = await fn(data);
  return res.data;
}
