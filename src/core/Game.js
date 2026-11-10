// AI APOCALYPSE — Main Game Coordinator & Game Engine Loop
// Powered by GDG Assiut

class Game {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.lastTime = 0;
    this.isRunning = false;

    this.player = null;
    this.world = null;
    this.input = null;
    this.hud = null;

    this.damageFlashTimer = 0;
  }

  init() {
    this.canvas = document.getElementById("game-canvas");
    if (!this.canvas) {
      this.canvas = document.createElement("canvas");
      this.canvas.id = "game-canvas";
      document.body.appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext("2d", { alpha: false });

    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());

    // Initialize subsystems
    this.input = window.InputController;
    this.world = new WorldManager();
    this.player = new Player(200, 900);
    this.hud = window.GameHUD;

    // Load saved progression state
    this.loadSavedState();

    // Setup Event Listeners
    this.setupEventListeners();

    // Start in MENU state
    if (window.GameStateManager) {
      window.GameStateManager.setState(window.GAME_STATES.MENU);
    }
    if (window.GameMainMenu) {
      window.GameMainMenu.show();
    }

    // Start 60 FPS Game Loop
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (this.world) {
      this.world.camera.viewportW = this.canvas.width;
      this.world.camera.viewportH = this.canvas.height;
    }
  }

  loadSavedState() {
    if (!window.StorageManager) return;
    const save = window.StorageManager.load();

    if (window.Stats && save.player) {
      window.Stats.loadState(save.player);
    }
    if (window.PlayerInventory && save.inventory) {
      window.PlayerInventory.loadState(save.inventory, save.player.equippedWeapon, save.player.unlockedWeapons);
    }
    if (window.PlayerXP && save.progression) {
      window.PlayerXP.loadState(save.progression);
    }
    if (window.Achievements && save.achievements) {
      window.Achievements.loadState(save.achievements);
    }
    if (window.Challenges && save.solvedChallenges) {
      window.Challenges.loadState(save.solvedChallenges);
    }
  }

  saveCurrentState() {
    if (!window.StorageManager) return;
    const save = window.StorageManager.load();

    if (window.Stats) {
      save.player.health = window.Stats.health;
      save.player.energy = window.Stats.energy;
      save.player.food = window.Stats.food;
      save.player.water = window.Stats.water;
      save.player.stamina = window.Stats.stamina;
      save.player.upgrades = { ...window.Stats.upgrades };
    }
    if (window.PlayerInventory) {
      save.inventory = JSON.parse(JSON.stringify(window.PlayerInventory.slots));
      save.player.equippedWeapon = window.PlayerInventory.equippedWeaponId;
      save.player.unlockedWeapons = [...window.PlayerInventory.unlockedWeapons];
    }
    if (window.PlayerXP) {
      save.progression.xp = window.PlayerXP.xp;
      save.progression.totalXp = window.PlayerXP.totalXp;
      save.progression.level = window.PlayerXP.level;
      save.progression.skillPoints = window.PlayerXP.skillPoints;
    }
    if (window.Achievements) {
      save.achievements = window.Achievements.getUnlockedArray();
    }
    if (window.Challenges) {
      save.solvedChallenges = Array.from(window.Challenges.solvedChallengeIds);
    }

    window.StorageManager.save(save);
  }

  setupEventListeners() {
    if (!window.Events) return;

    // Player Death
    window.Events.on("player_died", (data) => {
      if (window.GameStateManager) {
        window.GameStateManager.setState(window.GAME_STATES.GAME_OVER);
      }
      if (window.GameResultsUI) {
        window.GameResultsUI.showGameOver(data.source);
      }
    });

    // Player Damaged
    window.Events.on("player_damaged", () => {
      this.damageFlashTimer = 0.25;
      if (this.world) this.world.shakeCamera(0.2, 5);
    });

    // Toggle Inventory
    window.Events.on("toggle_inventory", () => {
      const gsm = window.GameStateManager;
      if (!gsm) return;

      if (gsm.currentState === window.GAME_STATES.PLAYING) {
        gsm.setState(window.GAME_STATES.INVENTORY);
        if (window.GameInventoryUI) window.GameInventoryUI.open("inventory");
      } else if (gsm.currentState === window.GAME_STATES.INVENTORY) {
        gsm.setState(window.GAME_STATES.PLAYING);
        if (window.GameInventoryUI) window.GameInventoryUI.close();
      }
    });

    // Pause Pressed
    window.Events.on("pause_pressed", () => {
      const gsm = window.GameStateManager;
      if (!gsm) return;
      if (gsm.currentState === window.GAME_STATES.PLAYING) {
        gsm.pause();
        if (window.GameMainMenu) window.GameMainMenu.show();
      } else if (gsm.currentState === window.GAME_STATES.PAUSED) {
        gsm.resume();
        if (window.GameMainMenu) window.GameMainMenu.hide();
      }
    });

    // Interact Pressed
    window.Events.on("interact_pressed", () => {
      this.handlePlayerInteract();
    });

    // Quick Use Item
    window.Events.on("quick_use_pressed", () => {
      const inv = window.PlayerInventory;
      if (!inv) return;
      // Try to heal first if damaged
      if (window.Stats && window.Stats.health < window.Stats.getMaxHealth()) {
        if (inv.useItem("medkit_advanced") || inv.useItem("medkit_basic")) return;
      }
      // Or consume food / water
      if (window.Stats && window.Stats.food < 80 && inv.useItem("food_ration")) return;
      if (window.Stats && window.Stats.water < 80 && inv.useItem("clean_water")) return;
      if (window.Stats && window.Stats.energy < 50 && inv.useItem("energy_cell")) return;
    });

    // Touch events for mobile
    this.canvas.addEventListener("touchstart", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      if (this.input) this.input.handleTouchStart(e, rect);
    }, { passive: false });

    this.canvas.addEventListener("touchmove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      if (this.input) this.input.handleTouchMove(e, rect);
    }, { passive: false });

    this.canvas.addEventListener("touchend", (e) => {
      if (this.input) this.input.handleTouchEnd(e);
    });

    // ORION Transmission Event
    window.Events.on("orion_transmission", (transmission) => {
      if (this.hud) this.hud.setTransmission(transmission);
    });
  }

  handlePlayerInteract() {
    if (!this.world || !this.world.nearInteractive) return;

    const near = this.world.nearInteractive;

    if (near.type === "terminal" || near.type === "final_console") {
      if (near.challengeId && window.Challenges) {
        const ch = window.Challenges.startChallenge(near.challengeId, near);
        if (ch && window.GameTerminalUI) {
          window.GameTerminalUI.open(ch);
        }
      } else if (near.type === "final_console" && window.Missions) {
        window.Missions.completeReachObjective("singularity_console");
        if (window.GameResultsUI) {
          window.GameResultsUI.renderFinalDecisionModal();
        }
      }
    } else if (near.type === "chest") {
      if (!near.opened && near.contents) {
        near.opened = true;
        for (let item of near.contents) {
          if (window.PlayerInventory) window.PlayerInventory.addItem(item.itemId, item.qty);
          this.world.addFloatingText(near.x, near.y - 15, `+${item.qty} scavenged`, "#FBBC04");
        }
        if (window.AudioManager) window.AudioManager.playSfx("pickup");
      }
    } else if (near.type === "healing_station") {
      if (near.charges > 0 && window.Stats) {
        near.charges--;
        window.Stats.heal(100);
        window.Stats.restoreEnergy(100);
        if (window.AudioManager) window.AudioManager.playSfx("heal");
        this.world.addFloatingText(near.x, near.y - 15, "SYSTEMS RESTORED", "#34A853");
      }
    } else if (near.type === "lore_log") {
      alert(`[DATA RECORD DECRYPTED]\n\n${near.text}`);
      if (window.Achievements) window.Achievements.unlock("ach_data_explorer");
    } else if (near.type === "exit_portal") {
      const exitData = near.data;
      if (exitData.locked) {
        if (window.PlayerInventory && exitData.requiresQuest && window.PlayerInventory.getItemCount(exitData.requiresQuest) > 0) {
          exitData.locked = false;
        } else {
          this.world.addFloatingText(exitData.x + 60, exitData.y, "LOCKED: CLEARANCE REQUIRED", "#EA4335");
          if (window.AudioManager) window.AudioManager.playSfx("fail");
          return;
        }
      }

      // Exit unlocked! Complete reach objective and proceed
      if (window.Missions) {
        window.Missions.completeReachObjective(exitData.id);
      }
    }
  }

  startCampaign(levelIndex = 1) {
    if (window.GameStateManager) {
      window.GameStateManager.setMode(window.GAME_MODES.STORY);
      window.GameStateManager.setLevel(levelIndex);
      window.GameStateManager.setState(window.GAME_STATES.PLAYING);
    }
    this.loadLevel(levelIndex);
  }

  startSurvivalMode() {
    if (window.GameStateManager) {
      window.GameStateManager.setMode(window.GAME_MODES.SURVIVAL);
      window.GameStateManager.resetSurvival();
      window.GameStateManager.setState(window.GAME_STATES.PLAYING);
    }
    // Load Level 1 as arena
    this.loadLevel(1);
    if (this.world) {
      this.world.addAnnouncement("ENDLESS SURVIVAL INITIATED!", "#FBBC04");
    }
  }

  startDailyChallenge() {
    if (window.GameStateManager) {
      window.GameStateManager.setMode(window.GAME_MODES.DAILY);
      window.GameStateManager.setState(window.GAME_STATES.PLAYING);
    }
    this.loadLevel(3); // Sector 3 Data Center for daily challenge
    if (this.world) {
      this.world.addAnnouncement("DAILY CHALLENGE: NEURAL DATA RUN", "#00E5FF");
    }
  }

  startSandboxMode() {
    if (window.GameStateManager) {
      window.GameStateManager.setMode(window.GAME_MODES.SANDBOX);
      window.GameStateManager.setState(window.GAME_STATES.PLAYING);
    }
    // Give all weapons and max resources for sandbox
    if (window.PlayerInventory) {
      window.PlayerInventory.addItem("weapon_emp", 1);
      window.PlayerInventory.addItem("weapon_pulse_rifle", 1);
      window.PlayerInventory.addItem("weapon_shock_tool", 1);
      window.PlayerInventory.addItem("metal_scrap", 20);
      window.PlayerInventory.addItem("electronic_parts", 20);
      window.PlayerInventory.addItem("battery_pack", 15);
      window.PlayerInventory.addItem("nanoweave_fiber", 10);
      window.PlayerInventory.addItem("quantum_core_shard", 5);
      window.PlayerInventory.addItem("energy_hypercell", 5);
    }
    this.loadLevel(4);
    if (this.world) {
      this.world.addAnnouncement("SANDBOX ARENA: ALL WEAPONS UNLOCKED", "#34A853");
    }
  }

  loadLevel(levelIndex) {
    if (!window.LEVELS_DATA) return;
    const lvl = window.LEVELS_DATA.find(l => l.id === levelIndex);
    if (!lvl) return;

    this.world.loadLevel(lvl);

    if (lvl.playerSpawn) {
      this.player.resetPosition(lvl.playerSpawn.x, lvl.playerSpawn.y);
    }

    if (window.Missions) {
      window.Missions.loadLevelMission(levelIndex);
    }

    // Auto-save checkpoint
    this.saveCurrentState();

    if (this.world) {
      this.world.addAnnouncement(`ENTERING SECTOR ${levelIndex}: ${lvl.name.toUpperCase()}`, "#4285F4");
    }
  }

  restartCurrentLevel() {
    const curLevel = (window.GameStateManager && window.GameStateManager.currentLevelIndex) || 1;
    // Restore health & energy
    if (window.Stats) {
      window.Stats.health = window.Stats.getMaxHealth();
      window.Stats.energy = window.Stats.getMaxEnergy();
      window.Stats.food = 100;
      window.Stats.water = 100;
      window.Stats.stamina = 100;
    }
    if (window.GameStateManager) {
      window.GameStateManager.setState(window.GAME_STATES.PLAYING);
    }
    this.loadLevel(curLevel);
  }

  loop(currentTime) {
    if (!this.isRunning) return;

    const dt = Math.min(0.1, (currentTime - this.lastTime) / 1000.0);
    this.lastTime = currentTime;

    this.update(dt);
    this.draw();

    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    const gsm = window.GameStateManager;
    const state = gsm ? gsm.currentState : window.GAME_STATES.PLAYING;

    // Update Achievement toasts in all states
    if (window.Achievements) {
      window.Achievements.update(dt);
    }

    // Only update gameplay entities when in PLAYING state
    if (state === window.GAME_STATES.PLAYING) {
      // Update world camera coordinates for mouse aiming
      if (this.input && this.world) {
        this.input.updateCamera(this.world.camera.x, this.world.camera.y);
      }

      // Update Player
      if (this.player) {
        this.player.update(dt, this.input, this.world);
      }

      // Update World, Projectiles, Enemies, Particles
      if (this.world) {
        this.world.update(dt, this.player);
      }

      // Update HUD timers
      if (this.hud) {
        this.hud.update(dt);
      }

      if (this.damageFlashTimer > 0) {
        this.damageFlashTimer -= dt;
      }
    }
  }

  draw() {
    if (!this.ctx || !this.canvas) return;

    const vw = this.canvas.width;
    const vh = this.canvas.height;

    // Clear Canvas
    this.ctx.fillStyle = "#0F172A";
    this.ctx.fillRect(0, 0, vw, vh);

    const gsm = window.GameStateManager;
    const state = gsm ? gsm.currentState : window.GAME_STATES.PLAYING;

    // Draw World & Entities if playing or paused
    if (state === window.GAME_STATES.PLAYING || state === window.GAME_STATES.PAUSED || state === window.GAME_STATES.INVENTORY || state === window.GAME_STATES.TERMINAL) {
      if (this.world) {
        this.world.draw(this.ctx, this.player);
      }

      // Damage screen vignette flash (Red border)
      if (this.damageFlashTimer > 0) {
        const alpha = Math.min(0.5, this.damageFlashTimer * 2);
        this.ctx.fillStyle = `rgba(234, 67, 53, ${alpha})`;
        this.ctx.fillRect(0, 0, vw, vh);
      }

      // Draw HUD overlay
      if (this.hud && state === window.GAME_STATES.PLAYING) {
        this.hud.draw(this.ctx, vw, vh, this.player, this.world);
      }
    }

    // Draw Active Achievement Toast Notification (Screen Space)
    this.drawAchievementToast(this.ctx, vw, vh);
  }

  drawAchievementToast(ctx, vw, vh) {
    const achManager = window.Achievements;
    if (!achManager || !achManager.activeToast) return;

    const ach = achManager.activeToast;
    const toastW = 340;
    const toastH = 65;
    const toastX = vw / 2 - toastW / 2;
    const toastY = 30;

    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
    ctx.fillRect(toastX, toastY, toastW, toastH);

    ctx.strokeStyle = "#FBBC04";
    ctx.lineWidth = 2;
    ctx.strokeRect(toastX, toastY, toastW, toastH);

    ctx.fillStyle = "#FBBC04";
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("🏆 COMMUNITY ACHIEVEMENT UNLOCKED!", toastX + 15, toastY + 20);

    ctx.fillStyle = "#F8FAFC";
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.fillText(ach.title, toastX + 15, toastY + 40);

    ctx.fillStyle = "#94A3B8";
    ctx.font = "10px system-ui, sans-serif";
    ctx.fillText(`+${ach.xpReward} XP &bull; ${ach.description}`, toastX + 15, toastY + 54);

    ctx.restore();
  }
}

// Global instance
const GameInstance = new Game();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Game, GameInstance };
}
if (typeof window !== 'undefined') {
  window.Game = Game;
  window.GameInstance = GameInstance;
}
