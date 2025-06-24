// src/pages/GlazeCreatorPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Slider, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "../styles/global.css";

interface Ingredient {
  name: string;
  value: number;
}

const GlazeCreatorPage: React.FC = () => {
  // States for user input and API response
  const [prompt, setPrompt] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [parsedRecipe, setParsedRecipe] = useState({
    ingredients: "",
    instructions: "",
    optional: "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedImage(e.target.files[0]);
    }
  };

  // Remove image handler (allows user to revert to slider-based input)
  const handleRemoveImage = () => {
    setUploadedImage(null);
  };

  // Handle slider change; disabled if an image is provided
  const handleSliderChange = (index: number, newValue: number | number[]) => {
    if (uploadedImage) return;
    const newIngredients = [...ingredients];
    newIngredients[index].value = newValue as number;
    setIngredients(newIngredients);
  };

  // Remove an ingredient
  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Add a new ingredient (default values)
  const addIngredient = () => {
    setIngredients([...ingredients, { name: "Name", value: 0 }]);
  };

  // Helper function to parse the response into sections.
  // Expects the generated text to have the markers "Ingredients:", "Instructions:", and "Optional:".
  const parseRecipe = (text: string) => {
    const ingPart = text.split("Ingredients:")[1] || "";
    const instrPart = ingPart.split("Instructions:")[1] || "";
    const optPart = instrPart.split("Optional:")[1] || "";
    return {
      ingredients: ingPart.split("Instructions:")[0].trim(),
      instructions: instrPart.split("Optional:")[0].trim(),
      optional: optPart.trim(),
    };
  };

  // Helper to parse the ingredients section into an array of Ingredient objects.
  // Expected format (one ingredient per line): "35% Kaolin"
  const parseIngredients = (text: string): Ingredient[] => {
    const parsed: Ingredient[] = [];
    const lines = text.split("\n").map(line => line.trim()).filter(line => line);
    lines.forEach((line) => {
      const match = line.match(/(\d+)%\s*-?\s*(.+)/);
      if (match) {
        const value = parseInt(match[1], 10);
        const name = match[2].trim();
        parsed.push({ name, value });
      }
    });
    return parsed;
  };

  // New helper to generate an edited image using your image editing endpoint.
  // This call uses your base pot and mask to generate a variation where only the glaze is changed.
  const handleGenerateImage = async () => {
    console.log("Generating edited image using /api/edit-glaze endpoint...");
    // Use the parsed instructions as the glaze prompt (falling back to the original prompt if necessary)
    const glazePrompt = parsedRecipe.instructions || prompt || "Apply a glossy, speckled glaze";
    const payload = { glazePrompt };

    try {
      const response = await fetch("http://localhost:5000/api/edit-glaze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to generate edited image");
      }
      const data = await response.json();
      console.log("Image editing response:", data);
      setPreviewImage(data.imageUrl);
    } catch (error) {
      console.error("Error generating edited image:", error);
    }
  };

  // Handler to create glaze by calling the backend API.
  const handleCreateGlaze = async () => {
    const payload = {
      prompt,
      ingredients,
      hasImage: !!uploadedImage,
    };

    try {
      const response = await fetch("http://localhost:5000/api/generate-glaze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to generate glaze");
      }
      const data = await response.json();
      // Parse the recipe into sections.
      const parsed = parseRecipe(data.recipe);
      setParsedRecipe(parsed);
      // Parse the ingredients section from the generated recipe.
      const newIngredients = parseIngredients(parsed.ingredients);
      if (newIngredients.length > 0) {
        setIngredients(newIngredients);
      }
      // Always generate an edited image using the new route.
      await handleGenerateImage();
    } catch (error) {
      console.error("Error generating glaze:", error);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-white text-gray-900">
      {/* Header / Navbar */}
      <header className="container mx-auto flex items-center justify-between py-4 border-b border-gray-300">
        <div className="flex items-center">
          <Link to="/">
            <img src="/images/logo.png" alt="Ceramic Glaze Logo" className="h-20 w-20" />
          </Link>
        </div>
        <nav className="flex-1 flex justify-center space-x-8">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/slip-creator" className="hover:underline">Slip Creator</Link>
          <Link to="/glaze-creator" className="hover:underline">Glaze Creator</Link>
          <Link to="/library" className="hover:underline">Library</Link>
        </nav>
        <div className="space-x-4">
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/register" className="hover:underline">Register</Link>
        </div>
      </header>

      {/* Glaze Creator Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-4">Create a Glaze</h2>
        <div className="max-w-2xl mx-auto mb-6">
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 mb-4"
            rows={4}
            placeholder="Describe the glaze you want to create..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          {/* Image Upload Section */}
          <div className="flex flex-col items-center mb-4">
            {uploadedImage ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Image: {uploadedImage.name}</span>
                <button onClick={handleRemoveImage} className="text-red-500 hover:underline">
                  Remove Image
                </button>
              </div>
            ) : (
              <>
                <label
                  htmlFor="glazeImage"
                  className="border border-dashed border-gray-300 p-4 w-full max-w-sm text-center cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <span className="text-gray-500">Upload an image (optional)</span>
                </label>
                <input
                  type="file"
                  id="glazeImage"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </>
            )}
          </div>

          {/* Ingredient Sliders */}
          <div className="space-y-4 mb-4">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => {
                    const newIngredients = [...ingredients];
                    newIngredients[index].name = e.target.value;
                    setIngredients(newIngredients);
                  }}
                  className="w-28 border border-gray-300 rounded-md p-1"
                />
                <Slider
                  value={ingredient.value}
                  onChange={(_e, newValue) => handleSliderChange(index, newValue)}
                  aria-label={ingredient.name}
                  valueLabelDisplay="auto"
                  disabled={!!uploadedImage}
                  sx={{ color: "#000000" }}
                  className="flex-1"
                />
                <input
                  type="text"
                  value={`${ingredient.value}%`}
                  readOnly
                  className="w-16 text-center border border-gray-300 rounded-md p-1"
                />
                <IconButton onClick={() => removeIngredient(index)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}
          </div>
          <div className="flex justify-center mb-6">
            <button
              onClick={addIngredient}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Add Ingredient
            </button>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleCreateGlaze}
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              Create Glaze
            </button>
          </div>
        </div>
      </div>

      {/* Generated Glaze Recipe Section */}
      {(parsedRecipe.ingredients ||
        parsedRecipe.instructions ||
        parsedRecipe.optional) && (
        <div className="container mx-auto px-4 py-8 border-t border-gray-300">
          <h2 className="text-2xl font-bold text-center mb-4">Generated Glaze Recipe</h2>
          {/* Preview Image Section */}
          {previewImage && (
            <div className="container mx-auto px-4 py-8">
              <h2 className="text-2xl font-bold text-center mb-4">Generated Pot Image</h2>
              <div className="flex justify-center">
                <img src={previewImage} alt="Generated Glaze Pot" className="rounded-md shadow-md" />
              </div>
            </div>
          )}
          <div className="max-w-3xl mx-auto space-y-8">
            {parsedRecipe.ingredients && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {parsedRecipe.ingredients}
                </p>
              </div>
            )}
            {parsedRecipe.instructions && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Instructions</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {parsedRecipe.instructions}
                </p>
              </div>
            )}
            {parsedRecipe.optional && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Optional</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {parsedRecipe.optional}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="container mx-auto py-8 border-t border-gray-300 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Glaze Me - All rights reserved.</p>
      </footer>
    </div>
  );
};

export default GlazeCreatorPage;
