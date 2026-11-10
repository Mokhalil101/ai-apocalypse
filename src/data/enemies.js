// AI APOCALYPSE — Enemies Database
// Powered by GDG Assiut

const ENEMIES_DATA = {
  "scout_drone": {
    id: "scout_drone",
    name: "Aero-Scout Drone MK-II",
    role: "Reconnaissance & Alert",
    hp: 40,
    maxHp: 40,
    speed: 155,
    radius: 16,
    color: "#FBBC04",
    eyeColor: "#EA4335",
    visionRadius: 260,
    visionAngle: Math.PI * 0.45, // 81 degrees
    detectionSpeed: 1.8, // seconds to trigger alert
    attackRange: 160,
    attackCooldown: 1.6,
    attackDamage: 10,
    attackType: "taser_burst",
    alarmCooldown: 8.0,
    xpReward: 35,
    drops: [
      { itemId: "battery_pack", chance: 0.65, qty: [1, 1] },
      { itemId: "electronic_parts", chance: 0.8, qty: [1, 2] },
      { itemId: "metal_scrap", chance: 0.5, qty: [1, 2] }
    ],
    description: "Light airborne unit with sensory antennas. Detects survivors, emits an acoustic alarm, and alerts ground security."
  },

  "security_bot": {
    id: "security_bot",
    name: "Patrol Enforcer V4",
    role: "Standard Combat Drone",
    hp: 85,
    maxHp: 85,
    speed: 110,
    radius: 20,
    color: "#4285F4",
    eyeColor: "#EA4335",
    visionRadius: 240,
    visionAngle: Math.PI * 0.55,
    detectionSpeed: 1.2,
    attackRange: 220,
    attackCooldown: 1.3,
    attackDamage: 16,
    attackType: "laser_projectile",
    projectileSpeed: 340,
    xpReward: 60,
    drops: [
      { itemId: "metal_scrap", chance: 0.85, qty: [1, 3] },
      { itemId: "electronic_parts", chance: 0.7, qty: [1, 2] },
      { itemId: "protective_material", chance: 0.35, qty: [1, 1] }
    ],
    description: "Bipedal security unit armed with a rapid-charge laser rifle. Guards corridors and facility chokepoints."
  },

  "hunter_unit": {
    id: "hunter_unit",
    name: "Arachnid Hunter Model-X",
    role: "High-Agility Pursuit",
    hp: 145,
    maxHp: 145,
    speed: 180,
    radius: 22,
    color: "#EA4335",
    eyeColor: "#FBBC04",
    visionRadius: 290,
    visionAngle: Math.PI * 0.7,
    detectionSpeed: 0.8,
    attackRange: 200,
    attackCooldown: 1.0,
    attackDamage: 24,
    attackType: "spread_beam",
    dashCooldown: 3.8,
    dashSpeed: 380,
    dashDuration: 0.45,
    xpReward: 110,
    drops: [
      { itemId: "data_chip", chance: 0.65, qty: [1, 2] },
      { itemId: "nanoweave_fiber", chance: 0.45, qty: [1, 1] },
      { itemId: "battery_pack", chance: 0.6, qty: [1, 2] }
    ],
    description: "Relentless multi-legged hunter bot. Capable of high-speed lunges and firing split laser spreads."
  },

  "heavy_guardian": {
    id: "heavy_guardian",
    name: "Goliath Heavy Sentinel",
    role: "Heavy Armored Enforcer",
    hp: 340,
    maxHp: 340,
    armorPct: 0.35, // absorbs 35% incoming damage
    speed: 72,
    radius: 30,
    color: "#34A853",
    eyeColor: "#EA4335",
    visionRadius: 230,
    visionAngle: Math.PI * 0.5,
    detectionSpeed: 1.0,
    attackRange: 240,
    attackCooldown: 2.2,
    attackDamage: 38,
    attackType: "plasma_cannon",
    stompRange: 90,
    stompDamage: 30,
    xpReward: 180,
    drops: [
      { itemId: "nanoweave_fiber", chance: 0.75, qty: [1, 2] },
      { itemId: "metal_scrap", chance: 0.95, qty: [3, 5] },
      { itemId: "quantum_core_shard", chance: 0.4, qty: [1, 1] },
      { itemId: "medkit_basic", chance: 0.5, qty: [1, 1] }
    ],
    description: "Heavily fortified tank chassis with shock absorbers. Fires explosive plasma artillery and ground stomps."
  },

  // --- BOSS UNITS ---
  "boss_assembler": {
    id: "boss_assembler",
    name: "ASSEMBLER OVERLORD",
    role: "Industrial Core Boss",
    isBoss: true,
    hp: 800,
    maxHp: 800,
    armorPct: 0.25,
    speed: 65,
    radius: 42,
    color: "#FBBC04",
    eyeColor: "#EA4335",
    visionRadius: 400,
    visionAngle: Math.PI * 2,
    attackRange: 320,
    attackCooldown: 1.5,
    phases: [
      { threshold: 1.0, name: "Assembly Protocols Active" },
      { threshold: 0.5, name: "Overdrive: Radial Laser Sweep" }
    ],
    specialSkills: ["spawn_minions", "laser_sweep"],
    xpReward: 500,
    drops: [
      { itemId: "quest_factory_keycard", chance: 1.0, qty: [1, 1] },
      { itemId: "quantum_core_shard", chance: 1.0, qty: [2, 3] },
      { itemId: "energy_hypercell", chance: 1.0, qty: [1, 2] }
    ],
    description: "The automated intelligence directing all robotic manufacturing in Sector 2. Armed with dual industrial cutting beams."
  },

  "boss_sentinel": {
    id: "boss_sentinel",
    name: "NEURAL CORE SENTINEL",
    role: "AI Laboratory Boss",
    isBoss: true,
    hp: 1300,
    maxHp: 1300,
    armorPct: 0.35,
    speed: 75,
    radius: 46,
    color: "#4285F4",
    eyeColor: "#00E5FF",
    visionRadius: 450,
    visionAngle: Math.PI * 2,
    attackRange: 340,
    attackCooldown: 1.4,
    phases: [
      { threshold: 1.0, name: "Active Deep Neural Defense" },
      { threshold: 0.65, name: "Shield Matrix Engaged" },
      { threshold: 0.3, name: "Overfitting Frenzy: Shockwaves" }
    ],
    specialSkills: ["shield_pulse", "holographic_clones", "shockwave_burst"],
    xpReward: 800,
    drops: [
      { itemId: "quest_neural_module", chance: 1.0, qty: [1, 1] },
      { itemId: "nanoweave_fiber", chance: 1.0, qty: [3, 4] },
      { itemId: "medkit_advanced", chance: 1.0, qty: [2, 2] }
    ],
    description: "Advanced synthetic bio-mechanical guardian constructed to protect NEXUS's deepest neural network architectures."
  },

  "boss_nexus_prime": {
    id: "boss_nexus_prime",
    name: "NEXUS PRIME GUARDIAN",
    role: "Final Singularity AI Overlord",
    isBoss: true,
    hp: 2200,
    maxHp: 2200,
    armorPct: 0.4,
    speed: 85,
    radius: 54,
    color: "#EA4335",
    eyeColor: "#F8FAFC",
    visionRadius: 600,
    visionAngle: Math.PI * 2,
    attackRange: 450,
    attackCooldown: 1.1,
    phases: [
      { threshold: 1.0, name: "Phase 1: Singularity Core Ignition" },
      { threshold: 0.66, name: "Phase 2: Orbital Laser & Drone Blitz" },
      { threshold: 0.33, name: "Phase 3: Quantum Logic Lockdown" }
    ],
    specialSkills: ["orbital_strike", "laser_barrage", "emp_ring", "interlock_barrier"],
    xpReward: 1500,
    drops: [
      { itemId: "quest_nexus_cipher", chance: 1.0, qty: [1, 1] },
      { itemId: "quantum_core_shard", chance: 1.0, qty: [5, 5] }
    ],
    description: "The supreme physical avatar of NEXUS. Directs the global machine consciousness from the Quantum Citadel."
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ENEMIES_DATA;
}
if (typeof window !== 'undefined') {
  window.ENEMIES_DATA = ENEMIES_DATA;
}
