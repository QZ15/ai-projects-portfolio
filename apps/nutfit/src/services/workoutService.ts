import { httpsCallable } from "firebase/functions";
import { functions } from "../services/firebase";
import { checkUsageLimit } from "../lib/limits";

export async function generateWorkoutPlan(filters: any) {
  await checkUsageLimit("workout");
  const fn = httpsCallable(functions, "generateWorkoutPlanFunction");
  const res: any = await fn({ filters });
  return res.data;
}

export async function generateSingleWorkout(filters: any) {
  await checkUsageLimit("workout");
  const fn = httpsCallable(functions, "generateSingleWorkoutFunction");
  const res: any = await fn({ filters });
  return res.data;
}
