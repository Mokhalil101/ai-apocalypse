// AI APOCALYPSE — Enemy Entity & Procedural Visuals
// Powered by GDG Assiut

class Enemy {
  constructor(config = {}) {
    this.id = config.id || "enemy_" + Math.random().toString(36).substr(2, 6);
    this.type = config.enemyType || "security_bot";

    const baseData = (window.ENEMIES_DATA && window.ENEMIES_DATA[this.type]) || {};

    this.name = baseData.name || "Hostile Machine";
    this.role = baseData.role || "Automated Unit";
    this.isBoss = !!baseData.isBoss;

    this.x = config.x || 0;
    this.y = config.y || 0;
    this.rotation = config.facingAngle || 0;
    this.radius = baseData.radius || 20;

    this.hp = baseData.hp || 80;
    this.maxHp = baseData.maxHp || 80;
    this.armorPct = baseData.armorPct || 0;
    this.speed = baseData.speed || 120;

    this.visionRadius = baseData.visionRadius || 240;
    this.visionAngle = baseData.visionAngle || (Math.PI * 0.5);
    this.detectionSpeed = baseData.detectionSpeed || 1.2;

    this.attackRange = baseData.attackRange || 200;
    this.attackCooldown = baseData.attackCooldown || 1.4;
    this.attackDamage = baseData.attackDamage || 15;
    this.attackType = baseData.attackType || "laser_projectile";
    this.projectileSpeed = baseData.projectileSpeed || 320;

    this.patrolWaypoints = config.patrolWaypoints || [{ x: this.x, y: this.y }];
    this.xpReward = baseData.xpReward || 50;
    this.drops = baseData.drops || [];

    // Hunter dash state
    this.dashTimer = 0;
    this.dashCooldown = baseData.dashCooldown || 4.0;
    this.dashSpeed = baseData.dashSpeed || 380;
    this.isDashing = false;

    // Boss phases
    this.phases = baseData.phases || [];
    this.currentPhase = 1;

    this.ai = new EnemyAI(this);
    this.isDead = false;
    this.animTimer = Math.random() * 10;
  }

  update(dt, player, world) {
    if (this.isDead) return;

    this.animTimer += dt;
    if (this.dashTimer > 0) this.dashTimer -= dt;
    if (this.isDashing && this.dashTimer <= this.dashCooldown - 0.45) {
      this.isDashing = false;
    }

    this.ai.update(dt, player, world);
  }

  takeDamage(amount, world) {
    if (this.isDead) return 0;

    // Armor reduction
    const reduced = Math.max(1, Math.round(amount * (1 - this.armorPct)));
    this.hp -= reduced;

    // Alert immediately if shot from behind
    if (this.ai.state !== ENEMY_STATES.CHASE && this.ai.state !== ENEMY_STATES.ATTACK) {
      this.ai.state = ENEMY_STATES.CHASE;
      this.ai.detectionMeter = 1.0;
    }

    // Floating damage text
    if (world && world.addFloatingText) {
      world.addFloatingText(this.x, this.y - this.radius - 8, `-${reduced}`, "#EA4335");
    }

    // Spark particles
    if (world && world.createSparks) {
      world.createSparks(this.x, this.y, 8, "#FBBC04");
    }

    if (this.hp <= 0) {
      this.die(world);
    }

    return reduced;
  }

