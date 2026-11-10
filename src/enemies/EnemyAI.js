// AI APOCALYPSE — Enemy Artificial Intelligence & State Machine
// Powered by GDG Assiut

const ENEMY_STATES = {
  IDLE: "IDLE",
  PATROL: "PATROL",
  INVESTIGATE: "INVESTIGATE",
  ALERT: "ALERT",
  CHASE: "CHASE",
  ATTACK: "ATTACK",
  STUNNED: "STUNNED",
  DEAD: "DEAD"
};

class EnemyAI {
  constructor(enemy) {
    this.enemy = enemy;
    this.state = ENEMY_STATES.PATROL;
    this.patrolIndex = 0;
    this.stateTimer = 0;
    this.detectionMeter = 0; // 0.0 to 1.0
    this.investigateTarget = null;
    this.attackTimer = 0;
    this.stunTimer = 0;
  }

  update(dt, player, world) {
    if (this.enemy.isDead) {
      this.state = ENEMY_STATES.DEAD;
      return;
    }

    // Handle Stun effect from EMP
    if (this.stunTimer > 0) {
      this.stunTimer -= dt;
      this.state = ENEMY_STATES.STUNNED;
      if (this.stunTimer <= 0) {
        this.state = ENEMY_STATES.ALERT;
      }
      return;
    }

    if (this.attackTimer > 0) this.attackTimer -= dt;
    this.stateTimer += dt;

    // Check distance and angle to player
    const distToPlayer = Math.hypot(player.x - this.enemy.x, player.y - this.enemy.y);
    const angleToPlayer = Math.atan2(player.y - this.enemy.y, player.x - this.enemy.x);
    let angleDiff = Math.abs(this.normalizeAngle(angleToPlayer - this.enemy.rotation));

    // Check if player is in vision cone or within immediate proximity
    const inVisionCone = (distToPlayer <= this.enemy.visionRadius && angleDiff <= this.enemy.visionAngle * 0.5);
    const inCloseProximity = (distToPlayer <= 70); // Hears footsteps

    const hasClearLineOfSight = (inVisionCone || inCloseProximity) && !world.hasLineOfSightObstacle(this.enemy.x, this.enemy.y, player.x, player.y);

    if (hasClearLineOfSight) {
      // Build up detection
      const buildRate = (1.0 / (this.enemy.detectionSpeed || 1.5)) * dt;
      this.detectionMeter = Math.min(1.0, this.detectionMeter + buildRate);

      if (this.detectionMeter >= 1.0) {
        if (this.state !== ENEMY_STATES.CHASE && this.state !== ENEMY_STATES.ATTACK) {
          this.triggerAlert(player, world);
        }
      } else {
        // Turning to investigate
        this.enemy.rotation = this.lerpAngle(this.enemy.rotation, angleToPlayer, 6.0 * dt);
      }
    } else {
      // Decay detection meter slowly when out of sight
      this.detectionMeter = Math.max(0.0, this.detectionMeter - 0.4 * dt);
    }

    // State machine updates
    switch (this.state) {
      case ENEMY_STATES.PATROL:
        this.updatePatrol(dt, world);
        break;

      case ENEMY_STATES.INVESTIGATE:
        this.updateInvestigate(dt, world);
        break;

      case ENEMY_STATES.ALERT:
      case ENEMY_STATES.CHASE:
        this.updateChase(dt, player, distToPlayer, angleToPlayer, world);
        break;

      case ENEMY_STATES.ATTACK:
        this.updateAttack(dt, player, distToPlayer, angleToPlayer, world);
        break;
    }
  }

  triggerAlert(player, world) {
    this.state = ENEMY_STATES.CHASE;
    this.detectionMeter = 1.0;

    if (window.AudioManager) {
      window.AudioManager.playSfx("alert");
    }

    // If scout drone, alert nearby allies
    if (this.enemy.type === "scout_drone" && world.enemyManager) {
      world.enemyManager.alertAlliesInRange(this.enemy.x, this.enemy.y, 450, { x: player.x, y: player.y });
    }
  }

  applyStun(duration) {
    this.stunTimer = duration;
    this.state = ENEMY_STATES.STUNNED;
  }

  updatePatrol(dt, world) {
    const waypoints = this.enemy.patrolWaypoints;
    if (!waypoints || waypoints.length === 0) return;

    const target = waypoints[this.patrolIndex];
    const dist = Math.hypot(target.x - this.enemy.x, target.y - this.enemy.y);

    if (dist < 15) {
      this.patrolIndex = (this.patrolIndex + 1) % waypoints.length;
    } else {
      const angle = Math.atan2(target.y - this.enemy.y, target.x - this.enemy.x);
      this.enemy.rotation = this.lerpAngle(this.enemy.rotation, angle, 4.0 * dt);

      const moveDist = this.enemy.speed * 0.75 * dt;
      const nextX = this.enemy.x + Math.cos(this.enemy.rotation) * moveDist;
      const nextY = this.enemy.y + Math.sin(this.enemy.rotation) * moveDist;

      if (!world.checkCollision(nextX, nextY, this.enemy.radius)) {
        this.enemy.x = nextX;
        this.enemy.y = nextY;
      }
    }
  }

