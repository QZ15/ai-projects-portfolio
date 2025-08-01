export function buildPromptFromFilters(filters) {
    const lines = [];
    if (filters.requestedDishEnabled && filters.requestedDish) {
        lines.push(`Requested dish: ${filters.requestedDish}.`);
    }
    if (filters.macrosEnabled) {
        const macroLine = `Target macros: ${filters.calories} kcal, ${filters.protein}g P, ${filters.carbs}g C, ${filters.fat}g F.`;
        lines.push(filters.requestedDishEnabled && filters.requestedDish
            ? `${macroLine} Apply these macros to the requested dish.`
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
