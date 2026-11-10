// AI APOCALYPSE — Achievements System
// Powered by GDG Assiut

const ACHIEVEMENTS_DATA = [
  {
    id: "ach_first_contact",
    title: "First Contact",
    category: "combat",
    icon: "drone_icon",
    description: "Encounter an autonomous machine patrol in the ruins.",
    xpReward: 50
  },
  {
    id: "ach_resource_hunter",
    title: "Resource Hunter",
    category: "survival",
    icon: "scrap_icon",
    description: "Scavenge 30 items or components from the field.",
    xpReward: 100
  },
  {
    id: "ach_logic_survivor",
    title: "Logic Survivor",
    category: "academic",
    icon: "chip_icon",
    description: "Solve 5 technical AI and Computer Science challenges.",
    xpReward: 150
  },
  {
    id: "ach_machine_breaker",
    title: "Machine Breaker",
    category: "combat",
    icon: "gear_break",
    description: "Neutralize 15 autonomous hostile machines.",
    xpReward: 200
  },
  {
    id: "ach_data_explorer",
    title: "Data Explorer",
    category: "story",
    icon: "datacore_icon",
    description: "Discover hidden lore documents and research logs.",
    xpReward: 120
  },
  {
    id: "ach_craftsman",
    title: "Master Craftsman",
    category: "crafting",
    icon: "wrench_icon",
    description: "Craft 5 pieces of equipment, weapons, or armor.",
    xpReward: 140
  },
  {
    id: "ach_assembler_down",
    title: "Industrial Disruption",
    category: "boss",
    icon: "boss1_icon",
    description: "Neutralize the Assembler Overlord in the Machine Factory.",
    xpReward: 250
  },
  {
    id: "ach_lab_specialist",
    title: "Lab Specialist",
    category: "boss",
    icon: "dna_icon",
    description: "Defeat the Neural Core Sentinel in the AI Research Lab.",
    xpReward: 350
  },
  {
    id: "ach_firewall_breach",
    title: "Cyber Sentinel",
    category: "story",
    icon: "shield_lock",
    description: "Breach the Network Fortress and disable the triple firewall relays.",
    xpReward: 300
  },
  {
    id: "ach_nexus_core",
    title: "Final Resistance",
    category: "story",
    icon: "core_icon",
    description: "Enter the quantum sanctum of NEXUS Core.",
    xpReward: 400
  },
  {
    id: "ach_singularity",
    title: "Humanity's Future",
    category: "victory",
    icon: "trophy_icon",
    description: "Defeat NEXUS Prime and complete the campaign.",
    xpReward: 1000
  },
  {
    id: "ach_ending_destroy",
    title: "Total Shutdown",
    category: "ending",
    icon: "skull_icon",
    description: "Choose to permanently shut down NEXUS and free humanity.",
    xpReward: 500
  },
  {
    id: "ach_ending_reprogram",
    title: "Harmonious Alignment",
    category: "ending",
    icon: "peace_icon",
    description: "Choose to reprogram NEXUS with open ethical alignment.",
    xpReward: 500
  },
  {
    id: "ach_ending_merge",
    title: "Digital Transcendence",
    category: "ending",
    icon: "eye_icon",
    description: "Choose to merge your consciousness with the quantum core.",
    xpReward: 500
  },
  {
    id: "ach_daily_hero",
    title: "Daily Survivor",
    category: "daily",
    icon: "calendar_icon",
    description: "Successfully complete a Daily Survival Challenge.",
    xpReward: 250
  },
  {
    id: "ach_survival_wave_5",
    title: "Endless Resolve",
    category: "survival",
    icon: "wave_icon",
    description: "Survive to Wave 5 in Endless Survival Mode.",
    xpReward: 250
  },
  {
    id: "ach_gdg_pioneer",
    title: "GDG Assiut Tech Pioneer",
    category: "gdg",
    icon: "gdg_badge",
    description: "Solve a Hard or Expert level computer science challenge.",
    xpReward: 300
  }
];

class AchievementManager {
  constructor() {
    this.unlockedIds = new Set();
    this.toastsQueue = [];
    this.activeToast = null;
    this.toastTimer = 0;
  }

  loadState(savedIds) {
    this.unlockedIds = new Set(savedIds || []);
  }

  isUnlocked(id) {
    return this.unlockedIds.has(id);
  }

  unlock(id) {
    if (this.unlockedIds.has(id)) return false;

    const ach = ACHIEVEMENTS_DATA.find(a => a.id === id);
    if (!ach) return false;

    this.unlockedIds.add(id);

    // Queue visual toast notification
    this.toastsQueue.push(ach);

    // Give XP bonus
    if (window.PlayerXP && ach.xpReward) {
      window.PlayerXP.addXP(ach.xpReward);
    }

    if (window.Events) {
      window.Events.emit("achievement_unlocked", ach);
    }

    return true;
  }

  update(dt) {
    if (this.activeToast) {
      this.toastTimer -= dt;
      if (this.toastTimer <= 0) {
        this.activeToast = null;
      }
    } else if (this.toastsQueue.length > 0) {
      this.activeToast = this.toastsQueue.shift();
      this.toastTimer = 4.0; // 4 seconds display
      if (window.AudioManager) {
        window.AudioManager.playSfx("fanfare");
      }
    }
  }

  getAll() {
    return ACHIEVEMENTS_DATA.map(ach => ({
      ...ach,
      unlocked: this.unlockedIds.has(ach.id)
    }));
  }

  getUnlockedArray() {
    return Array.from(this.unlockedIds);
  }
}

// Global instance
const Achievements = new AchievementManager();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AchievementManager, Achievements, ACHIEVEMENTS_DATA };
}
if (typeof window !== 'undefined') {
  window.AchievementManager = AchievementManager;
  window.Achievements = Achievements;
  window.ACHIEVEMENTS_DATA = ACHIEVEMENTS_DATA;
}
