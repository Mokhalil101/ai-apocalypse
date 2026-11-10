// AI APOCALYPSE — In-Game HUD & Radar Interface
// Powered by GDG Assiut

class HUD {
  constructor() {
    this.minimapSize = 160;
    this.minimapScale = 0.08;
    this.orionDialog = null;
    this.orionCharIndex = 0;
    this.orionCharTimer = 0;
  }

  setTransmission(transmission) {
    this.orionDialog = transmission ? { ...transmission } : null;
    this.orionCharIndex = 0;
    this.orionCharTimer = 0;
  }

  update(dt) {
    if (this.orionDialog) {
      this.orionDialog.life -= dt;
      this.orionCharTimer += dt;
      if (this.orionCharTimer >= 0.025 && this.orionCharIndex < this.orionDialog.text.length) {
        this.orionCharTimer = 0;
        this.orionCharIndex++;
      }
      if (this.orionDialog.life <= 0) {
        this.orionDialog = null;
      }
    }
  }

  draw(ctx, viewportW, viewportH, player, world) {
    if (!player || !world) return;

    ctx.save();

    // 1. Top-Left: Player Survival Status Card & GDG Assiut Watermark
    this.drawPlayerStatsCard(ctx, 20, 20);

    // 2. Top-Right: Radar Minimap & Active Mission Card
    this.drawRadarMinimap(ctx, viewportW - this.minimapSize - 20, 20, player, world);
    this.drawMissionCard(ctx, viewportW - 270, this.minimapSize + 30);

    // 3. Bottom-Center: Interactive Object Prompt Pill & Active Weapon
    this.drawInteractionPrompt(ctx, viewportW / 2, viewportH - 85, world);
    this.drawWeaponSelector(ctx, 20, viewportH - 85);

    // 4. Center-Bottom: ORION Comms Transmission Box
    if (this.orionDialog) {
      this.drawOrionTransmission(ctx, viewportW / 2, viewportH - 180);
    }

    // 5. Boss Health Bar (if active boss on map)
    const activeBoss = world.enemyManager ? world.enemyManager.getActiveBoss() : null;
    if (activeBoss) {
      this.drawBossOverlay(ctx, viewportW / 2, 60, activeBoss);
    }

    // 6. Mobile Touch Virtual Controls (if touch enabled)
    if (window.InputController && (window.InputController.isTouchDevice || (window.StorageManager && window.StorageManager.load().settings.touchControlsAlways))) {
      this.drawTouchControls(ctx, viewportW, viewportH);
    }

    ctx.restore();
  }

