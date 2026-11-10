// AI APOCALYPSE — Crafting Recipes Database
// Powered by GDG Assiut

const RECIPES_DATA = [
  {
    id: "craft_medkit_basic",
    outputItemId: "medkit_basic",
    outputQty: 1,
    name: "First-Aid Medkit",
    category: "survival",
    description: "Craft a sterile first-aid pack from basic fabrics and medical synthetics.",
    ingredients: [
      { itemId: "fabric", qty: 2 },
      { itemId: "medical_supplies", qty: 1 }
    ]
  },
  {
    id: "craft_medkit_advanced",
    outputItemId: "medkit_advanced",
    outputQty: 1,
    name: "Nanite Trauma Injector",
    category: "survival",
    description: "Synthesize high-grade medical nanites with nanoweave mesh.",
    ingredients: [
      { itemId: "medkit_basic", qty: 1 },
      { itemId: "medical_supplies", qty: 2 },
      { itemId: "nanoweave_fiber", qty: 1 }
    ]
  },
  {
    id: "craft_energy_cell",
    outputItemId: "energy_cell",
    outputQty: 1,
    name: "Lithium Energy Cell",
    category: "survival",
    description: "Recondition scavenged batteries with logic circuit regulators.",
    ingredients: [
      { itemId: "battery_pack", qty: 1 },
      { itemId: "electronic_parts", qty: 2 }
    ]
  },
  {
    id: "craft_hypercell",
    outputItemId: "energy_hypercell",
    outputQty: 1,
    name: "Quantum Hypercell",
    category: "survival",
    description: "Infuse high-capacity energy cells with a raw quantum core fragment.",
    ingredients: [
      { itemId: "energy_cell", qty: 2 },
      { itemId: "battery_pack", qty: 2 },
      { itemId: "quantum_core_shard", qty: 1 }
    ]
  },
  {
    id: "craft_adrenaline",
    outputItemId: "adrenaline_shot",
    outputQty: 1,
    name: "Adrenaline Auto-Injector",
    category: "survival",
    description: "Distill pure synthetic adrenaline for emergency sprint bursts.",
    ingredients: [
      { itemId: "medical_supplies", qty: 1 },
      { itemId: "clean_water", qty: 1 }
    ]
  },
  {
    id: "craft_armor_vest",
    outputItemId: "armor_vest",
    outputQty: 1,
    name: "Scavenger Armored Vest",
    category: "defense",
    description: "Riveted scrap plating over ballistic kevlar lining.",
    ingredients: [
      { itemId: "metal_scrap", qty: 3 },
      { itemId: "protective_material", qty: 2 }
    ]
  },
  {
    id: "craft_armor_nanoweave",
    outputItemId: "armor_nanoweave",
    outputQty: 1,
    name: "Nanoweave Exosuit",
    category: "defense",
    description: "Reinforce standard armor with carbon nanoweave mesh and servomotors.",
    ingredients: [
      { itemId: "armor_vest", qty: 1 },
      { itemId: "nanoweave_fiber", qty: 3 },
      { itemId: "electronic_parts", qty: 3 }
    ]
  },
  {
    id: "craft_repair_tool",
    outputItemId: "tool_repair",
    outputQty: 1,
    name: "Multipurpose Repair Tool",
    category: "tools",
    description: "Assemble an electromagnetic wrench and solder iron.",
    ingredients: [
      { itemId: "metal_scrap", qty: 2 },
      { itemId: "electronic_parts", qty: 1 }
    ]
  },
  {
    id: "craft_scanner",
    outputItemId: "tool_scanner",
    outputQty: 1,
    name: "Tactical Sensor Scanner",
    category: "tools",
    description: "Craft a short-range lidar scanner from data chips and battery relays.",
    ingredients: [
      { itemId: "battery_pack", qty: 1 },
      { itemId: "data_chip", qty: 1 },
      { itemId: "electronic_parts", qty: 2 }
    ]
  },
  {
    id: "craft_hack_key",
    outputItemId: "tool_hack_key",
    outputQty: 1,
    name: "Cryptographic Bypass Key",
    category: "tools",
    description: "Program an automated cryptographic handshake bypass device.",
    ingredients: [
      { itemId: "electronic_parts", qty: 2 },
      { itemId: "data_chip", qty: 1 }
    ]
  },
  {
    id: "craft_weapon_emp",
    outputItemId: "weapon_emp",
    outputQty: 1,
    name: "EMP Disruptor",
    category: "weapons",
    description: "Fabricate an EMP emitter device capable of disabling autonomous machines.",
    ingredients: [
      { itemId: "battery_pack", qty: 2 },
      { itemId: "electronic_parts", qty: 3 },
      { itemId: "metal_scrap", qty: 2 }
    ]
  },
  {
    id: "craft_weapon_pulse",
    outputItemId: "weapon_pulse_rifle",
    outputQty: 1,
    name: "Pulse Assault Rifle",
    category: "weapons",
    description: "Assemble a high-frequency rapid-fire pulse weapon.",
    ingredients: [
      { itemId: "metal_scrap", qty: 4 },
      { itemId: "electronic_parts", qty: 4 },
      { itemId: "battery_pack", qty: 2 }
    ]
  },
  {
    id: "craft_weapon_shock",
    outputItemId: "weapon_shock_tool",
    outputQty: 1,
    name: "Arc Shock Baton",
    category: "weapons",
    description: "Convert scrap metal and capacitors into a lethal high-voltage arc baton.",
    ingredients: [
      { itemId: "metal_scrap", qty: 3 },
      { itemId: "electronic_parts", qty: 2 },
      { itemId: "battery_pack", qty: 1 }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = RECIPES_DATA;
}
if (typeof window !== 'undefined') {
  window.RECIPES_DATA = RECIPES_DATA;
}
