import { Router } from "express";
import openai from "../services/openai.js";
const router = Router();
router.post("/", async (req, res) => {
    const { prompt, ingredients, hasImage } = req.body;
    if ((!prompt || prompt.trim() === "") &&
        (!ingredients || ingredients.length === 0) &&
        !hasImage) {
        res.status(400).json({ error: "A prompt, some ingredients, or an image is required." });
        return;
    }
    const ingredientText = hasImage
        ? "N/A"
        : ingredients && ingredients.length > 0
            ? ingredients.map((ing) => `${ing.name}: ${ing.value}%`).join(", ")
            : "N/A";
    const aiPrompt = `Create a glaze recipe for ceramics based on the following details:
${prompt && prompt.trim() !== "" ? `Prompt: ${prompt}\n` : ""}
Ingredients: ${ingredientText}
---
Please provide your response strictly in the following format:

Ingredients:
- % Name

Instructions:
<Step-by-step instructions here>

Optional:
<Any additional optional information here>`;
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: aiPrompt }],
        });
        const generatedRecipe = completion.choices[0].message.content;
        const imageUrl = hasImage
            ? "https://via.placeholder.com/400x300?text=Generated+Image"
            : "https://via.placeholder.com/400x300?text=Glaze+Image";
        res.json({ recipe: generatedRecipe, imageUrl });
    }
    catch (error) {
        console.error("Error generating glaze:", error);
        res.status(500).json({ error: "Glaze generation failed", details: error });
    }
});
export default router;
