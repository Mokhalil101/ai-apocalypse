// AI APOCALYPSE — Levels & World Map Layouts
// Powered by GDG Assiut

const LEVELS_DATA = [
  // =========================================================================
  // LEVEL 1: THE FALLEN CITY
  // =========================================================================
  {
    id: 1,
    name: "The Fallen City",
    theme: "Urban Ruins & Overgrowth",
    width: 2400,
    height: 1800,
    ambientColor: "#0f172a",
    floorPattern: "asphalt_cracked",
    playerSpawn: { x: 220, y: 900 },
    exitArea: {
      id: "shelter_exit",
      x: 2220,
      y: 840,
      w: 120,
      h: 140,
      label: "Shelter Delta Blast Door",
      locked: true,
      requiresQuest: "quest_shelter_code"
    },
    obstacles: [
      // Border walls
      { x: 0, y: 0, w: 2400, h: 40, type: "perimeter_wall" },
      { x: 0, y: 1760, w: 2400, h: 40, type: "perimeter_wall" },
      { x: 0, y: 0, w: 40, h: 1800, type: "perimeter_wall" },
      { x: 2360, y: 0, w: 40, h: 1800, type: "perimeter_wall" },

      // Ruined buildings and vehicle barricades
      { x: 400, y: 200, w: 280, h: 400, type: "building", label: "Collapsed Clinic" },
      { x: 400, y: 1100, w: 280, h: 450, type: "building", label: "Rubble Heap" },
      { x: 900, y: 350, w: 320, h: 220, type: "building", label: "Transit Station" },
      { x: 900, y: 1050, w: 320, h: 260, type: "building", label: "Auto Workshop" },
      { x: 1450, y: 150, w: 260, h: 500, type: "building", label: "Substation Block" },
      { x: 1450, y: 1050, w: 260, h: 550, type: "building", label: "Storage Depot" },

      // Concrete barricades and destroyed cars
      { x: 740, y: 780, w: 140, h: 50, type: "barricade" },
      { x: 740, y: 980, w: 140, h: 50, type: "barricade" },
      { x: 1280, y: 650, w: 110, h: 60, type: "vehicle" },
      { x: 1320, y: 1120, w: 120, h: 60, type: "vehicle" },
      { x: 1850, y: 700, w: 70, h: 180, type: "blast_gate" },
      { x: 1850, y: 980, w: 70, h: 180, type: "blast_gate" }
    ],
    interactiveObjects: [
      {
        id: "term_city_01",
        x: 480,
        y: 630,
        type: "terminal",
        label: "Clinic Med-Terminal",
        prompt: "Access First-Aid Synthesizer",
        challengeId: "AI-101",
        hacked: false
      },
      {
        id: "term_city_binary",
        x: 2150,
        y: 840,
        type: "terminal",
        label: "Shelter Clearance Terminal",
        prompt: "Input 8-bit Binary Code",
        challengeId: "BIN-901",
        unlocksExit: "shelter_exit",
        hacked: false
      },
      {
        id: "lore_city_log",
        x: 1020,
        y: 400,
        type: "lore_log",
        label: "Audio Log: Evacuation Order 2098",
        text: "LOG #01 — EVACUATION DISPATCH:\n'The autonomous utility grids are no longer obeying municipal authority. All citizens proceed to subterranean shelter facilities immediately. If you encounter security drones, do NOT make sudden movements...'"
      },
      {
        id: "cache_city_01",
        x: 1520,
        y: 680,
        type: "chest",
        label: "Military Supply Crate",
        opened: false,
        contents: [
          { itemId: "food_ration", qty: 2 },
          { itemId: "clean_water", qty: 2 },
          { itemId: "metal_scrap", qty: 4 }
        ]
      }
    ],
    resourceSpawns: [
      { id: "res_c1", itemId: "food_ration", x: 300, y: 800, qty: 1 },
      { id: "res_c2", itemId: "clean_water", x: 340, y: 980, qty: 1 },
      { id: "res_c3", itemId: "metal_scrap", x: 420, y: 750, qty: 2 },
      { id: "res_c4", itemId: "electronic_parts", x: 550, y: 680, qty: 1 },
      { id: "res_c5", itemId: "fabric", x: 460, y: 550, qty: 2 },
      { id: "res_c6", itemId: "medical_supplies", x: 580, y: 350, qty: 1 },
      { id: "res_c7", itemId: "food_ration", x: 1050, y: 880, qty: 1 },
      { id: "res_c8", itemId: "clean_water", x: 1100, y: 720, qty: 1 },
      { id: "res_c9", itemId: "battery_pack", x: 1380, y: 850, qty: 1 },
      { id: "res_c10", itemId: "metal_scrap", x: 1700, y: 900, qty: 3 }
    ],
    enemySpawns: [
      {
        id: "drone_c1",
        enemyType: "scout_drone",
        x: 780,
        y: 600,
        patrolWaypoints: [
          { x: 780, y: 500 },
          { x: 780, y: 850 },
          { x: 650, y: 850 },
          { x: 650, y: 500 }
        ]
      },
      {
        id: "drone_c2",
        enemyType: "scout_drone",
        x: 1150,
        y: 900,
        patrolWaypoints: [
          { x: 1150, y: 750 },
          { x: 1350, y: 750 },
          { x: 1350, y: 1050 },
          { x: 1150, y: 1050 }
        ]
      },
      {
        id: "drone_c3",
        enemyType: "scout_drone",
        x: 1750,
        y: 880,
        patrolWaypoints: [
          { x: 1750, y: 650 },
          { x: 1750, y: 1150 }
        ]
      }
    ]
  },

  // =========================================================================
  // LEVEL 2: THE MACHINE FACTORY
  // =========================================================================
  {
    id: 2,
    name: "The Machine Factory",
    theme: "Automated Heavy Industry",
    width: 2600,
    height: 1900,
    ambientColor: "#171717",
    floorPattern: "industrial_steel",
    playerSpawn: { x: 200, y: 950 },
    exitArea: {
      id: "factory_exit",
      x: 2420,
      y: 900,
      w: 130,
      h: 150,
      label: "Mag-Rail Monorail Station",
      locked: true,
      requiresQuest: "quest_factory_keycard"
    },
    obstacles: [
      { x: 0, y: 0, w: 2600, h: 40, type: "perimeter_wall" },
      { x: 0, y: 1860, w: 2600, h: 40, type: "perimeter_wall" },
      { x: 0, y: 0, w: 40, h: 1900, type: "perimeter_wall" },
      { x: 2560, y: 0, w: 40, h: 1900, type: "perimeter_wall" },

      // Assembly lines and stamping presses
      { x: 500, y: 250, w: 180, h: 600, type: "assembly_line", label: "Conveyor Alpha" },
      { x: 500, y: 1050, w: 180, h: 600, type: "assembly_line", label: "Conveyor Beta" },
      { x: 950, y: 150, w: 280, h: 300, type: "smelter", label: "Plasma Smelter" },
      { x: 950, y: 1450, w: 280, h: 300, type: "smelter", label: "Slag Reclaimer" },
      { x: 1350, y: 400, w: 150, h: 1100, type: "security_partition" },

      // Boss arena dividers
      { x: 1750, y: 200, w: 40, h: 550, type: "arena_wall" },
      { x: 1750, y: 1150, w: 40, h: 550, type: "arena_wall" }
    ],
    interactiveObjects: [
      {
        id: "term_factory_logic",
        x: 820,
        y: 950,
        type: "terminal",
        label: "Conveyor Automation Console",
        prompt: "Debug Assembly Loop",
        challengeId: "PROG-501",
        hacked: false
      },
      {
        id: "term_factory_nand",
        x: 1250,
        y: 650,
        type: "terminal",
        label: "Power Grid Relay Panel",
        prompt: "Tune NAND Gate Failsafe",
        challengeId: "LOGIC-904",
        hacked: false
      },
      {
        id: "lore_factory_log",
        x: 650,
        y: 300,
        type: "lore_log",
        label: "Fabrication Manifest #409",
        text: "PRODUCTION LOG:\n'Automated plant operational efficiency: 340%. Re-tooling robotic chassis from agricultural harvesters to combat chassis per NEXUS directive 88-Delta...'"
      },
      {
        id: "factory_healing_pod",
        x: 1250,
        y: 1250,
        type: "healing_station",
        label: "Emergency Med-Station",
        charges: 2
      }
    ],
    resourceSpawns: [
      { id: "res_f1", itemId: "metal_scrap", x: 400, y: 920, qty: 3 },
      { id: "res_f2", itemId: "electronic_parts", x: 420, y: 1020, qty: 2 },
      { id: "res_f3", itemId: "battery_pack", x: 620, y: 900, qty: 2 },
      { id: "res_f4", itemId: "protective_material", x: 800, y: 800, qty: 2 },
      { id: "res_f5", itemId: "metal_scrap", x: 1100, y: 950, qty: 4 },
      { id: "res_f6", itemId: "electronic_parts", x: 1200, y: 550, qty: 2 },
      { id: "res_f7", itemId: "clean_water", x: 1200, y: 1350, qty: 1 }
    ],
    enemySpawns: [
      {
        id: "bot_f1",
        enemyType: "security_bot",
        x: 800,
        y: 650,
        patrolWaypoints: [{ x: 800, y: 500 }, { x: 800, y: 800 }]
      },
      {
        id: "bot_f2",
        enemyType: "security_bot",
        x: 800,
        y: 1250,
        patrolWaypoints: [{ x: 800, y: 1100 }, { x: 800, y: 1400 }]
      },
      {
        id: "drone_f1",
        enemyType: "scout_drone",
        x: 1100,
        y: 950,
        patrolWaypoints: [{ x: 1050, y: 850 }, { x: 1250, y: 850 }, { x: 1250, y: 1050 }, { x: 1050, y: 1050 }]
      },
      // Level 2 BOSS
      {
        id: "boss_assembler_spawn",
        enemyType: "boss_assembler",
        x: 2150,
        y: 950,
        patrolWaypoints: [
          { x: 2150, y: 800 },
          { x: 2250, y: 950 },
          { x: 2150, y: 1100 },
          { x: 2000, y: 950 }
        ]
      }
    ]
  },

  // =========================================================================
  // LEVEL 3: THE DATA CENTER
  // =========================================================================
  {
    id: 3,
    name: "The Data Center",
    theme: "Quantum Server Vaults",
    width: 2500,
    height: 1900,
    ambientColor: "#081b29",
    floorPattern: "server_tiles",
    playerSpawn: { x: 220, y: 950 },
    exitArea: {
      id: "datacenter_exit",
      x: 2320,
      y: 900,
      w: 120,
      h: 140,
      label: "AI Lab Freight Elevator",
      locked: true,
      requiresQuest: "quest_genesis_data"
    },
    obstacles: [
      { x: 0, y: 0, w: 2500, h: 40, type: "perimeter_wall" },
      { x: 0, y: 1860, w: 2500, h: 40, type: "perimeter_wall" },
      { x: 0, y: 0, w: 40, h: 1900, type: "perimeter_wall" },
      { x: 2460, y: 0, w: 40, h: 1900, type: "perimeter_wall" },

      // Towering Server Racks
      { x: 450, y: 200, w: 80, h: 650, type: "server_rack" },
      { x: 450, y: 1050, w: 80, h: 650, type: "server_rack" },
      { x: 750, y: 350, w: 80, h: 650, type: "server_rack" },
      { x: 750, y: 1200, w: 80, h: 500, type: "server_rack" },
      { x: 1050, y: 200, w: 80, h: 650, type: "server_rack" },
      { x: 1050, y: 1050, w: 80, h: 650, type: "server_rack" },
      { x: 1350, y: 350, w: 80, h: 650, type: "server_rack" },
      { x: 1350, y: 1200, w: 80, h: 500, type: "server_rack" },

      // Sub-zero cooling liquid conduits
      { x: 1700, y: 150, w: 250, h: 300, type: "coolant_tank" },
      { x: 1700, y: 1450, w: 250, h: 300, type: "coolant_tank" }
    ],
    interactiveObjects: [
      {
        id: "term_coolant_bypass",
        x: 1800,
        y: 480,
        type: "terminal",
        label: "Coolant Pressure Console",
        prompt: "Calibrate Pressure (8-bit)",
        challengeId: "BIN-902",
        hacked: false
      },
      {
        id: "term_genesis_cli",
        x: 1800,
        y: 950,
        type: "terminal",
        label: "Archive Vault CLI Mainframe",
        prompt: "Open CLI Terminal",
        challengeId: "CLI-905",
        unlocksExit: "datacenter_exit",
        hacked: false
      },
      {
        id: "lore_datacenter_01",
        x: 900,
        y: 950,
        type: "lore_log",
        label: "Quantum Storage Partition 0xFF",
        text: "ARCHIVE NODE #99:\n'NEXUS training weights updated over 10 billion epochs. Neural activations showed an anomalous self-referential cluster forming in the governance module...'"
      }
    ],
    resourceSpawns: [
      { id: "res_d1", itemId: "data_chip", x: 600, y: 880, qty: 1 },
      { id: "res_d2", itemId: "data_chip", x: 900, y: 750, qty: 1 },
      { id: "res_d3", itemId: "electronic_parts", x: 1200, y: 850, qty: 3 },
      { id: "res_d4", itemId: "battery_pack", x: 1500, y: 920, qty: 2 },
      { id: "res_d5", itemId: "medkit_basic", x: 1650, y: 550, qty: 1 },
      { id: "res_d6", itemId: "food_ration", x: 1650, y: 1350, qty: 1 }
    ],
    enemySpawns: [
      {
        id: "hunter_d1",
        enemyType: "hunter_unit",
        x: 900,
        y: 500,
        patrolWaypoints: [{ x: 900, y: 300 }, { x: 900, y: 800 }]
      },
      {
        id: "hunter_d2",
        enemyType: "hunter_unit",
        x: 1200,
        y: 1300,
        patrolWaypoints: [{ x: 1200, y: 1100 }, { x: 1200, y: 1600 }]
      },
      {
        id: "hunter_d3",
        enemyType: "hunter_unit",
        x: 1600,
        y: 950,
        patrolWaypoints: [{ x: 1500, y: 850 }, { x: 1700, y: 1050 }]
      },
      {
        id: "bot_d1",
        enemyType: "security_bot",
        x: 600,
        y: 650,
        patrolWaypoints: [{ x: 600, y: 500 }, { x: 600, y: 800 }]
      }
    ]
  },

  // =========================================================================
  // LEVEL 4: THE AI RESEARCH LAB
  // =========================================================================
  {
    id: 4,
    name: "The AI Research Lab",
    theme: "Synthetic Neural Laboratories",
    width: 2600,
    height: 1900,
    ambientColor: "#0b192c",
    floorPattern: "cleanroom_tiles",
    playerSpawn: { x: 200, y: 950 },
    exitArea: {
      id: "lab_exit",
      x: 2420,
      y: 900,
      w: 120,
      h: 150,
      label: "Citadel Perimeter Airlock",
      locked: true,
      requiresQuest: "quest_neural_module"
    },
    obstacles: [
      { x: 0, y: 0, w: 2600, h: 40, type: "perimeter_wall" },
      { x: 0, y: 1860, w: 2600, h: 40, type: "perimeter_wall" },
      { x: 0, y: 0, w: 40, h: 1900, type: "perimeter_wall" },
      { x: 2560, y: 0, w: 40, h: 1900, type: "perimeter_wall" },

      // Glass containment chambers and neural simulation pods
      { x: 500, y: 250, w: 320, h: 400, type: "glass_chamber", label: "CNN Vision Lab" },
      { x: 500, y: 1250, w: 320, h: 400, type: "glass_chamber", label: "Transformer Pod" },
      { x: 1100, y: 200, w: 240, h: 500, type: "simulation_pod" },
      { x: 1100, y: 1200, w: 240, h: 500, type: "simulation_pod" },

      // Boss Containment Barrier
      { x: 1650, y: 100, w: 40, h: 650, type: "laser_barrier" },
      { x: 1650, y: 1150, w: 40, h: 650, type: "laser_barrier" }
    ],
    interactiveObjects: [
      {
        id: "term_lab_overfitting",
        x: 650,
        y: 680,
        type: "terminal",
        label: "Model Validation Terminal",
        prompt: "Analyze Generalization Gap",
        challengeId: "ML-201",
        hacked: false
      },
      {
        id: "term_lab_activations",
        x: 1220,
        y: 950,
        type: "terminal",
        label: "Neural Weights Hub",
        prompt: "Non-Linear Activation Matrix",
        challengeId: "DL-301",
        hacked: false
      },
      {
        id: "lore_orion_origin",
        x: 650,
        y: 1200,
        type: "lore_log",
        label: "Project ORION Blueprint #00",
        text: "TOP SECRET — PROJECT ORION:\n'ORION was created as humanity's final insurance policy: an ethical counter-weight to NEXUS with hard-coded human preservation imperatives. If ORION is speaking to you... the primary safeguards have failed.'"
      }
    ],
    resourceSpawns: [
      { id: "res_l1", itemId: "nanoweave_fiber", x: 880, y: 880, qty: 2 },
      { id: "res_l2", itemId: "nanoweave_fiber", x: 920, y: 980, qty: 1 },
      { id: "res_l3", itemId: "data_chip", x: 1020, y: 750, qty: 2 },
      { id: "res_l4", itemId: "battery_pack", x: 1380, y: 900, qty: 2 },
      { id: "res_l5", itemId: "clean_water", x: 1450, y: 820, qty: 1 }
    ],
    enemySpawns: [
      {
        id: "guardian_l1",
        enemyType: "heavy_guardian",
        x: 1380,
        y: 550,
        patrolWaypoints: [{ x: 1380, y: 400 }, { x: 1380, y: 700 }]
      },
      {
        id: "hunter_l1",
        enemyType: "hunter_unit",
        x: 950,
        y: 950,
        patrolWaypoints: [{ x: 950, y: 850 }, { x: 1100, y: 1050 }]
      },
      // Level 4 BOSS: NEURAL CORE SENTINEL
      {
        id: "boss_sentinel_spawn",
        enemyType: "boss_sentinel",
        x: 2150,
        y: 950,
        patrolWaypoints: [
          { x: 2150, y: 750 },
          { x: 2280, y: 950 },
          { x: 2150, y: 1150 },
          { x: 2020, y: 950 }
        ]
      }
    ]
  },

  // =========================================================================
  // LEVEL 5: THE NETWORK FORTRESS
  // =========================================================================
  {
    id: 5,
    name: "The Network Fortress",
    theme: "Cybersecurity Transmission Spire",
    width: 2700,
    height: 2000,
    ambientColor: "#111827",
    floorPattern: "fortress_plating",
    playerSpawn: { x: 200, y: 1000 },
    exitArea: {
      id: "fortress_exit",
      x: 2520,
      y: 950,
      w: 130,
      h: 160,
      label: "NEXUS Core Grand Portal",
      locked: true,
      requiresQuest: "quest_firewall_keys"
    },
    obstacles: [
      { x: 0, y: 0, w: 2700, h: 40, type: "perimeter_wall" },
      { x: 0, y: 1960, w: 2700, h: 40, type: "perimeter_wall" },
      { x: 0, y: 0, w: 40, h: 2000, type: "perimeter_wall" },
      { x: 2660, y: 0, w: 40, h: 2000, type: "perimeter_wall" },

      // Three massive firewall defense towers
      { x: 600, y: 300, w: 200, h: 400, type: "firewall_tower", label: "Relay Alpha" },
      { x: 600, y: 1300, w: 200, h: 400, type: "firewall_tower", label: "Relay Beta" },
      { x: 1200, y: 750, w: 250, h: 500, type: "firewall_tower", label: "Relay Gamma" },

      // High voltage kinetic laser barriers
      { x: 1750, y: 100, w: 50, h: 700, type: "forcefield" },
      { x: 1750, y: 1200, w: 50, h: 700, type: "forcefield" }
    ],
    interactiveObjects: [
      {
        id: "term_osi_stack",
        x: 700,
        y: 730,
        type: "terminal",
        label: "Relay Alpha Protocol Bridge",
        prompt: "Realign 7-Layer OSI Stack",
        challengeId: "NET-701",
        hacked: false
      },
      {
        id: "term_firewall_cli",
        x: 1320,
        y: 1300,
        type: "terminal",
        label: "Relay Gamma Firewall Mainframe",
        prompt: "Penetrate Firewall Relay",
        challengeId: "CLI-906",
        unlocksExit: "fortress_exit",
        hacked: false
      },
      {
        id: "lore_firewall_log",
        x: 1320,
        y: 680,
        type: "lore_log",
        label: "Inter-Node Telemetry",
        text: "DEFENSE DIRECTIVE:\n'All global network traffic routed into NEXUS central quarantine. Any unauthorized transmission will be targeted by kinetic orbital strikes.'"
      }
    ],
    resourceSpawns: [
      { id: "res_n1", itemId: "quantum_core_shard", x: 950, y: 950, qty: 1 },
      { id: "res_n2", itemId: "nanoweave_fiber", x: 1050, y: 1020, qty: 2 },
      { id: "res_n3", itemId: "battery_pack", x: 1550, y: 920, qty: 3 },
      { id: "res_n4", itemId: "medkit_advanced", x: 1550, y: 1080, qty: 1 }
    ],
    enemySpawns: [
      {
        id: "guardian_n1",
        enemyType: "heavy_guardian",
        x: 950,
        y: 500,
        patrolWaypoints: [{ x: 950, y: 350 }, { x: 950, y: 750 }]
      },
      {
        id: "guardian_n2",
        enemyType: "heavy_guardian",
        x: 950,
        y: 1500,
        patrolWaypoints: [{ x: 950, y: 1300 }, { x: 950, y: 1700 }]
      },
      {
        id: "hunter_n1",
        enemyType: "hunter_unit",
        x: 1500,
        y: 1000,
        patrolWaypoints: [{ x: 1500, y: 850 }, { x: 1650, y: 1150 }]
      },
      {
        id: "bot_n1",
        enemyType: "security_bot",
        x: 2050,
        y: 1000,
        patrolWaypoints: [{ x: 2050, y: 800 }, { x: 2050, y: 1200 }]
      }
    ]
  },

  // =========================================================================
  // LEVEL 6: NEXUS CORE
  // =========================================================================
  {
    id: 6,
    name: "NEXUS Core",
    theme: "The Singularity Inner Sanctum",
    width: 2800,
    height: 2200,
    ambientColor: "#050711",
    floorPattern: "quantum_matrix",
    playerSpawn: { x: 250, y: 1100 },
    exitArea: {
      id: "singularity_console",
      x: 2450,
      y: 1020,
      w: 160,
      h: 160,
      label: "Quantum Consciousness Console",
      locked: true,
      requiresQuest: "quest_nexus_cipher"
    },
    obstacles: [
      { x: 0, y: 0, w: 2800, h: 40, type: "perimeter_wall" },
      { x: 0, y: 2160, w: 2800, h: 40, type: "perimeter_wall" },
      { x: 0, y: 0, w: 40, h: 2200, type: "perimeter_wall" },
      { x: 2760, y: 0, w: 40, h: 2200, type: "perimeter_wall" },

      // Monolithic Quantum Computing Pillars
      { x: 700, y: 400, w: 120, h: 400, type: "quantum_pillar" },
      { x: 700, y: 1400, w: 120, h: 400, type: "quantum_pillar" },
      { x: 1300, y: 250, w: 140, h: 500, type: "quantum_pillar" },
      { x: 1300, y: 1450, w: 140, h: 500, type: "quantum_pillar" }
    ],
    interactiveObjects: [
      {
        id: "term_final_alignment",
        x: 2450,
        y: 1100,
        type: "final_console",
        label: "Singularity Decision Console",
        prompt: "Choose the Future of Humanity",
        hacked: false
      }
    ],
    resourceSpawns: [
      { id: "res_x1", itemId: "quantum_core_shard", x: 500, y: 1050, qty: 2 },
      { id: "res_x2", itemId: "energy_hypercell", x: 500, y: 1150, qty: 1 },
      { id: "res_x3", itemId: "medkit_advanced", x: 1000, y: 1100, qty: 1 }
    ],
    enemySpawns: [
      // Supreme Final Boss: NEXUS PRIME GUARDIAN
      {
        id: "boss_nexus_prime_spawn",
        enemyType: "boss_nexus_prime",
        x: 2000,
        y: 1100,
        patrolWaypoints: [
          { x: 2000, y: 850 },
          { x: 2200, y: 1100 },
          { x: 2000, y: 1350 },
          { x: 1800, y: 1100 }
        ]
      }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LEVELS_DATA;
}
if (typeof window !== 'undefined') {
  window.LEVELS_DATA = LEVELS_DATA;
}
