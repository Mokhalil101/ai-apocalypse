// AI APOCALYPSE — XP & Player Level Progression
// Powered by GDG Assiut

const PLAYER_TITLES = [
  { level: 1, title: "Survivor", minXp: 0 },
  { level: 2, title: "Scavenger", minXp: 300 },
  { level: 3, title: "Technician", minXp: 800 },
  { level: 4, title: "Machine Hunter", minXp: 1600 },
  { level: 5, title: "AI Specialist", minXp: 2700 },
  { level: 6, title: "Resistance Leader", minXp: 4200 },
  { level: 7, title: "NEXUS Challenger", minXp: 6500 }
];

class XPSystem {
  constructor() {
    this.xp = 0;
    this.totalXp = 0;
    this.level = 1;
    this.skillPoints = 0;
  }

  loadState(progressionData) {
    if (!progressionData) return;
    this.xp = progressionData.xp || 0;
    this.totalXp = progressionData.totalXp || 0;
    this.level = progressionData.level || 1;
    this.skillPoints = progressionData.skillPoints || 0;
  }

  getTitle() {
    for (let i = PLAYER_TITLES.length - 1; i >= 0; i--) {
      if (this.totalXp >= PLAYER_TITLES[i].minXp) {
        return PLAYER_TITLES[i].title;
      }
    }
    return PLAYER_TITLES[0].title;
  }

  getNextLevelInfo() {
    for (let i = 0; i < PLAYER_TITLES.length; i++) {
      if (PLAYER_TITLES[i].level === this.level + 1) {
        const curLevelMin = PLAYER_TITLES[i - 1].minXp;
        const nextLevelMin = PLAYER_TITLES[i].minXp;
        const progressInLevel = Math.max(0, this.totalXp - curLevelMin);
        const neededInLevel = nextLevelMin - curLevelMin;
        const pct = Math.min(100, Math.floor((progressInLevel / neededInLevel) * 100));
        return {
          nextLevel: PLAYER_TITLES[i].level,
          nextTitle: PLAYER_TITLES[i].title,
          current: progressInLevel,
          needed: neededInLevel,
          pct
        };
      }
    }
    return {
      nextLevel: this.level,
      nextTitle: "Max Level Reached",
      current: 1,
      needed: 1,
      pct: 100
    };
  }

  addXP(amount) {
    if (amount <= 0) return;
    this.xp += amount;
    this.totalXp += amount;

    if (window.Events) {
      window.Events.emit("xp_gained", { amount, totalXp: this.totalXp });
    }

    // Check for level ups
    for (let i = PLAYER_TITLES.length - 1; i >= 0; i--) {
      if (this.totalXp >= PLAYER_TITLES[i].minXp && PLAYER_TITLES[i].level > this.level) {
        const levelsGained = PLAYER_TITLES[i].level - this.level;
        this.level = PLAYER_TITLES[i].level;
        this.skillPoints += levelsGained;

        if (window.Events) {
          window.Events.emit("player_level_up", {
            newLevel: this.level,
            title: PLAYER_TITLES[i].title,
            skillPoints: this.skillPoints
          });
        }
        break;
      }
    }
  }

  spendSkillPoint() {
    if (this.skillPoints > 0) {
      this.skillPoints--;
      return true;
    }
    return false;
  }
}

// Global instance
const PlayerXP = new XPSystem();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { XPSystem, PlayerXP, PLAYER_TITLES };
}
if (typeof window !== 'undefined') {
  window.XPSystem = XPSystem;
  window.PlayerXP = PlayerXP;
  window.PLAYER_TITLES = PLAYER_TITLES;
}
