// AI APOCALYPSE — Game State Machine
// Powered by GDG Assiut

const GAME_STATES = {
  MENU: "MENU",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  TERMINAL: "TERMINAL",
  INVENTORY: "INVENTORY",
  UPGRADES: "UPGRADES",
  MAP: "MAP",
  MISSION_COMPLETE: "MISSION_COMPLETE",
  GAME_OVER: "GAME_OVER",
  CREDITS: "CREDITS"
};

const GAME_MODES = {
  STORY: "STORY",
  SURVIVAL: "SURVIVAL",
  CHALLENGE: "CHALLENGE",
  DAILY: "DAILY",
  SANDBOX: "SANDBOX"
};

class GameState {
  constructor() {
    this.currentState = GAME_STATES.MENU;
    this.previousState = GAME_STATES.MENU;
    this.currentMode = GAME_MODES.STORY;
    this.currentLevelIndex = 1;
    this.timeScale = 1.0;
    this.gameTimeSeconds = 0;
    this.isAudioUnlocked = false;

    // Survival mode telemetry
    this.survivalWave = 1;
    this.survivalTimer = 0;
    this.survivalScore = 0;

    // Daily Challenge telemetry
    this.dailyDate = new Date().toISOString().split("T")[0];
    this.dailyCompleted = false;

    // Sandbox settings
    this.sandboxSettings = {
      godMode: false,
      infiniteEnergy: false,
      enemySpawnsEnabled: true
    };
  }

  setState(newState, payload = null) {
    if (this.currentState === newState) return;
    this.previousState = this.currentState;
    this.currentState = newState;

    if (window.Events) {
      window.Events.emit("state_changed", {
        from: this.previousState,
        to: this.currentState,
        payload
      });
    }
  }

  setMode(newMode) {
    this.currentMode = newMode;
    if (window.Events) {
      window.Events.emit("mode_changed", { mode: this.currentMode });
    }
  }

  setLevel(levelIndex) {
    this.currentLevelIndex = Math.max(1, Math.min(6, levelIndex));
    if (window.Events) {
      window.Events.emit("level_changed", { level: this.currentLevelIndex });
    }
  }

  pause() {
    if (this.currentState === GAME_STATES.PLAYING) {
      this.setState(GAME_STATES.PAUSED);
    }
  }

  resume() {
    if (this.currentState === GAME_STATES.PAUSED) {
      this.setState(GAME_STATES.PLAYING);
    }
  }

  resetSurvival() {
    this.survivalWave = 1;
    this.survivalTimer = 0;
    this.survivalScore = 0;
  }
}

// Global instance
const GameStateManager = new GameState();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GAME_STATES, GAME_MODES, GameState, GameStateManager };
}
if (typeof window !== 'undefined') {
  window.GAME_STATES = GAME_STATES;
  window.GAME_MODES = GAME_MODES;
  window.GameStateManager = GameStateManager;
}
