import { httpsCallable } from "firebase/functions";
import { functions } from "../services/firebase";

export async function generateWorkoutPlan(filters: any) {
  const fn = httpsCallable(functions, "generateWorkoutPlanFunction");
  const res: any = await fn({ filters });
  return res.data;
}

export async function generateSingleWorkout(filters: any) {
  const fn = httpsCallable(functions, "generateSingleWorkoutFunction");
  const res: any = await fn({ filters });
  return res.data;
}

export async function generateRequestedWorkout(filters: any) {
  const fn = httpsCallable(functions, "generateRequestedWorkoutFunction");
  const res: any = await fn({ filters });
  return res.data;
}
