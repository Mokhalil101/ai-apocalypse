// AI APOCALYPSE — Enemy Manager & Survival Wave Spawner
// Powered by GDG Assiut

class EnemyManager {
  constructor() {
    this.enemies = [];
    this.bossControllers = [];
    this.survivalSpawnTimer = 0;
    this.survivalWaveEnemiesRemaining = 0;
  }

  loadLevelEnemies(levelData) {
    this.enemies = [];
    this.bossControllers = [];

    if (!levelData || !levelData.enemySpawns) return;

    for (let spawn of levelData.enemySpawns) {
      this.spawnEnemy(spawn);
    }
  }

  spawnEnemy(config) {
    const enemy = new Enemy(config);
    this.enemies.push(enemy);

    if (enemy.isBoss) {
      const bCtrl = new BossController(enemy);
      this.bossControllers.push(bCtrl);
    }

    return enemy;
  }

  alertAlliesInRange(centerX, centerY, radius, targetPos) {
    for (let enemy of this.enemies) {
      if (enemy.isDead) continue;
      const dist = Math.hypot(enemy.x - centerX, enemy.y - centerY);
      if (dist <= radius) {
        if (enemy.ai.state !== ENEMY_STATES.CHASE && enemy.ai.state !== ENEMY_STATES.ATTACK) {
          enemy.ai.state = ENEMY_STATES.INVESTIGATE;
          enemy.ai.investigateTarget = { ...targetPos };
          enemy.ai.detectionMeter = 0.8;
        }
      }
    }
  }

  update(dt, player, world) {
    // Update individual enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (enemy.isDead) {
        // Keep corpse briefly or remove
        this.enemies.splice(i, 1);
        continue;
      }
      enemy.update(dt, player, world);
    }

    // Update Boss controllers
    for (let bCtrl of this.bossControllers) {
      bCtrl.update(dt, player, world);
    }

    // Survival Mode Wave Spawner
    if (window.GameStateManager && window.GameStateManager.currentMode === "SURVIVAL") {
      this.updateSurvivalWaves(dt, player, world);
    }
  }

  updateSurvivalWaves(dt, player, world) {
    const gsm = window.GameStateManager;
    gsm.survivalTimer += dt;

    // Check if current wave is cleared
    if (this.enemies.length === 0 && this.survivalWaveEnemiesRemaining <= 0) {
      gsm.survivalWave++;
      gsm.survivalScore += gsm.survivalWave * 100;
      this.survivalWaveEnemiesRemaining = 4 + (gsm.survivalWave * 2);

      if (world.addAnnouncement) {
        world.addAnnouncement(`WAVE ${gsm.survivalWave} INCOMING!`, "#FBBC04");
      }
      if (window.AudioManager) {
        window.AudioManager.playSfx("alert");
      }

      // Check achievement
      if (gsm.survivalWave >= 5 && window.Achievements) {
        window.Achievements.unlock("ach_survival_wave_5");
      }
    }

    // Spawn wave enemies over time
    this.survivalSpawnTimer -= dt;
    if (this.survivalSpawnTimer <= 0 && this.survivalWaveEnemiesRemaining > 0) {
      this.survivalSpawnTimer = 2.0;
      this.survivalWaveEnemiesRemaining--;

      // Pick enemy type based on wave
      let eType = "scout_drone";
      const w = gsm.survivalWave;
      const roll = Math.random();

      if (w >= 6 && roll < 0.25) {
        eType = "heavy_guardian";
      } else if (w >= 3 && roll < 0.55) {
        eType = "hunter_unit";
      } else if (w >= 2 && roll < 0.8) {
        eType = "security_bot";
      }

      // Random position along map perimeter
      const angle = Math.random() * Math.PI * 2;
      const spawnDist = 700;
      const sx = Math.max(80, Math.min(world.width - 80, player.x + Math.cos(angle) * spawnDist));
      const sy = Math.max(80, Math.min(world.height - 80, player.y + Math.sin(angle) * spawnDist));

      this.spawnEnemy({
        enemyType: eType,
        x: sx,
        y: sy,
        patrolWaypoints: [{ x: sx, y: sy }, { x: player.x, y: player.y }]
      });
    }
  }

  draw(ctx) {
    for (let enemy of this.enemies) {
      enemy.draw(ctx);
    }
  }

  getActiveBoss() {
    for (let e of this.enemies) {
      if (e.isBoss && !e.isDead) return e;
    }
    return null;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EnemyManager };
}
if (typeof window !== 'undefined') {
  window.EnemyManager = EnemyManager;
}
