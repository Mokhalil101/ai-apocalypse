// AI APOCALYPSE — Player Attributes & Upgrades
// Powered by GDG Assiut

class PlayerStats {
  constructor() {
    this.baseMaxHealth = 100;
    this.baseMaxEnergy = 100;
    this.maxFood = 100;
    this.maxWater = 100;
    this.maxStamina = 100;

    this.health = 100;
    this.energy = 100;
    this.food = 100;
    this.water = 100;
    this.stamina = 100;
    this.armorDefense = 0; // percentage absorption (0 - 100)
    this.baseSpeed = 195;

    // Upgrades tiers (0 to max)
    this.upgrades = {
      weaponDamageTier: 0,
      armorDefenseTier: 0,
      scannerRangeTier: 0,
      energyCapacityTier: 0,
      healthCapacityTier: 0,
      movementSpeedTier: 0,
      inventoryCapacityTier: 0
    };

    // Active buffs
    this.speedBoostTimer = 0;
    this.shieldTimer = 0;

    // Survival hunger/thirst timers
    this.hungerTimer = 0;
    this.thirstTimer = 0;
    this.dehydrationDamageTimer = 0;

    this.recalculateCaps();
  }

  loadState(statsData) {
    if (!statsData) return;
    if (statsData.upgrades) {
      this.upgrades = { ...this.upgrades, ...statsData.upgrades };
    }
    this.recalculateCaps();

    this.health = statsData.health !== undefined ? statsData.health : this.getMaxHealth();
    this.energy = statsData.energy !== undefined ? statsData.energy : this.getMaxEnergy();
    this.food = statsData.food !== undefined ? statsData.food : 100;
    this.water = statsData.water !== undefined ? statsData.water : 100;
    this.stamina = statsData.stamina !== undefined ? statsData.stamina : 100;
  }

  recalculateCaps() {
    // Each health tier adds +25 max HP
    this.maxHealth = this.baseMaxHealth + (this.upgrades.healthCapacityTier * 25);
    // Each energy tier adds +25 max Energy
    this.maxEnergy = this.baseMaxEnergy + (this.upgrades.energyCapacityTier * 25);
  }

  getMaxHealth() {
    return this.baseMaxHealth + (this.upgrades.healthCapacityTier * 25);
  }

  getMaxEnergy() {
    return this.baseMaxEnergy + (this.upgrades.energyCapacityTier * 25);
  }

  getSpeed() {
    let speed = this.baseSpeed * (1 + this.upgrades.movementSpeedTier * 0.12);
    if (this.speedBoostTimer > 0) speed *= 1.35;
    if (this.food <= 10 || this.water <= 10) speed *= 0.75; // Weakened
    return speed;
  }

  getDamageMultiplier() {
    return 1.0 + (this.upgrades.weaponDamageTier * 0.20);
  }

  getScannerRadius() {
    return 300 + (this.upgrades.scannerRangeTier * 180);
  }

  update(dt, isSprinting = false) {
    // Update buffs
    if (this.speedBoostTimer > 0) this.speedBoostTimer -= dt;
    if (this.shieldTimer > 0) this.shieldTimer -= dt;

    // Stamina recovery or depletion
    if (isSprinting) {
      this.stamina = Math.max(0, this.stamina - (28 * dt));
    } else {
      let regenRate = 22 * dt;
      if (this.food < 25) regenRate *= 0.5; // Starvation slows recovery
      this.stamina = Math.min(this.maxStamina, this.stamina + regenRate);
    }

    // Energy slow auto-generation (1 energy every 2s)
    this.energy = Math.min(this.getMaxEnergy(), this.energy + (1.2 * dt));

    // Hunger drain: 1 food every 5 seconds
    this.hungerTimer += dt;
    if (this.hungerTimer >= 5.0) {
      this.hungerTimer = 0;
      this.food = Math.max(0, this.food - 1);
    }

    // Thirst drain: 1 water every 4 seconds
    this.thirstTimer += dt;
    if (this.thirstTimer >= 4.0) {
      this.thirstTimer = 0;
      this.water = Math.max(0, this.water - 1);
    }

    // Dehydration & Starvation hazards: damage player if empty
    if (this.food <= 0 || this.water <= 0) {
      this.dehydrationDamageTimer += dt;
      if (this.dehydrationDamageTimer >= 3.0) {
        this.dehydrationDamageTimer = 0;
        this.takeDamage(4, "dehydration");
      }
    } else {
      this.dehydrationDamageTimer = 0;
    }
  }

  takeDamage(amount, source = "enemy") {
    if (this.shieldTimer > 0) return 0; // Invulnerable under energy shield

    // Apply armor reduction
    const totalArmor = Math.min(80, this.armorDefense + (this.upgrades.armorDefenseTier * 8));
    const reducedAmount = Math.max(1, Math.round(amount * (1 - (totalArmor / 100))));

    this.health = Math.max(0, this.health - reducedAmount);

    if (window.Events) {
      window.Events.emit("player_damaged", {
        amount: reducedAmount,
        remainingHealth: this.health,
        source
      });
      if (this.health <= 0) {
        window.Events.emit("player_died", { source });
      }
    }

    return reducedAmount;
  }

  heal(amount) {
    const prev = this.health;
    this.health = Math.min(this.getMaxHealth(), this.health + amount);
    const healed = this.health - prev;
    if (window.Events && healed > 0) {
      window.Events.emit("player_healed", { amount: healed, health: this.health });
    }
    return healed;
  }

  consumeEnergy(amount) {
    if (this.energy < amount) return false;
    this.energy = Math.max(0, this.energy - amount);
    return true;
  }

  restoreEnergy(amount) {
    this.energy = Math.min(this.getMaxEnergy(), this.energy + amount);
  }

  eat(amount) {
    this.food = Math.min(this.maxFood, this.food + amount);
  }

  drink(amount) {
    this.water = Math.min(this.maxWater, this.water + amount);
  }

  applyBuff(buffName, duration) {
    if (buffName === "speed_boost") {
      this.speedBoostTimer = duration;
    } else if (buffName === "energy_shield") {
      this.shieldTimer = duration;
    }
  }
}

// Global instance
const Stats = new PlayerStats();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PlayerStats, Stats };
}
if (typeof window !== 'undefined') {
  window.PlayerStats = PlayerStats;
  window.Stats = Stats;
}
