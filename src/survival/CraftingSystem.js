// AI APOCALYPSE — Crafting System & Material Synthesis
// Powered by GDG Assiut

class CraftingSystem {
  constructor() {
    this.totalCraftedCount = 0;
  }

  getRecipes() {
    return window.RECIPES_DATA || [];
  }

  canCraft(recipeId) {
    const recipe = this.getRecipes().find(r => r.id === recipeId);
    if (!recipe || !window.PlayerInventory) return false;

    for (let ing of recipe.ingredients) {
      if (window.PlayerInventory.getItemCount(ing.itemId) < ing.qty) {
        return false;
      }
    }
    return true;
  }

  craft(recipeId) {
    const recipe = this.getRecipes().find(r => r.id === recipeId);
    if (!recipe || !this.canCraft(recipeId)) return false;

    // Deduct ingredients
    for (let ing of recipe.ingredients) {
      window.PlayerInventory.removeItem(ing.itemId, ing.qty);
    }

    // Add crafted output
    const success = window.PlayerInventory.addItem(recipe.outputItemId, recipe.outputQty || 1);
    this.totalCraftedCount++;

    if (window.AudioManager) {
      window.AudioManager.playSfx("craft");
    }

    // Check achievement
    if (this.totalCraftedCount >= 5 && window.Achievements) {
      window.Achievements.unlock("ach_craftsman");
    }

    if (window.Events) {
      window.Events.emit("item_crafted", {
        recipeId,
        outputItemId: recipe.outputItemId,
        outputQty: recipe.outputQty
      });
    }

    return success;
  }
}

// Global instance
const Crafter = new CraftingSystem();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CraftingSystem, Crafter };
}
if (typeof window !== 'undefined') {
  window.CraftingSystem = CraftingSystem;
  window.Crafter = Crafter;
}
