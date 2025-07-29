import functions from "firebase-functions";
import express from "express";

// Existing routes
import glazeRoutes from "./routes/glaze.js";
import editGlazeRoutes from "./routes/editGlaze.js";
import imageRoutes from "./routes/image.js";
import progressRoutes from "./routes/progressFeedback.js";

// ✅ Import callable functions
import { generateSingleMeal, generateMealPlan } from "./routes/mealFunctions.js";

const app = express();

app.use(express.json());

// --- Test route ---
app.get("/api/ping", (req, res) => {
  res.status(200).send("pong");
});

// --- API route handlers ---
app.use("/api/generate-glaze", glazeRoutes);
app.use("/api/edit-glaze", editGlazeRoutes);
app.use("/api/generate-image", imageRoutes);
app.use("/api/progress-feedback", progressRoutes);

// ✅ Export callable meal functions with matching names
export const generateSingleMealFunction = generateSingleMeal;
export const generateMealPlanFunction = generateMealPlan;

// ✅ Export Express API
export const api = functions.https.onRequest(app);