  drawPlayerStatsCard(ctx, x, y) {
    const stats = window.Stats;
    if (!stats) return;

    const w = 240;
    const h = 135;

    // Background Card
    ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#1E293B";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);

    // GDG Assiut Brand Header
    ctx.fillStyle = "#4285F4";
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("AI APOCALYPSE // GDG ASSIUT", x + 10, y + 16);

    // Player Title & Level
    const title = window.PlayerXP ? window.PlayerXP.getTitle() : "Survivor";
    const lvl = window.PlayerXP ? window.PlayerXP.level : 1;
    ctx.fillStyle = "#94A3B8";
    ctx.font = "10px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`LVL ${lvl} ${title.toUpperCase()}`, x + w - 10, y + 16);

    // Health Bar (GDG Green/Red)
    const hpPct = Math.max(0, stats.health / stats.getMaxHealth());
    this.drawBar(ctx, x + 10, y + 26, w - 20, 14, hpPct, "#34A853", "#EA4335", `HP ${Math.round(stats.health)}/${stats.getMaxHealth()}`);

    // Energy Bar (GDG Blue)
    const epPct = Math.max(0, stats.energy / stats.getMaxEnergy());
    this.drawBar(ctx, x + 10, y + 46, w - 20, 14, epPct, "#4285F4", "#1D4ED8", `ENERGY ${Math.round(stats.energy)}/${stats.getMaxEnergy()}`);

    // Food & Water Mini Gauges (GDG Yellow & Cyan)
    const foodPct = Math.max(0, stats.food / 100);
    const waterPct = Math.max(0, stats.water / 100);
    this.drawBar(ctx, x + 10, y + 66, (w - 26) / 2, 12, foodPct, "#FBBC04", "#B45309", `FOOD ${Math.round(stats.food)}%`);
    this.drawBar(ctx, x + 10 + (w - 20) / 2 + 6, y + 66, (w - 26) / 2, 12, waterPct, "#00E5FF", "#0369A1", `WATER ${Math.round(stats.water)}%`);

    // Stamina Bar (Green)
    const stamPct = Math.max(0, stats.stamina / stats.maxStamina);
    this.drawBar(ctx, x + 10, y + 84, w - 20, 10, stamPct, "#34A853", "#14532D", `STAMINA ${Math.round(stats.stamina)}%`);

    // Survival Mode Wave / Time if in Survival mode
    if (window.GameStateManager && window.GameStateManager.currentMode === "SURVIVAL") {
      ctx.fillStyle = "#FBBC04";
      ctx.font = "bold 12px system-ui, sans-serif";
      ctx.textAlign = "left";
      const gsm = window.GameStateManager;
      const mins = Math.floor(gsm.survivalTimer / 60);
      const secs = Math.floor(gsm.survivalTimer % 60).toString().padStart(2, "0");
      ctx.fillText(`WAVE: ${gsm.survivalWave}  |  TIME: ${mins}:${secs}  |  SCORE: ${gsm.survivalScore}`, x + 10, y + 115);
    } else {
      // Hotkey indicators
      ctx.fillStyle = "#64748B";
      ctx.font = "10px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("[I] Inventory  [M] Map  [Q] Quick-Heal  [Esc] Pause", x + 10, y + 115);
    }
  }