  die(world) {
    this.hp = 0;
    this.isDead = true;

    // Sound effect
    if (window.AudioManager) {
      if (this.isBoss) {
        window.AudioManager.playSfx("boss_explode");
      } else {
        window.AudioManager.playSfx("explosion");
      }
    }

    // Large explosion effect
    if (world && world.createExplosion) {
      world.createExplosion(this.x, this.y, this.radius * 2);
    }

    // Award XP
    if (window.PlayerXP) {
      window.PlayerXP.addXP(this.xpReward);
    }

    // Roll item drops
    if (world && world.spawnGroundItem && this.drops.length > 0) {
      for (let drop of this.drops) {
        if (Math.random() <= drop.chance) {
          const qty = drop.qty ? Math.floor(Math.random() * (drop.qty[1] - drop.qty[0] + 1)) + drop.qty[0] : 1;
          world.spawnGroundItem(drop.itemId, this.x + (Math.random() * 20 - 10), this.y + (Math.random() * 20 - 10), qty);
        }
      }
    }

    // Emit event
    if (window.Events) {
      window.Events.emit("enemy_killed", { enemy: this });
    }
  }

  draw(ctx) {
    if (this.isDead) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    // Draw Vision Cone during patrol or investigation
    if (this.ai.state === ENEMY_STATES.PATROL || this.ai.state === ENEMY_STATES.INVESTIGATE) {
      const coneGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, this.visionRadius);
      const isDetecting = this.ai.detectionMeter > 0;
      const coneColor = isDetecting ? "rgba(234, 67, 53, " : "rgba(251, 188, 4, "; // Red if detecting, else GDG Yellow

      coneGrad.addColorStop(0, coneColor + "0.35)");
      coneGrad.addColorStop(0.6, coneColor + "0.15)");
      coneGrad.addColorStop(1, coneColor + "0)");

      ctx.save();
      ctx.rotate(this.rotation);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, this.visionRadius, -this.visionAngle * 0.5, this.visionAngle * 0.5);
      ctx.closePath();
      ctx.fillStyle = coneGrad;
      ctx.fill();
      ctx.restore();
    }

    // Stunned electrical arcs
    if (this.ai.state === ENEMY_STATES.STUNNED) {
      ctx.strokeStyle = "#00E5FF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const sx = (Math.random() - 0.5) * this.radius * 2;
        const sy = (Math.random() - 0.5) * this.radius * 2;
        ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    }

    // Rotate body towards facing direction
    ctx.rotate(this.rotation);

    // Draw type-specific chassis
    switch (this.type) {
      case "scout_drone":
        this.drawScoutDrone(ctx);
        break;
      case "security_bot":
        this.drawSecurityBot(ctx);
        break;
      case "hunter_unit":
        this.drawHunterUnit(ctx);
        break;
      case "heavy_guardian":
        this.drawHeavyGuardian(ctx);
        break;
      case "boss_assembler":
      case "boss_sentinel":
      case "boss_nexus_prime":
        this.drawBoss(ctx);
        break;
      default:
        this.drawSecurityBot(ctx);
    }

    ctx.restore();

    // Health bar above enemy
    this.drawHealthBar(ctx);
  }

  drawScoutDrone(ctx) {
    // Twin spinning rotor wings
    const rotorOffset = Math.sin(this.animTimer * 25) * 12;
    ctx.strokeStyle = "#94A3B8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-16, -16 + rotorOffset);
    ctx.lineTo(-16, -16 - rotorOffset);
    ctx.moveTo(-16, 16 + rotorOffset);
    ctx.lineTo(-16, 16 - rotorOffset);
    ctx.stroke();

    // Aerodynamic Chassis
    ctx.fillStyle = "#1E293B";
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FBBC04";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Forward Sensor Eye
    ctx.fillStyle = this.ai.state === ENEMY_STATES.CHASE ? "#EA4335" : "#FBBC04";
    ctx.beginPath();
    ctx.arc(8, 0, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawSecurityBot(ctx) {
    // Treads
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(-18, -16, 32, 7);
    ctx.fillRect(-18, 9, 32, 7);

    // Body
    ctx.fillStyle = "#1E293B";
    ctx.beginPath();
    ctx.roundRect(-14, -12, 28, 24, 4);
    ctx.fill();
    ctx.strokeStyle = "#4285F4";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dual laser gun barrels
    ctx.fillStyle = "#475569";
    ctx.fillRect(8, -8, 14, 4);
    ctx.fillRect(8, 4, 14, 4);

    // Red optical scanner slit
    ctx.fillStyle = "#EA4335";
    ctx.fillRect(0, -3, 6, 6);
  }

  drawHunterUnit(ctx) {
    // Arachnid Legs (animated crawling)
    const legWiggle = Math.sin(this.animTimer * 12) * 5;
    ctx.strokeStyle = "#EA4335";
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    // 4 legs
    ctx.moveTo(-4, -10); ctx.lineTo(-18, -22 + legWiggle);
    ctx.moveTo(6, -10); ctx.lineTo(16, -22 - legWiggle);
    ctx.moveTo(-4, 10); ctx.lineTo(-18, 22 - legWiggle);
    ctx.moveTo(6, 10); ctx.lineTo(16, 22 + legWiggle);
    ctx.stroke();

    // Sharp diamond carapace
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(-8, -14);
    ctx.lineTo(-16, 0);
    ctx.lineTo(-8, 14);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#EA4335";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Quad eyes
    ctx.fillStyle = "#FBBC04";
    ctx.fillRect(6, -4, 3, 3);
    ctx.fillRect(6, 1, 3, 3);
  }

  drawHeavyGuardian(ctx) {
    // Massive treads
    ctx.fillStyle = "#020617";
    ctx.fillRect(-28, -26, 52, 10);
    ctx.fillRect(-28, 16, 52, 10);

    // Heavy Armored Hull
    ctx.fillStyle = "#134E4A";
    ctx.beginPath();
    ctx.roundRect(-22, -18, 44, 36, 6);
    ctx.fill();
    ctx.strokeStyle = "#34A853";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Heavy Plasma Mortar
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(4, -7, 24, 14);
    ctx.fillStyle = "#34A853";
    ctx.fillRect(16, -5, 12, 10);
  }

  drawBoss(ctx) {
    // Pulsing aura ring
    const pulse = Math.sin(this.animTimer * 4) * 4;
    ctx.strokeStyle = this.type === "boss_nexus_prime" ? "rgba(234, 67, 53, 0.6)" : "rgba(66, 133, 244, 0.6)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 8 + pulse, 0, Math.PI * 2);
    ctx.stroke();

    // Colossal Chassis
    ctx.fillStyle = "#0F172A";
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = this.type === "boss_nexus_prime" ? "#EA4335" : (this.type === "boss_sentinel" ? "#4285F4" : "#FBBC04");
    ctx.lineWidth = 4;
    ctx.stroke();

    // Quantum Core Center
    ctx.fillStyle = "#00E5FF";
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();

    // Rotating perimeter nodes
    const nodeCount = 4;
    for (let i = 0; i < nodeCount; i++) {
      const angle = (Math.PI * 2 / nodeCount) * i + (this.animTimer * 2);
      const nx = Math.cos(angle) * (this.radius - 8);
      const ny = Math.sin(angle) * (this.radius - 8);
      ctx.fillStyle = "#F8FAFC";
      ctx.beginPath();
      ctx.arc(nx, ny, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawHealthBar(ctx) {
    const barWidth = this.isBoss ? 80 : 36;
    const barHeight = this.isBoss ? 8 : 4;
    const barX = this.x - barWidth / 2;
    const barY = this.y - this.radius - (this.isBoss ? 20 : 12);

    const healthPct = Math.max(0, this.hp / this.maxHp);

    // Background
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);

    // Fill
    ctx.fillStyle = healthPct > 0.5 ? "#34A853" : (healthPct > 0.25 ? "#FBBC04" : "#EA4335");
    ctx.fillRect(barX, barY, barWidth * healthPct, barHeight);

    // Boss Name label
    if (this.isBoss) {
      ctx.fillStyle = "#F8FAFC";
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(this.name, this.x, barY - 4);
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Enemy };
}
if (typeof window !== 'undefined') {
  window.Enemy = Enemy;
}
