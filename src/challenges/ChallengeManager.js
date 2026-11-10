// AI APOCALYPSE — Challenge Manager & Validation Engine
// Powered by GDG Assiut

class ChallengeManager {
  constructor() {
    this.activeChallenge = null;
    this.currentTerminalObj = null;
    this.solvedChallengeIds = new Set();
    this.hintsUsed = 0;
  }

  loadState(savedSolvedIds) {
    this.solvedChallengeIds = new Set(savedSolvedIds || []);
  }

  getChallenge(id) {
    if (!window.CHALLENGES_DATA) return null;
    return window.CHALLENGES_DATA.find(c => c.id === id);
  }

  isSolved(id) {
    return this.solvedChallengeIds.has(id);
  }

  startChallenge(challengeId, terminalObj = null) {
    const ch = this.getChallenge(challengeId);
    if (!ch) return null;

    this.activeChallenge = JSON.parse(JSON.stringify(ch));
    this.currentTerminalObj = terminalObj;

    // Trigger state change to terminal mode
    if (window.GameStateManager) {
      window.GameStateManager.setState(window.GAME_STATES.TERMINAL, { challenge: this.activeChallenge });
    }

    if (window.AudioManager) {
      window.AudioManager.playSfx("terminal_open");
    }

    return this.activeChallenge;
  }

  validateAnswer(userSubmission) {
    if (!this.activeChallenge) return { success: false, message: "No active challenge." };

    const ch = this.activeChallenge;
    let isCorrect = false;

    switch (ch.type) {
      case "multiple_choice":
      case "true_false":
      case "predict_output":
      case "find_bug":
      case "complete_code":
        isCorrect = (String(userSubmission).trim().toLowerCase() === String(ch.correctAnswer).trim().toLowerCase());
        break;

      case "binary_converter":
        // userSubmission should be integer or binary string
        isCorrect = (parseInt(userSubmission, 2) === ch.targetDecimal || parseInt(userSubmission, 10) === ch.targetDecimal);
        break;

      case "match_concepts":
        // userSubmission is map { key: val }
        isCorrect = true;
        if (!userSubmission || typeof userSubmission !== "object") {
          isCorrect = false;
        } else {
          for (let p of ch.pairs) {
            if (userSubmission[p.key] !== p.val) {
              isCorrect = false;
              break;
            }
          }
        }
        break;

      case "arrange_steps":
        // userSubmission is array of strings in order
        isCorrect = Array.isArray(userSubmission) &&
          userSubmission.length === ch.steps.length &&
          userSubmission.every((val, idx) => val === ch.steps[idx]);
        break;

      case "logic_gate":
        // userSubmission is { A: 0|1, B: 0|1 }
        if (ch.gateType === "XOR") {
          const out = (userSubmission.A ^ userSubmission.B);
          isCorrect = (out === ch.targetOutput);
        } else if (ch.gateType === "NAND") {
          const out = (!(userSubmission.A && userSubmission.B) ? 1 : 0);
          isCorrect = (out === ch.targetOutput);
        }
        break;

      case "terminal_cli":
        // userSubmission is command string
        isCorrect = (userSubmission.trim().toLowerCase() === ch.targetCommand.toLowerCase());
        break;
    }

    if (isCorrect) {
      return this.handleChallengeSuccess();
    } else {
      if (window.AudioManager) {
        window.AudioManager.playSfx("fail");
      }
      return {
        success: false,
        message: "SYSTEM VALIDATION FAILED: Invalid logic parameters. Try again or request an ORION hint."
      };
    }
  }

  handleChallengeSuccess() {
    const ch = this.activeChallenge;
    this.solvedChallengeIds.add(ch.id);

    // Audio chime
    if (window.AudioManager) {
      window.AudioManager.playSfx("success");
    }

    // Award XP
    if (window.PlayerXP && ch.reward && ch.reward.xp) {
      window.PlayerXP.addXP(ch.reward.xp);
    }

    // Award Energy
    if (window.Stats && ch.reward && ch.reward.energy) {
      window.Stats.restoreEnergy(ch.reward.energy);
    }

    // Award Item if specified
    if (window.PlayerInventory && ch.reward && ch.reward.itemId) {
      window.PlayerInventory.addItem(ch.reward.itemId, 1);
    }

    // Mark current terminal as hacked
    if (this.currentTerminalObj) {
      this.currentTerminalObj.hacked = true;
      if (this.currentTerminalObj.unlocksExit && window.GameInstance && window.GameInstance.world) {
        const exitObj = window.GameInstance.world.exitArea;
        if (exitObj) exitObj.locked = false;
        window.GameInstance.world.addAnnouncement("BLAST GATE UNLOCKED!", "#34A853");
      }
    }

    // Check achievements
    if (window.Achievements) {
      if (this.solvedChallengeIds.size >= 5) {
        window.Achievements.unlock("ach_logic_survivor");
      }
      if (ch.difficulty === "hard" || ch.difficulty === "expert") {
        window.Achievements.unlock("ach_gdg_pioneer");
      }
    }

    if (window.Events) {
      window.Events.emit("challenge_solved", {
        challengeId: ch.id,
        category: ch.category,
        reward: ch.reward
      });
    }

    return {
      success: true,
      message: `CHALLENGE OVERRIDDEN! +${ch.reward ? ch.reward.xp : 100} XP awarded. Access granted.`,
      explanation: ch.explanation
    };
  }

  requestHint() {
    if (!this.activeChallenge) return null;

    // Check if player has bypass tool or enough energy
    const inv = window.PlayerInventory;
    const stats = window.Stats;
    const hasKey = inv && inv.getItemCount("tool_hack_key") > 0;

    if (!hasKey && stats) {
      if (stats.energy < 10) {
        return { success: false, message: "Insufficient Energy (requires 10 Energy or a Cryptographic Bypass Key)." };
      }
      stats.consumeEnergy(10);
    } else if (hasKey && inv) {
      inv.removeItem("tool_hack_key", 1);
    }

    this.hintsUsed++;
    if (window.AudioManager) window.AudioManager.playSfx("terminal_key");

    return {
      success: true,
      hint: this.activeChallenge.hint || "Review fundamental computer science documentation for this domain."
    };
  }

  closeChallenge() {
    this.activeChallenge = null;
    this.currentTerminalObj = null;

    if (window.GameStateManager) {
      window.GameStateManager.setState(window.GAME_STATES.PLAYING);
    }
  }
}

// Global instance
const Challenges = new ChallengeManager();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ChallengeManager, Challenges };
}
if (typeof window !== 'undefined') {
  window.ChallengeManager = ChallengeManager;
  window.Challenges = Challenges;
}
