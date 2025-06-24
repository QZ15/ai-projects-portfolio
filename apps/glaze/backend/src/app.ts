import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import glazeRoutes from "./routes/glazeRoutes";
import imageRoutes from "./routes/imageRoutes";
import editGlazeRoutes from "./routes/editGlazeRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", glazeRoutes);
app.use("/api", imageRoutes);
app.use("/api", editGlazeRoutes);

app.get("/", (req, res) => {
  res.send("Ceramic Glaze API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