  drawBar(ctx, x, y, w, h, pct, fillCol, backCol, labelText) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = fillCol;
    ctx.fillRect(x, y, w * pct, h);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);

    if (labelText) {
      ctx.fillStyle = "#F8FAFC";
      ctx.font = "bold 9px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(labelText, x + w / 2, y + h - 2);
    }
  }

  drawRadarMinimap(ctx, x, y, player, world) {
    const size = this.minimapSize;

    // Minimap Background
    ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
    ctx.fillRect(x, y, size, size);
    ctx.strokeStyle = "#4285F4";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, size, size);

    // Crosshairs
    ctx.strokeStyle = "rgba(66, 133, 244, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + size / 2, y); ctx.lineTo(x + size / 2, y + size);
    ctx.moveTo(x, y + size / 2); ctx.lineTo(x + size, y + size / 2);
    ctx.stroke();

    const scaleX = size / world.width;
    const scaleY = size / world.height;

    // Draw Exit Portal blip
    if (world.exitArea) {
      ctx.fillStyle = "#34A853";
      ctx.fillRect(x + world.exitArea.x * scaleX, y + world.exitArea.y * scaleY, 6, 6);
    }

    // Draw Terminals blips
    ctx.fillStyle = "#00E5FF";
    for (let term of world.interactiveObjects) {
      if (term.type === "terminal") {
        ctx.fillRect(x + term.x * scaleX, y + term.y * scaleY, 3, 3);
      }
    }

    // Draw Enemies blips
    ctx.fillStyle = "#EA4335";
    for (let enemy of world.enemyManager.enemies) {
      if (enemy.isDead) continue;
      const ex = x + enemy.x * scaleX;
      const ey = y + enemy.y * scaleY;
      ctx.beginPath();
      ctx.arc(ex, ey, enemy.isBoss ? 4 : 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Player blip (Yellow)
    ctx.fillStyle = "#FBBC04";
    ctx.beginPath();
    ctx.arc(x + player.x * scaleX, y + player.y * scaleY, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawMissionCard(ctx, x, y) {
    const mission = window.Missions ? window.Missions.currentMission : null;
    if (!mission) return;

    const w = 250;
    const h = 26 + (mission.objectives.length * 20);

    ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);

    // Header
    ctx.fillStyle = "#FBBC04";
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`OBJECTIVES: ${mission.title}`, x + 10, y + 16);

    // Objectives List
    let curY = y + 34;
    for (let obj of mission.objectives) {
      ctx.fillStyle = obj.completed ? "#34A853" : "#F8FAFC";
      ctx.font = "11px system-ui, sans-serif";
      const icon = obj.completed ? "✓ " : "○ ";
      let text = icon + obj.text;
      if (text.length > 36) text = text.substr(0, 34) + "...";
      ctx.fillText(text, x + 10, curY);
      curY += 20;
    }
  }

  drawInteractionPrompt(ctx, centerX, y, world) {
    const near = world.nearInteractive;
    if (!near) return;

    const w = 320;
    const h = 42;
    const x = centerX - w / 2;

    ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#4285F4";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = "#FBBC04";
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`[E / TAP] ${near.prompt || near.label}`, centerX, y + 25);
  }

  drawWeaponSelector(ctx, x, y) {
    const inv = window.PlayerInventory;
    const weapon = inv ? inv.getEquippedWeapon() : null;
    if (!weapon) return;

    const w = 220;
    const h = 50;

    ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = weapon.bulletColor || "#4285F4";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = weapon.bulletColor || "#4285F4";
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(weapon.name, x + 10, y + 20);

    ctx.fillStyle = "#94A3B8";
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillText(`DMG: ${weapon.damage}  |  COST: ${weapon.energyCost || 0} EN`, x + 10, y + 38);
  }

  drawOrionTransmission(ctx, centerX, y) {
    const d = this.orionDialog;
    const w = 580;
    const h = 90;
    const x = centerX - w / 2;

    ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = d.sender === "NEXUS" ? "#EA4335" : "#00E5FF";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Sender Label
    ctx.fillStyle = d.sender === "NEXUS" ? "#EA4335" : "#00E5FF";
    ctx.font = "bold 12px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`INCOMING TRANSMISSION // ${d.sender}`, x + 15, y + 22);

    // Typewriter Text
    const displayedText = d.text.substr(0, this.orionCharIndex);
    ctx.fillStyle = "#F8FAFC";
    ctx.font = "12px system-ui, sans-serif";

    // Split text into lines
    this.wrapText(ctx, displayedText, x + 15, y + 42, w - 30, 16);
  }

  drawBossOverlay(ctx, centerX, y, boss) {
    const w = 480;
    const h = 24;
    const x = centerX - w / 2;

    ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
    ctx.fillRect(x, y, w, h);

    const healthPct = Math.max(0, boss.hp / boss.maxHp);
    ctx.fillStyle = "#EA4335";
    ctx.fillRect(x, y, w * healthPct, h);

    ctx.strokeStyle = "#FBBC04";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = "#F8FAFC";
    ctx.font = "bold 12px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${boss.name} [${Math.round(boss.hp)}/${boss.maxHp}]`, centerX, y + 16);
  }

  drawTouchControls(ctx, vw, vh) {
    const ic = window.InputController;
    if (!ic) return;

    // Left Touch Joystick Zone
    const tj = ic.touchJoystick;
    if (tj.active) {
      ctx.strokeStyle = "rgba(66, 133, 244, 0.4)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(tj.startX, tj.startY, tj.radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "rgba(66, 133, 244, 0.7)";
      ctx.beginPath();
      ctx.arc(tj.currentX, tj.currentY, 24, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(100, vh - 100, 50, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Right Action Buttons
    const btnSize = 56;
    // Attack Button (Red)
    ctx.fillStyle = "rgba(234, 67, 53, 0.75)";
    ctx.beginPath();
    ctx.arc(vw - 80, vh - 80, btnSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFF";
    ctx.font = "bold 12px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("FIRE", vw - 80, vh - 75);

    // Interact Button (Blue)
    ctx.fillStyle = "rgba(66, 133, 244, 0.75)";
    ctx.beginPath();
    ctx.arc(vw - 80, vh - 150, btnSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFF";
    ctx.fillText("USE", vw - 80, vh - 145);
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let curY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, curY);
        line = words[n] + " ";
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, curY);
  }
}

// Global instance
const GameHUD = new HUD();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HUD, GameHUD };
}
if (typeof window !== 'undefined') {
  window.HUD = HUD;
  window.GameHUD = GameHUD;
}
