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

// Fetch profile data for a given user id
export async function getUserData(uid: string) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// Invoke a cloud function related to meals
export async function callMealFunction(name: string, data?: any) {
  const fn = httpsCallable(functions, name);
  const res = await fn(data);
  return res.data;
}

// Save a meal to the user's favorites collection
export async function saveMeal(uid: string, meal: any) {
  await addDoc(collection(db, 'users', uid, 'savedMeals'), meal);
}

// Append a meal to the user's meal history
export async function addMealHistory(uid: string, meal: any) {
  await addDoc(collection(db, 'users', uid, 'mealHistory'), meal);
}

// Invoke a cloud function related to workouts
export async function callWorkoutFunction(name: string, data?: any) {
  const fn = httpsCallable(functions, name);
  const res = await fn(data);
  return res.data;
}

// Retrieve a workout plan for the specified week
export async function getWorkoutPlan(uid: string, weekId: string) {
  const ref = doc(db, 'users', uid, 'workouts', weekId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// Store a generated workout plan
export async function saveWorkoutPlan(uid: string, weekId: string, plan: any) {
  const ref = doc(db, 'users', uid, 'workouts', weekId);
  await setDoc(ref, plan);
}

// Log completion of an exercise set
export async function addWorkoutLog(
  uid: string,
  workoutId: string,
  log: any,
) {
  await addDoc(collection(db, 'users', uid, 'workouts', workoutId, 'logs'), log);
}

// Retrieve scheduled reminders
export async function getReminders(uid: string) {
  const snap = await getDocs(collection(db, 'users', uid, 'reminders'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Save a new reminder document
export async function saveReminder(uid: string, reminder: any) {
  await addDoc(collection(db, 'users', uid, 'reminders'), reminder);
}

// Update an existing reminder
export async function updateReminder(uid: string, id: string, data: any) {
  const ref = doc(db, 'users', uid, 'reminders', id);
  await setDoc(ref, data, { merge: true });
}

// Log a completed reminder or workout
export async function logCompletion(uid: string, date: string, item: any) {
  await addDoc(collection(db, 'users', uid, 'completed', date), item);
}

// Get progress entries for a user
export async function getProgress(uid: string) {
  const snap = await getDocs(collection(db, 'users', uid, 'progress'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Add a new progress entry
export async function addProgress(uid: string, entry: any) {
  await addDoc(collection(db, 'users', uid, 'progress'), entry);
}

// Fetch the user's habit definitions
export async function getHabits(uid: string) {
  const snap = await getDocs(collection(db, 'users', uid, 'habits'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Log that a habit was completed on a given date
export async function logHabit(uid: string, habitId: string, date: string) {
  await addDoc(collection(db, 'users', uid, 'habits', habitId, 'log'), { date });
}

// Request AI-generated feedback based on progress
export async function getProgressFeedback(data: any) {
  const fn = httpsCallable(functions, 'progressFeedback');
  const res = await fn(data);
  return res.data;
}
