// AI APOCALYPSE — Player Character Entity
// Powered by GDG Assiut

class Player {
  constructor(x = 200, y = 900) {
    this.x = x;
    this.y = y;
    this.radius = 18;
    this.rotation = 0; // radians
    this.fireTimer = 0;
    this.interactCooldown = 0;
    this.isMoving = false;
    this.walkAnimTimer = 0;
    this.muzzleFlashTimer = 0;
  }

  resetPosition(x, y) {
    this.x = x;
    this.y = y;
    this.fireTimer = 0;
  }

  update(dt, input, world) {
    if (!input || !world) return;

    if (this.fireTimer > 0) this.fireTimer -= dt;
    if (this.interactCooldown > 0) this.interactCooldown -= dt;
    if (this.muzzleFlashTimer > 0) this.muzzleFlashTimer -= dt;

    const stats = window.Stats;
    const inv = window.PlayerInventory;

    // Movement calculation
    const move = input.getMovementVector();
    const isSprinting = input.isSprinting() && stats && stats.stamina > 5;
    let speed = stats ? stats.getSpeed() : 190;
    if (isSprinting) speed *= 1.45;

    this.isMoving = (move.x !== 0 || move.y !== 0);
    if (this.isMoving) {
      this.walkAnimTimer += dt * 10;
    }

    if (stats) {
      stats.update(dt, isSprinting && this.isMoving);
    }

    // Attempt movement with wall collision sliding
    const newX = this.x + move.x * speed * dt;
    const newY = this.y + move.y * speed * dt;

    if (!world.checkCollision(newX, this.y, this.radius)) {
      this.x = newX;
    }
    if (!world.checkCollision(this.x, newY, this.radius)) {
      this.y = newY;
    }

    // Keep inside map bounds
    this.x = Math.max(this.radius + 40, Math.min(world.width - this.radius - 40, this.x));
    this.y = Math.max(this.radius + 40, Math.min(world.height - this.radius - 40, this.y));

    // Aim rotation towards mouse / aim target
    const targetWorldX = input.mouse.worldX;
    const targetWorldY = input.mouse.worldY;
    this.rotation = Math.atan2(targetWorldY - this.y, targetWorldX - this.x);

    // Attack handling
    if (input.isAttacking() && this.fireTimer <= 0) {
      this.fireWeapon(world);
    }
  }

  fireWeapon(world) {
    const inv = window.PlayerInventory;
    const stats = window.Stats;
    const weapon = inv ? inv.getEquippedWeapon() : null;
    if (!weapon || !stats) return;

    // Check energy cost
    if (weapon.energyCost > 0) {
      if (!stats.consumeEnergy(weapon.energyCost)) {
        // Out of energy sound
        if (window.AudioManager) window.AudioManager.playSfx("dry_fire");
        this.fireTimer = 0.4;
        return;
      }
    }

    this.fireTimer = weapon.fireRate || 0.25;
    this.muzzleFlashTimer = 0.08;

    const dmgMult = stats.getDamageMultiplier();
    const finalDamage = Math.round(weapon.damage * dmgMult);

    if (weapon.isAoe) {
      // EMP shockwave
      world.createEmpPulse(this.x, this.y, weapon.range || 240, finalDamage, weapon.stunDuration || 5.0);
      if (window.AudioManager) window.AudioManager.playSfx("emp");
    } else if (weapon.isMelee) {
      // Shock Baton Arc
      world.createMeleeArc(this.x, this.y, this.rotation, weapon.range || 100, finalDamage);
      if (window.AudioManager) window.AudioManager.playSfx("shock");
    } else {
      // Projectile Shot (Energy Blaster or Pulse Rifle)
      const spawnX = this.x + Math.cos(this.rotation) * 24;
      const spawnY = this.y + Math.sin(this.rotation) * 24;
      world.createProjectile({
        x: spawnX,
        y: spawnY,
        angle: this.rotation,
        speed: weapon.bulletSpeed || 650,
        damage: finalDamage,
        range: weapon.range || 600,
        color: weapon.bulletColor || "#4285F4",
        source: "player"
      });

      if (window.AudioManager) {
        if (weapon.id === "weapon_pulse_rifle") {
          window.AudioManager.playSfx("laser_pulse");
        } else {
          window.AudioManager.playSfx("laser_blaster");
        }
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Draw Headlamp / Flashlight Vision Cone
    const flashlightGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 320);
    flashlightGrad.addColorStop(0, "rgba(66, 133, 244, 0.35)");
    flashlightGrad.addColorStop(0.5, "rgba(66, 133, 244, 0.12)");
    flashlightGrad.addColorStop(1, "rgba(66, 133, 244, 0)");

    ctx.save();
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 320, -Math.PI * 0.22, Math.PI * 0.22);
    ctx.closePath();
    ctx.fillStyle = flashlightGrad;
    ctx.fill();
    ctx.restore();

    // Rotate player body
    ctx.rotate(this.rotation);

    // Legs animation
    if (this.isMoving) {
      const legOffset = Math.sin(this.walkAnimTimer) * 6;
      ctx.fillStyle = "#334155";
      ctx.fillRect(-8, -14 + legOffset, 6, 8);
      ctx.fillRect(-8, 6 - legOffset, 6, 8);
    }

    // Tactical Backpack
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(-16, -11, 8, 22, 3);
    ctx.fill();
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Survivor Torso / Exosuit
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#4285F4"; // GDG Blue tactical trim
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Weapon Arm & Barrel
    const weapon = window.PlayerInventory ? window.PlayerInventory.getEquippedWeapon() : null;
    const weaponColor = weapon ? weapon.bulletColor : "#4285F4";

    ctx.fillStyle = "#334155";
    ctx.fillRect(8, 4, 16, 6);
    ctx.fillStyle = weaponColor;
    ctx.fillRect(16, 5, 10, 4);

    // Muzzle Flash
    if (this.muzzleFlashTimer > 0) {
      ctx.fillStyle = "#FBBC04"; // GDG Yellow flash
      ctx.beginPath();
      ctx.arc(28, 7, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFF";
      ctx.beginPath();
      ctx.arc(28, 7, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Survivor Visor / Headgear (Neon Cyan HUD Visor)
    ctx.fillStyle = "#00E5FF";
    ctx.beginPath();
    ctx.arc(4, 0, 6, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.lineTo(4, 0);
    ctx.closePath();
    ctx.fill();

    // Energy Shield Aura if active
    if (window.Stats && window.Stats.shieldTimer > 0) {
      ctx.strokeStyle = "rgba(0, 229, 255, 0.7)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 8, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Player };
}
if (typeof window !== 'undefined') {
  window.Player = Player;
}