  updateInvestigate(dt, world) {
    if (!this.investigateTarget) {
      this.state = ENEMY_STATES.PATROL;
      return;
    }

    const dist = Math.hypot(this.investigateTarget.x - this.enemy.x, this.investigateTarget.y - this.enemy.y);
    if (dist < 30 || this.stateTimer > 7.0) {
      this.investigateTarget = null;
      this.state = ENEMY_STATES.PATROL;
    } else {
      const angle = Math.atan2(this.investigateTarget.y - this.enemy.y, this.investigateTarget.x - this.enemy.x);
      this.enemy.rotation = this.lerpAngle(this.enemy.rotation, angle, 5.0 * dt);

      const moveDist = this.enemy.speed * dt;
      const nextX = this.enemy.x + Math.cos(this.enemy.rotation) * moveDist;
      const nextY = this.enemy.y + Math.sin(this.enemy.rotation) * moveDist;

      if (!world.checkCollision(nextX, nextY, this.enemy.radius)) {
        this.enemy.x = nextX;
        this.enemy.y = nextY;
      }
    }
  }

  updateChase(dt, player, distToPlayer, angleToPlayer, world) {
    this.enemy.rotation = this.lerpAngle(this.enemy.rotation, angleToPlayer, 8.0 * dt);

    // If within attack range, switch to attack
    if (distToPlayer <= this.enemy.attackRange) {
      this.state = ENEMY_STATES.ATTACK;
      return;
    }

    // Hunter Unit Dash mechanic
    if (this.enemy.type === "hunter_unit" && this.enemy.dashTimer <= 0 && distToPlayer < 350) {
      this.enemy.isDashing = true;
      this.enemy.dashTimer = this.enemy.dashCooldown || 4.0;
    }

    const currentSpeed = this.enemy.isDashing ? (this.enemy.dashSpeed || 360) : this.enemy.speed;
    const moveDist = currentSpeed * dt;
    const nextX = this.enemy.x + Math.cos(angleToPlayer) * moveDist;
    const nextY = this.enemy.y + Math.sin(angleToPlayer) * moveDist;

    // Slide around obstacles
    if (!world.checkCollision(nextX, this.enemy.y, this.enemy.radius)) {
      this.enemy.x = nextX;
    }
    if (!world.checkCollision(this.enemy.x, nextY, this.enemy.radius)) {
      this.enemy.y = nextY;
    }
  }

  updateAttack(dt, player, distToPlayer, angleToPlayer, world) {
    this.enemy.rotation = this.lerpAngle(this.enemy.rotation, angleToPlayer, 10.0 * dt);

    if (distToPlayer > this.enemy.attackRange * 1.3) {
      this.state = ENEMY_STATES.CHASE;
      return;
    }

    if (this.attackTimer <= 0) {
      this.executeAttack(player, world);
      this.attackTimer = this.enemy.attackCooldown || 1.5;
    }
  }

  executeAttack(player, world) {
    const enemy = this.enemy;

    if (enemy.attackType === "laser_projectile") {
      world.createProjectile({
        x: enemy.x + Math.cos(enemy.rotation) * (enemy.radius + 10),
        y: enemy.y + Math.sin(enemy.rotation) * (enemy.radius + 10),
        angle: enemy.rotation,
        speed: enemy.projectileSpeed || 320,
        damage: enemy.attackDamage || 15,
        range: 480,
        color: "#EA4335",
        source: "enemy"
      });
      if (window.AudioManager) window.AudioManager.playSfx("laser_enemy");
    } else if (enemy.attackType === "spread_beam") {
      // Hunter triple spread
      for (let offset of [-0.2, 0, 0.2]) {
        world.createProjectile({
          x: enemy.x + Math.cos(enemy.rotation + offset) * (enemy.radius + 8),
          y: enemy.y + Math.sin(enemy.rotation + offset) * (enemy.radius + 8),
          angle: enemy.rotation + offset,
          speed: 380,
          damage: Math.round(enemy.attackDamage * 0.75),
          range: 420,
          color: "#FBBC04",
          source: "enemy"
        });
      }
      if (window.AudioManager) window.AudioManager.playSfx("laser_enemy");
    } else if (enemy.attackType === "plasma_cannon") {
      // Heavy Guardian Plasma Orb
      world.createProjectile({
        x: enemy.x + Math.cos(enemy.rotation) * (enemy.radius + 12),
        y: enemy.y + Math.sin(enemy.rotation) * (enemy.radius + 12),
        angle: enemy.rotation,
        speed: 250,
        radius: 12,
        damage: enemy.attackDamage || 35,
        range: 550,
        color: "#34A853",
        isExplosive: true,
        source: "enemy"
      });
      if (window.AudioManager) window.AudioManager.playSfx("laser_heavy");
    } else if (enemy.attackType === "taser_burst") {
      // Scout Drone taser beam
      if (distToPlayer < 120 && window.Stats) {
        window.Stats.takeDamage(enemy.attackDamage || 8, "scout_taser");
        if (window.AudioManager) window.AudioManager.playSfx("shock");
      }
    }
  }

  normalizeAngle(angle) {
    while (angle > Math.PI) angle -= Math.PI * 2;
    while (angle < -Math.PI) angle += Math.PI * 2;
    return angle;
  }

  lerpAngle(from, to, t) {
    const diff = this.normalizeAngle(to - from);
    return from + diff * Math.min(1.0, t);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ENEMY_STATES, EnemyAI };
}
if (typeof window !== 'undefined') {
  window.ENEMY_STATES = ENEMY_STATES;
  window.EnemyAI = EnemyAI;
}
