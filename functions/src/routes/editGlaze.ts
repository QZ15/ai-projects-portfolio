// backend/src/routes/editGlazeRoutes.ts
import { Router, Request, Response } from "express";
import openai from "../services/openai.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    // Define paths to your assets
    const baseImagePath = path.join(__dirname, "../assets/base.png");
    const maskImagePath = path.join(__dirname, "../assets/base-mask.png");

    // Verify that files exist by checking file stats
    if (!fs.existsSync(baseImagePath) || !fs.existsSync(maskImagePath)) {
      throw new Error("Base image or mask image not found in assets folder.");
    }

    // Read image files as Buffers
    const baseImageBuffer = fs.readFileSync(baseImagePath);
    const maskImageBuffer = fs.readFileSync(maskImagePath);
    
    // Optionally log file sizes and dimensions if needed
    console.log(`Base image size: ${baseImageBuffer.length} bytes`);
    console.log(`Mask image size: ${maskImageBuffer.length} bytes`);

    // Convert the buffers to File objects.
    // Note: This requires Node 18+ or using a polyfill (like formdata-node) for File.
    const baseImageFile = new File([baseImageBuffer], "base.png", {
      type: "image/png",
      lastModified: Date.now(),
    });
    const maskImageFile = new File([maskImageBuffer], "base-mask.png", {
      type: "image/png",
      lastModified: Date.now(),
    });

    const { glazePrompt } = req.body;
    const prompt = glazePrompt || "Apply a glossy red crackle glaze to the pot surface.";

    console.log("Calling openai.images.edit with prompt:", prompt);

    // Call the image editing endpoint.
    const responseFromOpenai = await openai.images.edit({
      image: baseImageFile,
      mask: maskImageFile,
      prompt,
      n: 1,
      size: "512x512",
      response_format: "url",
    });

    // For some SDK versions, use a type assertion to get the data.
    const imgs = responseFromOpenai as unknown as { data: { url: string }[] };
    const imageUrl = imgs.data[0].url;
    console.log("Generated image URL:", imageUrl);

    res.json({ imageUrl });
  } catch (error) {
    console.error("Error in /edit-glaze route:", error);
    res.status(500).json({ error: "Failed to edit glaze image", details: error instanceof Error ? error.message : error });
  }
});

export default router;
