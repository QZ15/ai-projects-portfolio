// backend/src/routes/glazeRoutes.ts
import { Router, Request, Response } from "express";
import openai from "../services/openai";

const router = Router();

router.post(
  "/generate-glaze",
  async (req: Request, res: Response): Promise<void> => {
    const { prompt, ingredients, hasImage } = req.body;

    // Validation: require at least one of prompt, ingredients, or an image.
    if (
      (!prompt || prompt.trim() === "") &&
      (!ingredients || ingredients.length === 0) &&
      !hasImage
    ) {
      res.status(400).json({ error: "A prompt, some ingredients, or an image is required." });
      return;
    }

    // If an image is provided, ignore ingredients.
    const ingredientText = hasImage
      ? "N/A"
      : ingredients && ingredients.length > 0
      ? ingredients.map((ing: any) => `${ing.name}: ${ing.value}%`).join(", ")
      : "N/A";

    // Construct the AI prompt.
    // If prompt exists, include it; otherwise, rely on the ingredients.
    const aiPrompt = `Create a glaze recipe for ceramics based on the following details:
${prompt && prompt.trim() !== "" ? `Prompt: ${prompt}\n` : ""}
Ingredients: ${ingredientText}
---
Please provide your response strictly in the following format:

Ingredients:
<Your list of ingredients here in the following format>
"- % Name"

Instructions:
<Step-by-step instructions here>

Optional:
<Any additional optional information here>`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // switched to gpt-4o-mini model
        messages: [{ role: "user", content: aiPrompt }],
      });
      // Extract the text content from the response message.
      const generatedRecipe = completion.choices[0].message.content;
      
      // If an image was uploaded, generate an image. For now, we use a placeholder.
      const imageUrl = hasImage
        ? "https://via.placeholder.com/400x300?text=Generated+Image"
        : "https://via.placeholder.com/400x300?text=Glaze+Image";
      
      res.json({
        recipe: generatedRecipe,
        imageUrl,
      });
    } catch (error) {
      console.error("Error generating glaze:", error);
      res.status(500).json({ error: "Glaze generation failed", details: error });
    }
  }
);

export default router;
