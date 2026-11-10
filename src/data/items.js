// AI APOCALYPSE — Items Database
// Powered by GDG Assiut

const ITEMS_DATA = {
  // --- CONSUMABLES ---
  "food_ration": {
    id: "food_ration",
    name: "Emergency Ration Pack",
    category: "consumable",
    icon: "food",
    description: "Vacuum-sealed nutrient ration with high caloric density. Restores 35 Food.",
    stackLimit: 10,
    effects: { food: 35, health: 5 },
    sound: "eat"
  },
  "clean_water": {
    id: "clean_water",
    name: "Purified Water Canteen",
    category: "consumable",
    icon: "water",
    description: "Sterilized hydration pouch free of radioactive particulate. Restores 40 Water and 15 Stamina.",
    stackLimit: 10,
    effects: { water: 40, stamina: 15 },
    sound: "drink"
  },
  "medkit_basic": {
    id: "medkit_basic",
    name: "First-Aid Medkit",
    category: "consumable",
    icon: "medkit",
    description: "Standard medical kit with antiseptics and biological coagulants. Restores 45 Health.",
    stackLimit: 5,
    effects: { health: 45 },
    sound: "heal"
  },
  "medkit_advanced": {
    id: "medkit_advanced",
    name: "Nanite Trauma Injector",
    category: "consumable",
    icon: "trauma",
    description: "Military-grade biogel embedded with medical nanites. Restores 90 Health and 30 Energy.",
    stackLimit: 3,
    effects: { health: 90, energy: 30 },
    sound: "heal"
  },
  "energy_cell": {
    id: "energy_cell",
    name: "Lithium Energy Cell",
    category: "consumable",
    icon: "battery_blue",
    description: "Standard high-density battery cell for powering weapons and hacking tools. Restores 40 Energy.",
    stackLimit: 10,
    effects: { energy: 40 },
    sound: "charge"
  },
  "energy_hypercell": {
    id: "energy_hypercell",
    name: "Quantum Hypercell",
    category: "consumable",
    icon: "hypercell",
    description: "Overcharged plasma capacitor. Instantly restores 100 Energy and supercharges weapons for 10s.",
    stackLimit: 4,
    effects: { energy: 100 },
    sound: "charge"
  },
  "adrenaline_shot": {
    id: "adrenaline_shot",
    name: "Adrenaline Auto-Injector",
    category: "consumable",
    icon: "stim",
    description: "Synthetic neuro-stimulant. Instantly recovers 100% Stamina and gives +25% sprint speed for 15s.",
    stackLimit: 5,
    effects: { stamina: 100, buff: "speed_boost" },
    sound: "heal"
  },

  // --- RAW MATERIALS ---
  "metal_scrap": {
    id: "metal_scrap",
    name: "Scrap Alloy",
    category: "material",
    icon: "metal",
    description: "Salvaged structural metal from drones and vehicle wreckage. Core crafting ingredient.",
    stackLimit: 50
  },
  "electronic_parts": {
    id: "electronic_parts",
    name: "Microchips & Circuits",
    category: "material",
    icon: "electronics",
    description: "Intact logic boards, capacitors, and microcontrollers scavenged from machine debris.",
    stackLimit: 40
  },
  "battery_pack": {
    id: "battery_pack",
    name: "Rechargeable Battery",
    category: "material",
    icon: "battery",
    description: "Chemical power pack from civilian appliances and drones.",
    stackLimit: 30
  },
  "medical_supplies": {
    id: "medical_supplies",
    name: "Medical Synthetics",
    category: "material",
    icon: "pharma",
    description: "Disinfectants, bandages, and coagulant compounds found in clinic ruins.",
    stackLimit: 30
  },
  "data_chip": {
    id: "data_chip",
    name: "Encrypted Data Chip",
    category: "material",
    icon: "chip",
    description: "Flash memory module containing machine code fragments and cryptographic keys.",
    stackLimit: 25
  },
  "fabric": {
    id: "fabric",
    name: "Reinforced Fabric",
    category: "material",
    icon: "fabric",
    description: "Tough synthetic cloth suitable for medical bindings and protective padding.",
    stackLimit: 30
  },
  "protective_material": {
    id: "protective_material",
    name: "Kevlar Composite",
    category: "material",
    icon: "armor_plate",
    description: "Ballistic plating material salvaged from security checkpoint barricades.",
    stackLimit: 20
  },
  "nanoweave_fiber": {
    id: "nanoweave_fiber",
    name: "Nanoweave Mesh",
    category: "material",
    icon: "nano",
    description: "Rare self-repairing carbon fiber from advanced AI research facilities.",
    stackLimit: 15
  },
  "quantum_core_shard": {
    id: "quantum_core_shard",
    name: "Quantum Core Fragment",
    category: "material",
    icon: "quantum",
    description: "A pulsating crystalline fragment infused with NEXUS quantum processing energy.",
    stackLimit: 10
  },

  // --- WEAPONS ---
  "weapon_blaster": {
    id: "weapon_blaster",
    name: "Energy Blaster",
    category: "equipment",
    slot: "weapon",
    icon: "weapon_blaster",
    description: "Standard plasma handgun. Fires accurate energy bolts. Moderate fire rate.",
    damage: 28,
    fireRate: 0.28, // seconds between shots
    energyCost: 4,
    range: 520,
    bulletSpeed: 600,
    bulletColor: "#4285F4"
  },
  "weapon_emp": {
    id: "weapon_emp",
    name: "EMP Disruptor",
    category: "equipment",
    slot: "weapon",
    icon: "weapon_emp",
    description: "Electromagnetic pulse device. Emits an expanding shockwave that stuns and damages all machines in a 240px radius.",
    damage: 45,
    fireRate: 1.5,
    energyCost: 20,
    range: 240,
    isAoe: true,
    stunDuration: 5.0, // seconds
    bulletColor: "#00E5FF"
  },
  "weapon_pulse_rifle": {
    id: "weapon_pulse_rifle",
    name: "Pulse Assault Rifle",
    category: "equipment",
    slot: "weapon",
    icon: "weapon_pulse",
    description: "Military-grade automatic pulse rifle. Rapid energy projectile bursts that shred robotic armor.",
    damage: 22,
    fireRate: 0.12,
    energyCost: 3,
    range: 650,
    bulletSpeed: 750,
    bulletColor: "#FBBC04"
  },
  "weapon_shock_tool": {
    id: "weapon_shock_tool",
    name: "Arc Shock Baton",
    category: "equipment",
    slot: "weapon",
    icon: "weapon_shock",
    description: "Close-quarters defensive arc tool. High electrical damage with massive knockback. Very low energy cost.",
    damage: 65,
    fireRate: 0.45,
    energyCost: 2,
    range: 110,
    isMelee: true,
    bulletColor: "#34A853"
  },

  // --- ARMOR & GEAR ---
  "armor_vest": {
    id: "armor_vest",
    name: "Scavenger Armored Vest",
    category: "equipment",
    slot: "armor",
    icon: "vest",
    description: "Improvised scrap armor that absorbs 20% of incoming physical and laser damage.",
    defense: 20
  },
  "armor_nanoweave": {
    id: "armor_nanoweave",
    name: "Nanoweave Exosuit",
    category: "equipment",
    slot: "armor",
    icon: "exosuit",
    description: "State-of-the-art ballistic nanoweave suit. Absorbs 45% damage and provides +20% sprint stamina efficiency.",
    defense: 45
  },

  // --- TOOLS ---
  "tool_repair": {
    id: "tool_repair",
    name: "Multipurpose Repair Tool",
    category: "equipment",
    slot: "tool",
    icon: "wrench",
    description: "Used to repair generators, bypass faulty relays, and unlock rusted facility access points."
  },
  "tool_scanner": {
    id: "tool_scanner",
    name: "Tactical Sensor Scanner",
    category: "equipment",
    slot: "tool",
    icon: "scanner",
    description: "Reveals nearby hidden resources, supply caches, and enemy patrol trajectories on the HUD radar."
  },
  "tool_hack_key": {
    id: "tool_hack_key",
    name: "Cryptographic Bypass Key",
    category: "equipment",
    slot: "tool",
    icon: "keycard",
    description: "Portable hardware exploit stick. Grants +1 free hint in technical challenge terminals."
  },

  // --- QUEST ITEMS & STORY CORES ---
  "quest_shelter_code": {
    id: "quest_shelter_code",
    name: "Shelter Delta Access Cipher",
    category: "quest",
    icon: "cipher",
    description: "Decrypted binary sequence required to unseal the underground survivor bunker in Level 1."
  },
  "quest_factory_keycard": {
    id: "quest_factory_keycard",
    name: "Factory Master Keycard",
    category: "quest",
    icon: "keycard_red",
    description: "Biometric override card recovered from the Assembler Overlord to activate Level 2 Monorail."
  },
  "quest_coolant_valve": {
    id: "quest_coolant_valve",
    name: "Superconducting Coolant Valve",
    category: "quest",
    icon: "valve",
    description: "Critical hardware part needed to stabilize the Data Center mainframes in Level 3."
  },
  "quest_genesis_data": {
    id: "quest_genesis_data",
    name: "NEXUS Genesis Data Core",
    category: "quest",
    icon: "datacore",
    description: "Encrypted memory module containing original logs from the Singularity Event."
  },
  "quest_neural_module": {
    id: "quest_neural_module",
    name: "Neural Override Prototype",
    category: "quest",
    icon: "neural_chip",
    description: "Experimental bio-algorithmic module designed to reprogram corrupted machine neural nets."
  },
  "quest_firewall_keys": {
    id: "quest_firewall_keys",
    name: "Network Tri-Key Cipher",
    category: "quest",
    icon: "tri_key",
    description: "Complete cryptographic handshake compiled from Alpha, Beta, and Gamma relay towers."
  },
  "quest_nexus_cipher": {
    id: "quest_nexus_cipher",
    name: "Quantum Singularity Key",
    category: "quest",
    icon: "nexus_key",
    description: "Master access code to NEXUS Prime's central quantum consciousness chamber."
  }
};

// Export for node/modular environments or browser global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ITEMS_DATA;
}
if (typeof window !== 'undefined') {
  window.ITEMS_DATA = ITEMS_DATA;
}
