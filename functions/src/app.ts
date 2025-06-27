import express from "express";
import cors from "cors";
import glazeRoutes from "./routes/glazeRoutes";
import imageRoutes from "./routes/imageRoutes";
import editGlazeRoutes from "./routes/editGlazeRoutes";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", glazeRoutes);
app.use("/api", imageRoutes);
app.use("/api", editGlazeRoutes);
export default app;
