// functions/src/index.ts
import functions from "firebase-functions";
import express from "express";
import glazeRoutes from "./routes/glaze.js";
import editGlazeRoutes from "./routes/editGlaze.js";
import imageRoutes from "./routes/image.js";
import progressRoutes from "./routes/progressFeedback.js";
export * from "./meal.js";

const app = express();

app.use(express.json());

// Ping test route
app.get("/api/ping", (req, res) => {
  res.status(200).send("pong");
});

// API route handlers
app.use("/api/generate-glaze", glazeRoutes);
app.use("/api/edit-glaze", editGlazeRoutes);
app.use("/api/generate-image", imageRoutes);
app.use("/api/progress-feedback", progressRoutes);

// Export as a single HTTPS function
export const api = functions.https.onRequest(app);
