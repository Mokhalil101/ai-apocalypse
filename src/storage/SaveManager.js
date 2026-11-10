// AI APOCALYPSE — LocalStorage & Save Progression System
// Powered by GDG Assiut

const SAVE_KEY = "AI_APOCALYPSE_GDG_SAVE_V1";

class SaveManager {
  constructor() {
    this.defaultSave = {
      version: "1.0",
      createdAt: new Date().toISOString(),
      lastSaved: new Date().toISOString(),
      currentStoryLevel: 1,
      unlockedLevels: [1],
      player: {
        health: 100,
        maxHealth: 100,
        energy: 100,
        maxEnergy: 100,
        food: 100,
        water: 100,
        stamina: 100,
        equippedWeapon: "weapon_blaster",
        unlockedWeapons: ["weapon_blaster"],
        upgrades: {
          weaponDamageTier: 0,
          armorDefenseTier: 0,
          scannerRangeTier: 0,
          energyCapacityTier: 0,
          healthCapacityTier: 0,
          movementSpeedTier: 0,
          inventoryCapacityTier: 0
        }
      },
      inventory: [
        { itemId: "food_ration", qty: 2 },
        { itemId: "clean_water", qty: 2 },
        { itemId: "medkit_basic", qty: 1 },
        { itemId: "energy_cell", qty: 2 }
      ],
      progression: {
        xp: 0,
        totalXp: 0,
        level: 1,
        skillPoints: 0,
        enemiesDefeated: 0,
        resourcesCollected: 0,
        challengesSolved: 0,
        terminalsHacked: 0
      },
      achievements: [],
      solvedChallenges: [],
      survivalRecord: {
        bestWave: 0,
        bestTime: 0,
        bestScore: 0
      },
      dailyRecord: {
        lastCompletedDate: null,
        streak: 0
      },
      unlockedEndings: [],
      settings: {
        masterVolume: 0.8,
        sfxVolume: 0.8,
        musicVolume: 0.6,
        touchControlsAlways: false,
        screenShake: true,
        highContrast: false
      }
    };
  }

  hasSave() {
    try {
      return localStorage.getItem(SAVE_KEY) !== null;
    } catch (e) {
      return false;
    }
  }

  load() {
    try {
      const dataStr = localStorage.getItem(SAVE_KEY);
      if (!dataStr) {
        return JSON.parse(JSON.stringify(this.defaultSave));
      }
      const parsed = JSON.parse(dataStr);
      // Deep merge with defaultSave to guarantee all fields exist
      return this.deepMerge(JSON.parse(JSON.stringify(this.defaultSave)), parsed);
    } catch (err) {
      console.warn("[SaveManager] Error loading save data from localStorage, falling back to default:", err);
      return JSON.parse(JSON.stringify(this.defaultSave));
    }
  }

  save(saveData) {
    try {
      saveData.lastSaved = new Date().toISOString();
      const str = JSON.stringify(saveData);
      localStorage.setItem(SAVE_KEY, str);
      if (window.Events) {
        window.Events.emit("game_saved", { timestamp: saveData.lastSaved });
      }
      return true;
    } catch (err) {
      console.error("[SaveManager] Failed to persist data to localStorage:", err);
      return false;
    }
  }

  resetProgress() {
    try {
      localStorage.removeItem(SAVE_KEY);
      const fresh = JSON.parse(JSON.stringify(this.defaultSave));
      if (window.Events) {
        window.Events.emit("progress_reset", fresh);
      }
      return fresh;
    } catch (e) {
      return JSON.parse(JSON.stringify(this.defaultSave));
    }
  }

  exportJSON() {
    const current = this.load();
    return JSON.stringify(current, null, 2);
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== "object") throw new Error("Invalid save JSON");
      const merged = this.deepMerge(JSON.parse(JSON.stringify(this.defaultSave)), parsed);
      this.save(merged);
      return { success: true, data: merged };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  deepMerge(target, source) {
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object && !Array.isArray(source[key]) && key in target) {
        Object.assign(source[key], this.deepMerge(target[key], source[key]));
      }
    }
    Object.assign(target || {}, source);
    return target;
  }
}

// Global instance
const StorageManager = new SaveManager();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SaveManager, StorageManager, SAVE_KEY };
}
if (typeof window !== 'undefined') {
  window.SaveManager = SaveManager;
  window.StorageManager = StorageManager;
}
