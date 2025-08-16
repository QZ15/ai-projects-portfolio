// functions/src/routes/progressFunctions.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import openai from "../services/openai.js";

type Entry = { date: string; weight: number };

function sanitize(entries: Entry[]) {
  return (entries || [])
    .filter(e => e && typeof e.weight === "number" && !!e.date)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function clampWindow(entries: Entry[], windowDays: number) {
  if (!entries.length) return entries;
  const end = new Date(entries[entries.length - 1].date).getTime();
  const startCut = end - windowDays * 24 * 60 * 60 * 1000;
  return entries.filter(e => new Date(e.date).getTime() >= startCut);
}

export const generateProgressFeedback = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) throw new functions.https.HttpsError("unauthenticated", "Authentication required");
  const userSnap = await admin.firestore().collection('users').doc(uid).get();
  const user = userSnap.data() || {};
  if (!user.isPremium && !user.isTester) {
    throw new functions.https.HttpsError("permission-denied", "Premium required");
  }
  const raw: Entry[] = data?.entries || [];
  const windowDays: number = Number(data?.windowDays || 30);

  if (!Array.isArray(raw) || raw.length === 0) {
    throw new functions.https.HttpsError("invalid-argument", "No weight entries provided.");
  }

  const entries = clampWindow(sanitize(raw), windowDays);
  if (entries.length === 0) {
    throw new functions.https.HttpsError("invalid-argument", "No entries within the selected window.");
  }

  const first = entries[0];
  const last = entries[entries.length - 1];
  const days = Math.max(1, Math.round((+new Date(last.date) - +new Date(first.date)) / (1000 * 60 * 60 * 24)));
  const delta = +(last.weight - first.weight).toFixed(2);
  const perWeek = +(delta / (days / 7)).toFixed(2);

  const series = entries.map(e => `${e.date}: ${e.weight} kg`).join("\n");
  const summary = `Window: ${windowDays}d | Start: ${first.weight} kg (${first.date}) | End: ${last.weight} kg (${last.date}) | Δ: ${delta} kg | Rate: ${perWeek} kg/week`;

  const prompt = `
You are a concise, supportive fitness coach.
User's recent weight entries:
${series}

Summary:
${summary}

Task:
- State the trend (gaining, losing, or stable) and whether the rate seems reasonable for a lean bulk or a cut.
- Give 1 or 2 practical, actionable tips (training, nutrition, recovery).
- Keep it to 2 or 3 short sentences, friendly, no emojis.
`;

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const feedback = res.choices?.[0]?.message?.content || "No feedback available.";
    return { feedback };
  } catch (err: any) {
    functions.logger.error("generateProgressFeedbackFunction error", err);
    throw new functions.https.HttpsError("internal", err.message || "Feedback generation failed.");
  }
});
