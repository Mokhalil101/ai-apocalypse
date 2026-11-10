// AI APOCALYPSE — World Engine, Physics, Projectiles, Particles & Camera
// Powered by GDG Assiut

class WorldManager {
  constructor() {
    this.width = 2400;
    this.height = 1800;
    this.levelData = null;

    this.camera = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      viewportW: 800,
      viewportH: 600,
      shakeTimer: 0,
      shakeIntensity: 0
    };

    this.obstacles = [];
    this.interactiveObjects = [];
    this.groundItems = [];
    this.projectiles = [];
    this.particles = [];
    this.empPulses = [];
    this.orbitalStrikes = [];
    this.floatingTexts = [];
    this.announcements = [];

    this.enemyManager = new EnemyManager();
    this.exitArea = null;
    this.nearInteractive = null; // object player can interact with right now
  }

  loadLevel(levelConfig) {
    this.levelData = levelConfig;
    this.width = levelConfig.width || 2400;
    this.height = levelConfig.height || 1800;

    this.obstacles = JSON.parse(JSON.stringify(levelConfig.obstacles || []));
    this.interactiveObjects = JSON.parse(JSON.stringify(levelConfig.interactiveObjects || []));
    this.groundItems = [];
    this.projectiles = [];
    this.particles = [];
    this.empPulses = [];
    this.orbitalStrikes = [];
    this.floatingTexts = [];
    this.announcements = [];
    this.exitArea = levelConfig.exitArea ? JSON.parse(JSON.stringify(levelConfig.exitArea)) : null;

    // Load initial ground resources
    if (levelConfig.resourceSpawns) {
      for (let res of levelConfig.resourceSpawns) {
        this.spawnGroundItem(res.itemId, res.x, res.y, res.qty || 1);
      }
    }

    // Load enemies
    this.enemyManager.loadLevelEnemies(levelConfig);
  }

  spawnGroundItem(itemId, x, y, qty = 1) {
    const itemData = window.ITEMS_DATA ? window.ITEMS_DATA[itemId] : null;
    if (!itemData) return;

    this.groundItems.push({
      id: "item_" + Math.random().toString(36).substr(2, 6),
      itemId,
      name: itemData.name,
      category: itemData.category,
      x,
      y,
      qty,
      radius: 14,
      animTimer: Math.random() * 5
    });
  }

  createProjectile(p) {
    this.projectiles.push({
      x: p.x,
      y: p.y,
      startX: p.x,
      startY: p.y,
      vx: Math.cos(p.angle) * p.speed,
      vy: Math.sin(p.angle) * p.speed,
      damage: p.damage,
      range: p.range || 500,
      radius: p.radius || 4,
      color: p.color || "#4285F4",
      source: p.source || "player",
      isExplosive: !!p.isExplosive,
      traveled: 0
    });
  }

  createEmpPulse(x, y, maxRadius, damage, stunDuration) {
    this.empPulses.push({
      x,
      y,
      radius: 10,
      maxRadius,
      damage,
      stunDuration,
      color: "#00E5FF",
      life: 0.5,
      maxLife: 0.5
    });

    // Check hit immediately on all enemies within range
    for (let enemy of this.enemyManager.enemies) {
      if (enemy.isDead) continue;
      const dist = Math.hypot(enemy.x - x, enemy.y - y);
      if (dist <= maxRadius) {
        enemy.takeDamage(damage, this);
        enemy.ai.applyStun(stunDuration);
      }
    }
  }

  createMeleeArc(x, y, angle, range, damage) {
    // Arc shockwave
    this.createEmpPulse(x + Math.cos(angle) * (range * 0.5), y + Math.sin(angle) * (range * 0.5), range * 0.6, damage, 1.5);
  }

  createOrbitalStrike(x, y, delay, damage) {
    this.orbitalStrikes.push({
      x,
      y,
      radius: 65,
      delay,
      maxDelay: delay,
      damage,
      triggered: false
    });
  }

  createSparks(x, y, count = 6, color = "#FBBC04") {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 120;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2,
        color,
        life: 0.3 + Math.random() * 0.3,
        maxLife: 0.6
      });
    }
  }

  createExplosion(x, y, radius = 40) {
    this.shakeCamera(0.3, 6);
    this.createSparks(x, y, 20, "#EA4335");
    this.createSparks(x, y, 15, "#FBBC04");
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      size: 8,
      maxSize: radius,
      color: "rgba(251, 188, 4, 0.7)",
      isShockwave: true,
      life: 0.4,
      maxLife: 0.4
    });
  }

  addFloatingText(x, y, text, color = "#F8FAFC") {
    this.floatingTexts.push({
      x,
      y,
      text,
      color,
      life: 1.2,
      maxLife: 1.2
    });
  }

  addAnnouncement(text, color = "#FBBC04") {
    this.announcements.push({
      text,
      color,
      life: 3.5,
      maxLife: 3.5
    });
  }

  shakeCamera(duration, intensity) {
    this.camera.shakeTimer = duration;
    this.camera.shakeIntensity = intensity;
  }

  checkCollision(x, y, radius) {
    for (let obs of this.obstacles) {
      if (this.circleIntersectsRect(x, y, radius, obs)) {
        return true;
      }
    }
    return false;
  }

  circleIntersectsRect(cx, cy, r, rect) {
    const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
    const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
    const distX = cx - closestX;
    const distY = cy - closestY;
    return (distX * distX + distY * distY) < (r * r);
  }

  hasLineOfSightObstacle(x1, y1, x2, y2) {
    for (let obs of this.obstacles) {
      if (this.lineIntersectsRect(x1, y1, x2, y2, obs)) {
        return true;
      }
    }
    return false;
  }

  lineIntersectsRect(x1, y1, x2, y2, rect) {
    const rx = rect.x, ry = rect.y, rw = rect.w, rh = rect.h;
    return (
      this.lineIntersectsLine(x1, y1, x2, y2, rx, ry, rx + rw, ry) ||
      this.lineIntersectsLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh) ||
      this.lineIntersectsLine(x1, y1, x2, y2, rx + rw, ry + rh, rx, ry + rh) ||
      this.lineIntersectsLine(x1, y1, x2, y2, rx, ry + rh, rx, ry)
    );
  }

  lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
    const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1);
  }

  update(dt, player) {
    if (!player) return;

    // Update Camera position (smooth lerp)
    this.camera.targetX = player.x - this.camera.viewportW / 2;
    this.camera.targetY = player.y - this.camera.viewportH / 2;

    this.camera.x += (this.camera.targetX - this.camera.x) * 8.0 * dt;
    this.camera.y += (this.camera.targetY - this.camera.y) * 8.0 * dt;

    // Clamp camera within world bounds
    this.camera.x = Math.max(0, Math.min(this.width - this.camera.viewportW, this.camera.x));
    this.camera.y = Math.max(0, Math.min(this.height - this.camera.viewportH, this.camera.y));

    // Camera shake
    if (this.camera.shakeTimer > 0) {
      this.camera.shakeTimer -= dt;
      this.camera.x += (Math.random() - 0.5) * this.camera.shakeIntensity * 2;
      this.camera.y += (Math.random() - 0.5) * this.camera.shakeIntensity * 2;
    }

    // Update Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      const stepX = p.vx * dt;
      const stepY = p.vy * dt;
      p.x += stepX;
      p.y += stepY;
      p.traveled += Math.hypot(stepX, stepY);

      let destroyed = false;

      // Check wall collision
      if (this.checkCollision(p.x, p.y, p.radius) || p.traveled >= p.range) {
        destroyed = true;
        this.createSparks(p.x, p.y, 4, p.color);
      }

      // Check player collision if enemy projectile
      if (!destroyed && p.source === "enemy") {
        const distToPlayer = Math.hypot(p.x - player.x, p.y - player.y);
        if (distToPlayer <= player.radius + p.radius) {
          destroyed = true;
          if (p.isExplosive) {
            this.createExplosion(p.x, p.y, 50);
          }
          if (window.Stats) {
            window.Stats.takeDamage(p.damage, "machine_laser");
          }
          this.createSparks(p.x, p.y, 8, "#EA4335");
        }
      }

      // Check enemy collision if player projectile
      if (!destroyed && p.source === "player") {
        for (let enemy of this.enemyManager.enemies) {
          if (enemy.isDead) continue;
          const distToEnemy = Math.hypot(p.x - enemy.x, p.y - enemy.y);
          if (distToEnemy <= enemy.radius + p.radius) {
            destroyed = true;
            enemy.takeDamage(p.damage, this);
            this.createSparks(p.x, p.y, 6, p.color);
            break;
          }
        }
      }

      if (destroyed) {
        this.projectiles.splice(i, 1);
      }
    }

    // Update EMP pulses
    for (let i = this.empPulses.length - 1; i >= 0; i--) {
      const emp = this.empPulses[i];
      emp.life -= dt;
      emp.radius += (emp.maxRadius - emp.radius) * 12.0 * dt;
      if (emp.life <= 0) {
        this.empPulses.splice(i, 1);
      }
    }

    // Update Orbital Strikes
    for (let i = this.orbitalStrikes.length - 1; i >= 0; i--) {
      const orb = this.orbitalStrikes[i];
      orb.delay -= dt;
      if (orb.delay <= 0 && !orb.triggered) {
        orb.triggered = true;
        this.createExplosion(orb.x, orb.y, orb.radius);
        if (window.AudioManager) window.AudioManager.playSfx("explosion");

        // Damage player if in strike radius
        const dist = Math.hypot(player.x - orb.x, player.y - orb.y);
        if (dist <= orb.radius && window.Stats) {
          window.Stats.takeDamage(orb.damage, "orbital_strike");
        }
        this.orbitalStrikes.splice(i, 1);
      }
    }

    // Update Ground item auto-pickup if close
    for (let i = this.groundItems.length - 1; i >= 0; i--) {
      const item = this.groundItems[i];
      item.animTimer += dt;
      const dist = Math.hypot(player.x - item.x, player.y - item.y);
      if (dist <= player.radius + item.radius + 12) {
        if (window.PlayerInventory && window.PlayerInventory.addItem(item.itemId, item.qty)) {
          if (window.AudioManager) window.AudioManager.playSfx("pickup");
          this.addFloatingText(item.x, item.y - 12, `+${item.qty} ${item.name}`, "#34A853");
          if (window.Events) {
            window.Events.emit("resource_collected", { itemId: item.itemId, qty: item.qty });
          }
          this.groundItems.splice(i, 1);
        }
      }
    }

    // Detect Nearest Interactive Object
    this.nearInteractive = null;
    let closestDist = 75;

    for (let obj of this.interactiveObjects) {
      const dist = Math.hypot(player.x - obj.x, player.y - obj.y);
      if (dist < closestDist) {
        this.nearInteractive = obj;
        closestDist = dist;
      }
    }

    // Check exit area
    if (this.exitArea) {
      const exitCenter = { x: this.exitArea.x + this.exitArea.w / 2, y: this.exitArea.y + this.exitArea.h / 2 };
      const dist = Math.hypot(player.x - exitCenter.x, player.y - exitCenter.y);
      if (dist < 85) {
        this.nearInteractive = {
          type: "exit_portal",
          label: this.exitArea.label,
          prompt: "Proceed to Next Sector",
          data: this.exitArea
        };
      }
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const part = this.particles[i];
      part.life -= dt;
      if (part.isShockwave) {
        part.size += (part.maxSize - part.size) * 10 * dt;
      } else {
        part.x += part.vx * dt;
        part.y += part.vy * dt;
      }
      if (part.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update Floating text
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life -= dt;
      ft.y -= 25 * dt;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // Update Announcements
    for (let i = this.announcements.length - 1; i >= 0; i--) {
      const a = this.announcements[i];
      a.life -= dt;
      if (a.life <= 0) {
        this.announcements.splice(i, 1);
      }
    }

    // Update Enemies
    this.enemyManager.update(dt, player, this);
  }

  draw(ctx, player) {
    ctx.save();
    ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

    // 1. Draw Floor Grid & Patterns
    this.drawFloor(ctx);

    // 2. Draw Obstacles & Walls
    this.drawObstacles(ctx);

    // 3. Draw Exit Portal
    this.drawExitArea(ctx);

    // 4. Draw Interactive Objects (terminals, chests, lore)
    this.drawInteractiveObjects(ctx);

    // 5. Draw Ground Item Pickups
    this.drawGroundItems(ctx);

    // 6. Draw Orbital Strike Reticles
    this.drawOrbitalStrikes(ctx);

    // 7. Draw Enemies
    this.enemyManager.draw(ctx);

    // 8. Draw Player
    if (player) {
      player.draw(ctx);
    }

    // 9. Draw Projectiles
    this.drawProjectiles(ctx);

    // 10. Draw EMP Pulses & Particles
    this.drawEffects(ctx);

    // 11. Draw Floating text
    this.drawFloatingTexts(ctx);

    ctx.restore();

    // 12. Draw Screen-Space Announcements
    this.drawAnnouncements(ctx);
  }

  drawFloor(ctx) {
    const startX = Math.floor(this.camera.x / 100) * 100;
    const startY = Math.floor(this.camera.y / 100) * 100;
    const endX = this.camera.x + this.camera.viewportW + 100;
    const endY = this.camera.y + this.camera.viewportH + 100;

    // Fill background
    ctx.fillStyle = this.levelData ? this.levelData.ambientColor : "#0F172A";
    ctx.fillRect(this.camera.x, this.camera.y, this.camera.viewportW, this.camera.viewportH);

    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = startX; x <= endX; x += 80) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += 80) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.stroke();
  }

  drawObstacles(ctx) {
    for (let obs of this.obstacles) {
      // Drop Shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(obs.x + 4, obs.y + 6, obs.w, obs.h);

      // Main Block
      ctx.fillStyle = "#1E293B";
      ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

      // Sci-fi Border Trim
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

      // Label if large building
      if (obs.label && obs.w > 120 && obs.h > 100) {
        ctx.fillStyle = "#64748B";
        ctx.font = "bold 12px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(obs.label, obs.x + obs.w / 2, obs.y + obs.h / 2);
      }
    }
  }

  drawExitArea(ctx) {
    if (!this.exitArea) return;
    const e = this.exitArea;

    ctx.fillStyle = "rgba(52, 168, 83, 0.25)"; // GDG Green exit beacon
    ctx.fillRect(e.x, e.y, e.w, e.h);

    ctx.strokeStyle = "#34A853";
    ctx.lineWidth = 3;
    ctx.strokeRect(e.x, e.y, e.w, e.h);

    ctx.fillStyle = "#F8FAFC";
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(e.label, e.x + e.w / 2, e.y + e.h / 2);
  }

  drawInteractiveObjects(ctx) {
    for (let obj of this.interactiveObjects) {
      ctx.save();
      ctx.translate(obj.x, obj.y);

      if (obj.type === "terminal" || obj.type === "final_console") {
        // Holographic Terminal Pillar
        ctx.fillStyle = "#0F172A";
        ctx.fillRect(-16, -16, 32, 32);
        ctx.strokeStyle = obj.hacked ? "#34A853" : "#4285F4"; // Blue or Green
        ctx.lineWidth = 2;
        ctx.strokeRect(-16, -16, 32, 32);

        // Glowing Screen
        ctx.fillStyle = obj.hacked ? "#34A853" : "#00E5FF";
        ctx.fillRect(-10, -10, 20, 20);

      } else if (obj.type === "chest") {
        // Supply Crate
        ctx.fillStyle = "#78350F";
        ctx.fillRect(-18, -14, 36, 28);
        ctx.strokeStyle = "#FBBC04";
        ctx.lineWidth = 2;
        ctx.strokeRect(-18, -14, 36, 28);

      } else if (obj.type === "lore_log") {
        // Audio / Data Pad
        ctx.fillStyle = "#1E1B4B";
        ctx.fillRect(-12, -16, 24, 32);
        ctx.strokeStyle = "#818CF8";
        ctx.lineWidth = 2;
        ctx.strokeRect(-12, -16, 24, 32);

      } else if (obj.type === "healing_station") {
        // Healing Pod
        ctx.fillStyle = "#064E3B";
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#34A853";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  drawGroundItems(ctx) {
    for (let item of this.groundItems) {
      const bob = Math.sin(item.animTimer * 4) * 3;
      ctx.save();
      ctx.translate(item.x, item.y + bob);

      // Glowing Halo
      ctx.fillStyle = "rgba(251, 188, 4, 0.25)";
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();

      // Diamond Pickup Shape
      ctx.fillStyle = item.category === "consumable" ? "#34A853" : "#FBBC04";
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.lineTo(8, 0);
      ctx.lineTo(0, 8);
      ctx.lineTo(-8, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#F8FAFC";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    }
  }

  drawOrbitalStrikes(ctx) {
    for (let orb of this.orbitalStrikes) {
      const progress = 1.0 - (orb.delay / orb.maxDelay);
      ctx.strokeStyle = "rgba(234, 67, 53, 0.8)";
      ctx.lineWidth = 2;

      // Outer target ring
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Contracting warning ring
      ctx.strokeStyle = "#EA4335";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, Math.max(5, orb.radius * (1.0 - progress)), 0, Math.PI * 2);
      ctx.stroke();

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(orb.x - orb.radius - 8, orb.y);
      ctx.lineTo(orb.x + orb.radius + 8, orb.y);
      ctx.moveTo(orb.x, orb.y - orb.radius - 8);
      ctx.lineTo(orb.x, orb.y + orb.radius + 8);
      ctx.stroke();
    }
  }

  drawProjectiles(ctx) {
    for (let p of this.projectiles) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawEffects(ctx) {
    // EMP pulses
    for (let emp of this.empPulses) {
      const alpha = emp.life / emp.maxLife;
      ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(emp.x, emp.y, emp.radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Particles
    for (let part of this.particles) {
      if (part.isShockwave) {
        ctx.strokeStyle = part.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.fillStyle = part.color;
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  drawFloatingTexts(ctx) {
    ctx.font = "bold 14px system-ui, sans-serif";
    ctx.textAlign = "center";
    for (let ft of this.floatingTexts) {
      const alpha = ft.life / ft.maxLife;
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
    }
  }

  drawAnnouncements(ctx) {
    if (this.announcements.length === 0) return;
    const a = this.announcements[0];

    const alpha = Math.min(1.0, a.life / 0.5);
    ctx.save();
    ctx.fillStyle = `rgba(15, 23, 42, ${0.85 * alpha})`;
    ctx.fillRect(this.camera.viewportW * 0.2, 80, this.camera.viewportW * 0.6, 50);

    ctx.strokeStyle = a.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.camera.viewportW * 0.2, 80, this.camera.viewportW * 0.6, 50);

    ctx.fillStyle = a.color;
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(a.text, this.camera.viewportW * 0.5, 112);
    ctx.restore();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WorldManager };
}
if (typeof window !== 'undefined') {
  window.WorldManager = WorldManager;
}
