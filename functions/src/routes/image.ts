// backend/src/routes/imageRoutes.ts
import { Router, Request, Response } from "express";
import openai from "../services/openai.js";
import { url } from "inspector";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { potShape, glazeEffect } = req.body;

  // Construct a prompt that enforces:
  // 1) PNG format
  // 2) Transparent background
  // 3) Consistent pot shape
  const imagePrompt = `Generate a PNG image of a ${potShape} ceramic pot with a transparent background. 
  The pot should have ${glazeEffect} glaze and be centered in the frame, no other objects or background. 
  Resolution 512x512, well-lit, minimal shadows.`;

  try {
    // Hypothetical GPT-4o-mini method for image generation
    const response = await openai.images.generate({ 
        model:"dall-e-3",
        prompt: imagePrompt,
        size: "1024x1024"
    });
    console.log(response.data);

    // The response might return a URL or a base64-encoded image
    // For example, if it returns an array of images:
    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error("Image URL not returned by OpenAI");
    }

    res.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Image generation failed", details: error });
  }
});

export default router;
