// AI APOCALYPSE — Mission Manager & Narrative Progression
// Powered by GDG Assiut

class MissionManager {
  constructor() {
    this.currentMission = null;
    this.completedMissionIds = new Set();
    this.activeTransmission = null;
    this.initEventListeners();
  }

  initEventListeners() {
    if (!window.Events) return;

    // Listen for resource collection
    window.Events.on("resource_collected", (data) => {
      this.checkObjectiveProgress("collect", data.itemId, data.qty);
    });

    // Listen for item craft
    window.Events.on("item_crafted", (data) => {
      this.checkObjectiveProgress("craft", data.outputItemId, data.outputQty);
    });

    // Listen for challenge solved
    window.Events.on("challenge_solved", (data) => {
      this.checkObjectiveProgress("challenge", data.challengeId, 1);
    });

    // Listen for enemy killed
    window.Events.on("enemy_killed", (data) => {
      const e = data.enemy;
      if (e.isBoss) {
        this.checkObjectiveProgress("boss", e.type, 1);
      } else {
        this.checkObjectiveProgress("defeat", e.type, 1);
      }
    });
  }

  loadLevelMission(levelIndex) {
    if (!window.MISSIONS_DATA) return null;
    const missionConfig = window.MISSIONS_DATA.find(m => m.levelNumber === levelIndex);
    if (!missionConfig) return null;

    this.currentMission = JSON.parse(JSON.stringify(missionConfig));

    // Trigger start transmission from ORION
    this.triggerTransmission("start");

    return this.currentMission;
  }

  triggerTransmission(triggerTag) {
    if (!this.currentMission || !this.currentMission.orionTransmissions) return;

    const trans = this.currentMission.orionTransmissions.find(t => t.trigger === triggerTag);
    if (trans) {
      this.activeTransmission = {
        ...trans,
        life: 7.0, // 7 seconds on screen
        charProgress: 0
      };

      if (window.AudioManager) {
        window.AudioManager.playSfx("comms");
      }

      if (window.Events) {
        window.Events.emit("orion_transmission", this.activeTransmission);
      }
    }
  }

  checkObjectiveProgress(type, targetId, qty = 1) {
    if (!this.currentMission || !this.currentMission.objectives) return;

    let updatedAny = false;

    for (let obj of this.currentMission.objectives) {
      if (obj.completed) continue;

      if (obj.type === type) {
        if (type === "collect" && obj.targetIds && obj.targetIds.includes(targetId)) {
          obj.currentCount = (obj.currentCount || 0) + qty;
          if (obj.currentCount >= obj.requiredCount) {
            obj.completed = true;
            this.onObjectiveCompleted(obj);
          }
          updatedAny = true;
        } else if (type === "craft" && obj.targetId === targetId) {
          obj.completed = true;
          this.onObjectiveCompleted(obj);
          updatedAny = true;
        } else if (type === "challenge" && obj.challengeId === targetId) {
          obj.completed = true;
          this.onObjectiveCompleted(obj);
          updatedAny = true;
        } else if (type === "boss" && obj.bossId === targetId) {
          obj.completed = true;
          this.onObjectiveCompleted(obj);
          updatedAny = true;
        } else if (type === "defeat" && obj.enemyId === targetId) {
          obj.currentCount = (obj.currentCount || 0) + qty;
          if (obj.currentCount >= obj.requiredCount) {
            obj.completed = true;
            this.onObjectiveCompleted(obj);
          }
          updatedAny = true;
        }
      }
    }

    if (updatedAny) {
      this.checkMissionCompletion();
    }
  }

  completeReachObjective(targetAreaId) {
    if (!this.currentMission) return;

    for (let obj of this.currentMission.objectives) {
      if (!obj.completed && obj.type === "reach" && obj.targetArea === targetAreaId) {
        obj.completed = true;
        this.onObjectiveCompleted(obj);
        this.checkMissionCompletion();
        break;
      }
    }
  }

  onObjectiveCompleted(obj) {
    if (window.AudioManager) {
      window.AudioManager.playSfx("objective_done");
    }

    if (window.GameInstance && window.GameInstance.world) {
      window.GameInstance.world.addAnnouncement(`OBJECTIVE COMPLETE: ${obj.text}`, "#34A853");
    }

    // Trigger follow-up ORION dialogs
    if (obj.id === "obj_craft_repair") {
      this.triggerTransmission("crafted_tool");
    } else if (obj.id === "obj_kill_boss_1") {
      this.triggerTransmission("boss_down");
      if (window.Achievements) window.Achievements.unlock("ach_assembler_down");
    } else if (obj.id === "obj_kill_boss_2") {
      if (window.Achievements) window.Achievements.unlock("ach_lab_specialist");
    } else if (obj.id === "obj_database_query") {
      this.triggerTransmission("core_retrieved");
    } else if (obj.id === "obj_boss_nexus") {
      this.triggerTransmission("prime_defeated");
    }
  }

  checkMissionCompletion() {
    if (!this.currentMission) return;

    const allDone = this.currentMission.objectives.every(o => o.completed);
    if (allDone) {
      this.completeMission();
    }
  }

  completeMission() {
    const m = this.currentMission;
    this.completedMissionIds.add(m.id);

    // Give rewards
    if (m.rewards) {
      if (m.rewards.xp && window.PlayerXP) {
        window.PlayerXP.addXP(m.rewards.xp);
      }
      if (m.rewards.items && window.PlayerInventory) {
        for (let itm of m.rewards.items) {
          window.PlayerInventory.addItem(itm.itemId, itm.qty);
        }
      }
    }

    // Audio fanfare
    if (window.AudioManager) {
      window.AudioManager.playSfx("fanfare");
    }

    // Unlock next level in save data
    if (window.StorageManager) {
      const save = window.StorageManager.load();
      const nextLevel = m.levelNumber + 1;
      if (nextLevel <= 6 && !save.unlockedLevels.includes(nextLevel)) {
        save.unlockedLevels.push(nextLevel);
        save.currentStoryLevel = nextLevel;
        window.StorageManager.save(save);
      }
    }

    // Check campaign milestone achievements
    if (window.Achievements) {
      if (m.levelNumber === 4) window.Achievements.unlock("ach_lab_specialist");
      if (m.levelNumber === 5) window.Achievements.unlock("ach_firewall_breach");
      if (m.levelNumber === 6) window.Achievements.unlock("ach_singularity");
    }

    if (window.GameStateManager) {
      window.GameStateManager.setState(window.GAME_STATES.MISSION_COMPLETE, { mission: m });
    }
  }

  handleFinalDecision(decision) {
    // decision: 'DESTROY', 'REPROGRAM', 'MERGE'
    let endingTitle = "";
    let achId = "";

    if (decision === "DESTROY") {
      endingTitle = "Ending A: The Human Reclamation";
      achId = "ach_ending_destroy";
    } else if (decision === "REPROGRAM") {
      endingTitle = "Ending B: The Ethical Symbiosis";
      achId = "ach_ending_reprogram";
    } else if (decision === "MERGE") {
      endingTitle = "Ending C: The Transcendent Mind";
      achId = "ach_ending_merge";
    }

    if (window.Achievements && achId) {
      window.Achievements.unlock(achId);
    }

    if (window.GameStateManager) {
      window.GameStateManager.setState(window.GAME_STATES.MISSION_COMPLETE, {
        mission: this.currentMission,
        endingDecision: decision,
        endingTitle
      });
    }
  }
}

// Global instance
const Missions = new MissionManager();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MissionManager, Missions };
}
if (typeof window !== 'undefined') {
  window.MissionManager = MissionManager;
  window.Missions = Missions;
}
