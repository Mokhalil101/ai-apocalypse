// AI APOCALYPSE — Boss Controller & Special Attack Routines
// Powered by GDG Assiut

class BossController {
  constructor(bossEnemy) {
    this.boss = bossEnemy;
    this.specialSkillTimer = 4.0;
    this.phase = 1;
    this.shieldActive = false;
    this.shieldDuration = 0;
  }

  update(dt, player, world) {
    if (!this.boss || this.boss.isDead) return;

    if (this.shieldDuration > 0) {
      this.shieldDuration -= dt;
      if (this.shieldDuration <= 0) {
        this.shieldActive = false;
        this.boss.armorPct = 0.3;
      }
    }

    const healthPct = this.boss.hp / this.boss.maxHp;

    // Check phase transitions
    if (this.boss.phases && this.boss.phases.length > 0) {
      for (let i = this.boss.phases.length - 1; i >= 0; i--) {
        const p = this.boss.phases[i];
        if (healthPct <= p.threshold && this.phase < (i + 1)) {
          this.triggerPhaseChange(i + 1, p.name, world);
          break;
        }
      }
    }

    // Special skill cooldown
    this.specialSkillTimer -= dt;
    if (this.specialSkillTimer <= 0) {
      this.castSpecialSkill(player, world);
      this.specialSkillTimer = this.getSkillInterval();
    }
  }

  triggerPhaseChange(newPhase, phaseName, world) {
    this.phase = newPhase;

    if (window.AudioManager) {
      window.AudioManager.playSfx("alert");
    }

    if (world && world.addAnnouncement) {
      world.addAnnouncement(`BOSS PHASE ${newPhase}: ${phaseName}`, "#EA4335");
    }

    // Phase transition blast
    if (world && world.createExplosion) {
      world.createExplosion(this.boss.x, this.boss.y, 80);
    }
  }

  getSkillInterval() {
    switch (this.boss.type) {
      case "boss_assembler": return 6.0;
      case "boss_sentinel": return 5.5;
      case "boss_nexus_prime": return 4.0;
      default: return 7.0;
    }
  }

  castSpecialSkill(player, world) {
    if (!world) return;

    const b = this.boss;

    if (b.type === "boss_assembler") {
      // 1. Radial 8-beam laser burst
      const numBeams = 8;
      for (let i = 0; i < numBeams; i++) {
        const angle = (Math.PI * 2 / numBeams) * i;
        world.createProjectile({
          x: b.x + Math.cos(angle) * (b.radius + 10),
          y: b.y + Math.sin(angle) * (b.radius + 10),
          angle,
          speed: 300,
          damage: 18,
          range: 500,
          color: "#FBBC04",
          source: "enemy"
        });
      }

      // If phase 2, summon a minion drone
      if (this.phase >= 2 && world.enemyManager) {
        world.enemyManager.spawnEnemy({
          enemyType: "scout_drone",
          x: b.x + (Math.random() * 80 - 40),
          y: b.y + (Math.random() * 80 - 40)
        });
      }

      if (window.AudioManager) window.AudioManager.playSfx("laser_heavy");

    } else if (b.type === "boss_sentinel") {
      // 1. Shield Matrix activation or Shockwave
      if (Math.random() < 0.5 && !this.shieldActive) {
        this.shieldActive = true;
        this.shieldDuration = 4.5;
        this.boss.armorPct = 0.85; // 85% defense
        if (world.addFloatingText) {
          world.addFloatingText(b.x, b.y - b.radius - 12, "SHIELD MATRIX ONLINE!", "#00E5FF");
        }
      } else {
        // Shockwave EMP ring
        world.createEmpPulse(b.x, b.y, 220, 25, 1.0);
        if (window.AudioManager) window.AudioManager.playSfx("emp");
      }

    } else if (b.type === "boss_nexus_prime") {
      // 1. Orbital Target Reticle Strike
      const targetX = player.x + (Math.random() * 40 - 20);
      const targetY = player.y + (Math.random() * 40 - 20);

      world.createOrbitalStrike(targetX, targetY, 1.4, 45);

      // In Phase 3, spiral bullet-hell barrage
      if (this.phase >= 2) {
        for (let i = 0; i < 12; i++) {
          const angle = (Math.PI * 2 / 12) * i + Math.random() * 0.2;
          world.createProjectile({
            x: b.x + Math.cos(angle) * (b.radius + 15),
            y: b.y + Math.sin(angle) * (b.radius + 15),
            angle,
            speed: 320,
            damage: 22,
            range: 650,
            color: "#EA4335",
            source: "enemy"
          });
        }
      }
      if (window.AudioManager) window.AudioManager.playSfx("laser_heavy");
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BossController };
}
if (typeof window !== 'undefined') {
  window.BossController = BossController;
}
