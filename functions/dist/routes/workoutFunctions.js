"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRequestedWorkout = exports.generateWorkoutPlan = exports.generateSingleWorkout = void 0;
const functions = require("firebase-functions");
const openai_1 = require("../services/openai.js");
function safeParse(content) {
    try {
        const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (jsonMatch)
            content = jsonMatch[0];
        return JSON.parse(content);
    }
    catch (e) {
        functions.logger.error("JSON parse error", e, { raw: content });
        return null;
    }
}
exports.generateSingleWorkout = functions.https.onCall(async (data) => {
    const filters = data.filters || {};
    const prompt = `You are a professional fitness coach. Create one workout in JSON format with fields: workoutType, name, duration (minutes), equipment (array), exercises (array of {name, sets, reps, rest, notes}). Consider these filters: ${JSON.stringify(filters)}. Respond with valid JSON.`;
    try {
        const res = await openai_1.default.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });
        const parsed = safeParse(res.choices[0].message?.content || "{}");
        if (!parsed?.name)
            throw new Error("Invalid workout");
        return parsed;
    }
    catch (err) {
        functions.logger.error("generateSingleWorkout error", err);
        throw new functions.https.HttpsError("internal", err.message);
    }
});
exports.generateWorkoutPlan = functions.https.onCall(async (data) => {
    const filters = data.filters || {};
    const days = filters.daysPerWeek || 3;
    const prompt = `You are a professional fitness coach. Create a ${days}-day workout plan as JSON array. Each item must have: workoutType, name, duration, equipment (array), exercises: [{name, sets, reps, rest, notes}]. Use these filters: ${JSON.stringify(filters)}. Respond with valid JSON array.`;
    try {
        const res = await openai_1.default.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });
        const parsed = safeParse(res.choices[0].message?.content || "[]");
        if (!Array.isArray(parsed))
            throw new Error("Invalid plan");
        return parsed;
    }
    catch (err) {
        functions.logger.error("generateWorkoutPlan error", err);
        throw new functions.https.HttpsError("internal", err.message);
    }
});
exports.generateRequestedWorkout = functions.https.onCall(async (data) => {
    const filters = data.filters || {};
    if (!filters.requestedWorkout) {
        throw new functions.https.HttpsError("invalid-argument", "requestedWorkout required");
    }
    const prompt = `You are a professional fitness coach. Create the workout named "${filters.requestedWorkout}" with fields: workoutType, name, duration, equipment (array), exercises: [{name, sets, reps, rest, notes}]. Filters: ${JSON.stringify(filters)}. Respond only with JSON.`;
    try {
        const res = await openai_1.default.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });
        const parsed = safeParse(res.choices[0].message?.content || "{}");
        if (!parsed?.name)
            throw new Error("Invalid workout");
        return parsed;
    }
    catch (err) {
        functions.logger.error("generateRequestedWorkout error", err);
        throw new functions.https.HttpsError("internal", err.message);
    }
});
