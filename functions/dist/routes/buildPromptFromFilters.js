export function buildPromptFromFilters(filters) {
    const lines = [];
    if (filters.requestedDishEnabled && filters.requestedDish) {
        lines.push(`Requested dish: ${filters.requestedDish}.`);
    }
    if (filters.macrosEnabled) {
        const macroLine = `Target macros (minimum): ${filters.calories} kcal, ${filters.protein}g P, ${filters.carbs}g C, ${filters.fat}g F. Exceed if necessary, but do not go under.`;
        lines.push(filters.requestedDishEnabled && filters.requestedDish
            ? `${macroLine} You must keep the requested dish exactly as specified. Adjust portion sizes or add compatible sides to approach these macros; if they cannot be met, still return the requested dish with the closest possible macros. Never substitute a different meal.`
            : macroLine);
    }
    if (filters.budgetEnabled) {
        lines.push(`Budget level: ${filters.budgetLevel}.`);
    }
    if (filters.cookingEnabled) {
        lines.push(`Cooking time under ${filters.cookingTime} minutes.`);
    }
    if (filters.prepEnabled) {
        lines.push(`Prep style: ${filters.prepStyle}.`);
    }
    if (filters.ingredientsEnabled && Array.isArray(filters.ingredients) && filters.ingredients.length > 0) {
        lines.push(`Use these ingredients: ${filters.ingredients.join(", ")}.`);
    }
    if (Array.isArray(filters.preferences) && filters.preferences.length > 0) {
        lines.push(`Preferences: ${filters.preferences.join(", ")}.`);
    }
    if (Array.isArray(filters.dislikes) && filters.dislikes.length > 0) {
        lines.push(`Avoid: ${filters.dislikes.join(", ")}.`);
    }
    return lines.join("\n");
}
