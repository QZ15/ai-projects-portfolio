// src/services/progressService.ts
import { httpsCallable } from "firebase/functions";
import { functions } from "../services/firebase";

export type WeightEntry = { date: string; weight: number };

export async function getProgressFeedback(entries: WeightEntry[], windowDays = 30) {
  const fn = httpsCallable(functions, "generateProgressFeedbackFunction");
  const res: any = await fn({ entries, windowDays });
  return res.data as { feedback: string };
}
